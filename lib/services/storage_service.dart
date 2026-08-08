import 'package:hive_flutter/hive_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class StorageService {
  // Hive box names
  static const String cartBox = 'cart_box';
  static const String ordersBox = 'orders_box';
  static const String campusesBox = 'campuses_box';
  static const String sellersBox = 'sellers_box';
  static const String productsBox = 'local_products_box';
  static const String discountsBox = 'discounts_box';

  // SharedPreferences keys
  static const String _keyStudentId = 'session_student_id';
  static const String _keyStudentName = 'session_student_name';
  static const String _keyCampusId = 'session_campus_id';
  static const String _keyDepartment = 'session_department';
  static const String _keyEmail = 'session_email';
  static const String _keyPhone = 'session_phone';
  static const String _keyIsLoggedIn = 'session_is_logged_in';
  static const String _keySelectedCampus = 'selected_campus_id';
  static const String _keyIsAdmin = 'is_admin_logged_in';

  Future<void> openBoxes() async {
    await Future.wait([
      Hive.openBox(cartBox),
      Hive.openBox(ordersBox),
      Hive.openBox(campusesBox),
      Hive.openBox(sellersBox),
      Hive.openBox(productsBox),
      Hive.openBox(discountsBox),
    ]);
  }

  Box _box(String name) => Hive.box(name);

  // ---- Generic Hive helpers ----

  List<Map<String, dynamic>> getAll(String boxName) {
    final box = _box(boxName);
    return box.values
        .map((e) => Map<String, dynamic>.from(e as Map))
        .toList();
  }

  Future<void> putItem(String boxName, String key, Map<String, dynamic> value) async {
    await _box(boxName).put(key, value);
  }

  Future<void> deleteItem(String boxName, String key) async {
    await _box(boxName).delete(key);
  }

  bool isEmpty(String boxName) => _box(boxName).isEmpty;

  Future<void> seedIfEmpty(
    String boxName,
    List<Map<String, dynamic>> seedData,
    String Function(Map<String, dynamic>) idSelector,
  ) async {
    final box = _box(boxName);
    // Upsert-if-missing instead of "only seed when empty": any product,
    // campus, seller, or discount added to the JSON later still gets
    // picked up on next launch, even if the box already has older data.
    // Existing entries (including admin edits) are left untouched.
    for (final item in seedData) {
      final key = idSelector(item);
      if (!box.containsKey(key)) {
        await box.put(key, item);
      }
    }
  }

  // ---- Cart persistence ----

  List<Map<String, dynamic>> getCartItems() => getAll(cartBox);

  Future<void> saveCartItem(String productId, Map<String, dynamic> item) =>
      putItem(cartBox, productId, item);

  Future<void> removeCartItem(String productId) => deleteItem(cartBox, productId);

  Future<void> clearCart() => _box(cartBox).clear();

  // ---- Orders persistence ----

  List<Map<String, dynamic>> getOrders() => getAll(ordersBox);

  Future<void> saveOrder(String orderId, Map<String, dynamic> order) =>
      putItem(ordersBox, orderId, order);

  // ---- Session (SharedPreferences) ----

  Future<void> saveSession({
    required String studentId,
    required String name,
    required String campusId,
    required String department,
    required String email,
    required String phone,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyStudentId, studentId);
    await prefs.setString(_keyStudentName, name);
    await prefs.setString(_keyCampusId, campusId);
    await prefs.setString(_keyDepartment, department);
    await prefs.setString(_keyEmail, email);
    await prefs.setString(_keyPhone, phone);
    await prefs.setBool(_keyIsLoggedIn, true);
  }

  Future<Map<String, String>?> getSession() async {
    final prefs = await SharedPreferences.getInstance();
    final isLoggedIn = prefs.getBool(_keyIsLoggedIn) ?? false;
    if (!isLoggedIn) return null;
    final studentId = prefs.getString(_keyStudentId);
    if (studentId == null) return null;
    return {
      'studentId': studentId,
      'name': prefs.getString(_keyStudentName) ?? '',
      'campusId': prefs.getString(_keyCampusId) ?? '',
      'department': prefs.getString(_keyDepartment) ?? '',
      'email': prefs.getString(_keyEmail) ?? '',
      'phone': prefs.getString(_keyPhone) ?? '',
    };
  }

  Future<void> clearSession() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyStudentId);
    await prefs.remove(_keyStudentName);
    await prefs.remove(_keyCampusId);
    await prefs.remove(_keyDepartment);
    await prefs.remove(_keyEmail);
    await prefs.remove(_keyPhone);
    await prefs.setBool(_keyIsLoggedIn, false);
  }

  // ---- Selected campus ----

  Future<void> saveSelectedCampus(String campusId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keySelectedCampus, campusId);
  }

  Future<String?> getSelectedCampus() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keySelectedCampus);
  }

  // ---- Admin session ----

  Future<void> setAdminLoggedIn(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyIsAdmin, value);
  }

  Future<bool> isAdminLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyIsAdmin) ?? false;
  }
}

final storageServiceProvider = Provider<StorageService>((ref) => StorageService());