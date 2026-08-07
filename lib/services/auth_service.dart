import '../models/app_user.dart';

class AuthService {
  AppUser? _currentUser;

  AppUser? get currentUser => _currentUser;

  Future<bool> loginStudent(String studentId, String password) async {
    await Future.delayed(const Duration(milliseconds: 500));
    _currentUser = AppUser(
      id: studentId,
      name: 'AAU Student User',
      email: '$studentId@aau.edu.et',
      role: 'student',
      campus: '4 Kilo',
    );
    return true;
  }

  void logout() {
    _currentUser = null;
  }
}