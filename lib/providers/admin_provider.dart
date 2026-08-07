import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/storage_service.dart';

class AdminAuthState {
  final bool isLoggedIn;
  final String? errorMessage;

  const AdminAuthState({this.isLoggedIn = false, this.errorMessage});
}

class AdminAuthNotifier extends StateNotifier<AdminAuthState> {
  final StorageService _storageService;

  // Demo-only local admin credentials, per spec — not Fake Store API auth.
  static const String _adminUsername = 'admin';
  static const String _adminPassword = 'admin123';

  AdminAuthNotifier(this._storageService) : super(const AdminAuthState()) {
    _restore();
  }

  Future<void> _restore() async {
    final loggedIn = await _storageService.isAdminLoggedIn();
    state = AdminAuthState(isLoggedIn: loggedIn);
  }

  Future<bool> login(String username, String password) async {
    if (username.trim() == _adminUsername && password == _adminPassword) {
      await _storageService.setAdminLoggedIn(true);
      state = const AdminAuthState(isLoggedIn: true);
      return true;
    }
    state = const AdminAuthState(isLoggedIn: false, errorMessage: 'Invalid admin credentials.');
    return false;
  }

  Future<void> logout() async {
    await _storageService.setAdminLoggedIn(false);
    state = const AdminAuthState();
  }
}

final adminAuthProvider = StateNotifierProvider<AdminAuthNotifier, AdminAuthState>((ref) {
  return AdminAuthNotifier(ref.watch(storageServiceProvider));
});