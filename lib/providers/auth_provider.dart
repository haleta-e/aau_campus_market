import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/student_model.dart';
import '../services/auth_service.dart';
import '../services/storage_service.dart';

class AuthState {
  final bool isLoading;
  final bool isLoggedIn;
  final StudentModel? student;
  final String? errorMessage;

  const AuthState({
    this.isLoading = false,
    this.isLoggedIn = false,
    this.student,
    this.errorMessage,
  });

  AuthState copyWith({
    bool? isLoading,
    bool? isLoggedIn,
    StudentModel? student,
    String? errorMessage,
    bool clearError = false,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      isLoggedIn: isLoggedIn ?? this.isLoggedIn,
      student: student ?? this.student,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthService _authService;
  final StorageService _storageService;

  AuthNotifier(this._authService, this._storageService) : super(const AuthState()) {
    _restoreSession();
  }

  Future<void> _restoreSession() async {
    final session = await _storageService.getSession();
    if (session != null) {
      state = state.copyWith(
        isLoggedIn: true,
        student: StudentModel(
          studentId: session['studentId']!,
          name: session['name']!,
          department: session['department']!,
          campusId: session['campusId']!,
          email: session['email']!,
          phone: session['phone']!,
          apiUsername: '',
          apiPassword: '',
        ),
      );
    }
  }

  Future<bool> login({
    required String campusId,
    required String password,
    required String selectedCampusId,
  }) async {
    state = state.copyWith(isLoading: true, clearError: true);
    final result = await _authService.login(
      campusId: campusId,
      password: password,
      selectedCampusId: selectedCampusId,
    );
    if (result.success) {
      state = state.copyWith(
        isLoading: false,
        isLoggedIn: true,
        student: result.student,
        clearError: true,
      );
      return true;
    }
    state = state.copyWith(isLoading: false, errorMessage: result.errorMessage);
    return false;
  }

  Future<void> logout() async {
    await _authService.logout();
    state = const AuthState();
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.watch(authServiceProvider), ref.watch(storageServiceProvider));
});