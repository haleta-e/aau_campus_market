import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/student_model.dart';
import 'api_service.dart';
import 'storage_service.dart';

class AuthResult {
  final bool success;
  final StudentModel? student;
  final String? role;
  final String? errorMessage;

  const AuthResult.success(this.student, {this.role = 'BUYER'})
      : success = true,
        errorMessage = null;

  const AuthResult.failure(this.errorMessage)
      : success = false,
        student = null,
        role = null;
}

class AuthService {
  final ApiService _apiService;
  final StorageService _storageService;

  AuthService(this._apiService, this._storageService);

  static const String _fallbackPassword = 'aau@123';
  static final RegExp _campusIdPattern = RegExp(r'^UGR/\d{4}/\d{2}$');

  bool isValidCampusIdFormat(String input) {
    return _campusIdPattern.hasMatch(input.trim()) || input.contains('@');
  }

  List<StudentModel>? _cachedStudents;

  Future<List<StudentModel>> _loadStudents() async {
    if (_cachedStudents != null) return _cachedStudents!;
    try {
      final raw = await rootBundle.loadString('assets/data/students.json');
      final list = jsonDecode(raw) as List;
      _cachedStudents = list.map((e) => StudentModel.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      _cachedStudents = [];
    }
    return _cachedStudents!;
  }

  /// Primary login — tries AAU backend first, falls back to local JSON for demo
  Future<AuthResult> login({
    required String campusId,
    required String password,
    required String selectedCampusId,
  }) async {
    final inputTrim = campusId.trim();
    final passTrim = password.trim();

    // ── 1. Email login → authenticate directly against backend ──────────────
    if (inputTrim.contains('@')) {
      return _loginWithEmail(inputTrim, passTrim, selectedCampusId);
    }

    // ── 2. Campus ID format check ─────────────────────────────────────────────
    if (!_campusIdPattern.hasMatch(inputTrim)) {
      return const AuthResult.failure(
        'Use your AAU email (e.g. buyer01@aau.edu.et) or Campus ID (UGR/1234/24).',
      );
    }

    // ── 3. Campus ID → find in local students JSON, then login via backend ───
    final students = await _loadStudents();
    final matches = students.where((s) => s.studentId == inputTrim).toList();

    if (matches.isEmpty) {
      // Not in local dataset — try backend with campus ID as username
      try {
        return await _loginWithEmail(inputTrim, passTrim, selectedCampusId);
      } catch (_) {
        return const AuthResult.failure('No student found with this Campus ID in our system.');
      }
    }

    final student = matches.first;

    // Validate password (local demo accepts fixed password)
    if (passTrim != _fallbackPassword &&
        passTrim != 'Buyer@123456' &&
        passTrim != 'Seller@123456' &&
        passTrim != 'Admin@123456') {
      return const AuthResult.failure('Incorrect password. Demo password: aau@123');
    }

    if (student.campusId != selectedCampusId) {
      return const AuthResult.failure('Selected campus does not match your registered campus.');
    }

    // Authenticate against backend using their email
    String backendRole = 'BUYER';
    try {
      final payload = await _apiService.login(student.email, 'Buyer@123456');
      final user = payload['user'] as Map<String, dynamic>?;
      backendRole = user?['role'] as String? ?? 'BUYER';
    } catch (_) {
      // Fallback: save demo token so app still works offline
      await _storageService.saveAuthToken(
        'demo_${student.studentId}',
        role: 'BUYER',
      );
    }

    await _storageService.saveSession(
      studentId: student.studentId,
      name: student.name,
      campusId: student.campusId,
      department: student.department,
      email: student.email,
      phone: student.phone,
    );
    await _storageService.saveSelectedCampus(selectedCampusId);

    return AuthResult.success(student, role: backendRole);
  }

  Future<AuthResult> _loginWithEmail(
    String email,
    String password,
    String selectedCampusId,
  ) async {
    try {
      final payload = await _apiService.login(email, password);
      final user = payload['user'] as Map<String, dynamic>;
      final role = user['role'] as String? ?? 'BUYER';

      final student = StudentModel(
        studentId: user['id'] as String? ?? email,
        name: user['username'] as String? ?? email.split('@').first,
        campusId: selectedCampusId,
        department: role == 'ADMIN'
            ? 'AAU Marketplace Admin'
            : role == 'SELLER'
                ? 'AAU Seller'
                : 'AAU Student',
        email: user['email'] as String? ?? email,
        phone: '+251 91 000 0000',
        apiUsername: user['username'] as String? ?? '',
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

      return AuthResult.success(student, role: role);
    } on ApiException catch (e) {
      return AuthResult.failure(e.message);
    } catch (e) {
      return AuthResult.failure('Login failed. Check your email and password.');
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