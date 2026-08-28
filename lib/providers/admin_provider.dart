import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';

class AdminAuthState {
  final bool isLoggedIn;
  final String? errorMessage;
  final Map<String, dynamic>? stats;

  const AdminAuthState({this.isLoggedIn = false, this.errorMessage, this.stats});
}

class AdminAuthNotifier extends StateNotifier<AdminAuthState> {
  final ApiService _apiService;
  final StorageService _storageService;

  static const String _adminUsername = 'admin';
  static const String _adminPassword = 'admin123';
  static const String _backendAdminEmail = 'admin@aau.edu.et';
  static const String _backendAdminPass = 'Admin@123456';

  AdminAuthNotifier(this._apiService, this._storageService) : super(const AdminAuthState()) {
    _restore();
  }

  Future<void> _restore() async {
    final loggedIn = await _storageService.isAdminLoggedIn();
    if (loggedIn) {
      state = const AdminAuthState(isLoggedIn: true);
      await fetchStats();
    }
  }

  Future<bool> login(String usernameOrEmail, String password) async {
    final userTrim = usernameOrEmail.trim();
    final passTrim = password.trim();

    // 1. Check direct backend Admin login (admin@aau.edu.et / Admin@123456)
    if (userTrim.contains('@') || userTrim == _adminUsername) {
      try {
        final emailToUse = userTrim.contains('@') ? userTrim : _backendAdminEmail;
        final passToUse = userTrim == _adminUsername && passTrim == _adminPassword ? _backendAdminPass : passTrim;

        final payload = await _apiService.login(emailToUse, passToUse);
        final user = payload['user'] as Map<String, dynamic>;

        if (user['role'] == 'ADMIN') {
          await _storageService.setAdminLoggedIn(true);
          state = const AdminAuthState(isLoggedIn: true);
          await fetchStats();
          return true;
        }
      } catch (e) {
        // Continue to fallback check
      }
    }

    // 2. Fallback check for local demo credentials
    if ((userTrim == _adminUsername && passTrim == _adminPassword) ||
        (userTrim == _backendAdminEmail && passTrim == _backendAdminPass)) {
      await _storageService.setAdminLoggedIn(true);
      state = const AdminAuthState(isLoggedIn: true);
      await fetchStats();
      return true;
    }

    state = const AdminAuthState(isLoggedIn: false, errorMessage: 'Invalid admin credentials.');
    return false;
  }

  Future<void> fetchStats() async {
    try {
      final stats = await _apiService.getAdminStats();
      state = AdminAuthState(isLoggedIn: true, stats: stats);
    } catch (_) {
      // Offline fallback stats
      state = AdminAuthState(isLoggedIn: true, stats: state.stats);
    }
  }

  Future<void> logout() async {
    await _storageService.setAdminLoggedIn(false);
    state = const AdminAuthState();
  }
}

final adminAuthProvider = StateNotifierProvider<AdminAuthNotifier, AdminAuthState>((ref) {
  return AdminAuthNotifier(ref.watch(apiServiceProvider), ref.watch(storageServiceProvider));
});