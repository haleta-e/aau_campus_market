import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/student_model.dart';
import 'api_service.dart';
import 'storage_service.dart';

class AuthResult {
  final bool success;
  final StudentModel? student;
  final String? errorMessage;

  const AuthResult.success(this.student)
      : success = true,
        errorMessage = null;

  const AuthResult.failure(this.errorMessage)
      : success = false,
        student = null;
}

class AuthService {
  final ApiService _apiService;
  final StorageService _storageService;

  AuthService(this._apiService, this._storageService);

  /// Shared demo password for the local student directory. Real
  /// Fake Store API authentication happens separately via each
  /// student's stored API credentials (never shown in the UI).
  static const String demoPassword = 'aau@123';

  static final RegExp _campusIdPattern = RegExp(r'^UGR/\d{4}/\d{2}$');

  bool isValidCampusIdFormat(String campusId) {
    return _campusIdPattern.hasMatch(campusId.trim());
  }

  List<StudentModel>? _cachedStudents;

  Future<List<StudentModel>> _loadStudents() async {
    if (_cachedStudents != null) return _cachedStudents!;
    final raw = await rootBundle.loadString('assets/data/students.json');
    final list = jsonDecode(raw) as List;
    _cachedStudents =
        list.map((e) => StudentModel.fromJson(e as Map<String, dynamic>)).toList();
    return _cachedStudents!;
  }

  Future<AuthResult> login({
    required String campusId,
    required String password,
    required String selectedCampusId,
  }) async {
    final trimmedId = campusId.trim();

    // STEP 1: validate format
    if (!isValidCampusIdFormat(trimmedId)) {
      return const AuthResult.failure(
        'Invalid Campus ID format. Use the format UGR/1234/24.',
      );
    }

    // STEP 2: check local student dataset
    final students = await _loadStudents();
    final matches = students.where((s) => s.studentId == trimmedId).toList();
    if (matches.isEmpty) {
      return const AuthResult.failure('No student found with this Campus ID.');
    }
    final matchedStudent = matches.first;

    if (password.trim() != demoPassword) {
      return const AuthResult.failure('Incorrect password.');
    }

    // STEP 3: campus match
    if (matchedStudent.campusId != selectedCampusId) {
      return const AuthResult.failure(
        'Selected campus does not match your registered campus.',
      );
    }

    // STEP 4: authenticate via Fake Store API
    try {
      await _apiService.login(matchedStudent.apiUsername, matchedStudent.apiPassword);

      // STEP 5: save session locally
      await _storageService.saveSession(
        studentId: matchedStudent.studentId,
        name: matchedStudent.name,
        campusId: matchedStudent.campusId,
        department: matchedStudent.department,
        email: matchedStudent.email,
        phone: matchedStudent.phone,
      );
      await _storageService.saveSelectedCampus(selectedCampusId);

      return AuthResult.success(matchedStudent);
    } on ApiException catch (e) {
      return AuthResult.failure(e.message);
    } catch (e) {
      return const AuthResult.failure('Authentication failed. Please try again.');
    }
  }

  Future<void> logout() async {
    await _storageService.clearSession();
  }
}

final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(ref.watch(apiServiceProvider), ref.watch(storageServiceProvider));
});