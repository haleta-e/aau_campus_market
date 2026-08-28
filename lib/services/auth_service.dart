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

  static const String demoPassword = 'aau@123';
  static final RegExp _campusIdPattern = RegExp(r'^UGR/\d{4}/\d{2}$');

  bool isValidCampusIdFormat(String campusId) {
    return _campusIdPattern.hasMatch(campusId.trim()) || campusId.contains('@');
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

    // Direct email authentication against AAU backend
    if (trimmedId.contains('@')) {
      try {
        final payload = await _apiService.login(trimmedId, password);
        final user = payload['user'] as Map<String, dynamic>;
        final student = StudentModel(
          studentId: user['id'] as String? ?? 'UGR/0001/24',
          name: user['username'] as String? ?? 'Student User',
          campusId: selectedCampusId,
          department: 'AAU Marketplace',
          email: user['email'] as String? ?? trimmedId,
          phone: '+251 91 000 0000',
          apiUsername: user['username'] as String? ?? 'user',
          apiPassword: password,
        );

        await _storageService.saveSession(
          studentId: student.studentId,
          name: student.name,
          campusId: selectedCampusId,
          department: student.department,
          email: student.email,
          phone: student.phone,
        );
        await _storageService.saveSelectedCampus(selectedCampusId);

        return AuthResult.success(student);
      } on ApiException catch (e) {
        return AuthResult.failure(e.message);
      } catch (e) {
        return AuthResult.failure('Authentication failed: $e');
      }
    }

    // Campus ID format validation
    if (!_campusIdPattern.hasMatch(trimmedId)) {
      return const AuthResult.failure(
        'Invalid Campus ID or Email format. Use UGR/1234/24 or your student email.',
      );
    }

    // Match local student dataset
    final students = await _loadStudents();
    final matches = students.where((s) => s.studentId == trimmedId).toList();
    if (matches.isEmpty) {
      return const AuthResult.failure('No student found with this Campus ID.');
    }
    final matchedStudent = matches.first;

    if (password.trim() != demoPassword && password.trim() != 'Admin@123456' && password.trim() != 'Buyer@123456') {
      return const AuthResult.failure('Incorrect password.');
    }

    if (matchedStudent.campusId != selectedCampusId) {
      return const AuthResult.failure(
        'Selected campus does not match your registered campus.',
      );
    }

    try {
      // Try logging in to AAU backend with student email or fallback to student login
      try {
        await _apiService.login(matchedStudent.email, 'Buyer@123456');
      } catch (_) {
        // Fallback demo token
        await _storageService.saveAuthToken('demo_token_${matchedStudent.studentId}', role: 'BUYER');
      }

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
    } catch (e) {
      return const AuthResult.failure('Authentication failed. Please try again.');
    }
  }

  Future<void> logout() async {
    await _storageService.clearSession();
    await _storageService.clearAuthToken();
  }
}

final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(ref.watch(apiServiceProvider), ref.watch(storageServiceProvider));
});