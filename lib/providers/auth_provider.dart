import 'package:flutter/material.dart';
import '../models/app_user.dart';

class AuthProvider extends ChangeNotifier {
  AppUser? _user;
  bool _isLoggedIn = false;

  AppUser? get user => _user;
  bool get isLoggedIn => _isLoggedIn;

  void login(String name, String email, String campus) {
    _user = AppUser(id: 'usr-1', name: name, email: email, role: 'student', campus: campus);
    _isLoggedIn = true;
    notifyListeners();
  }

  void logout() {
    _user = null;
    _isLoggedIn = false;
    notifyListeners();
  }
}