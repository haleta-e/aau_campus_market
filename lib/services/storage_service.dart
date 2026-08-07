import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static const String keySelectedCampus = 'selected_aau_campus';
  static const String keyDiscountCode = 'active_discount_code';

  static Future<void> saveSelectedCampus(String campus) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(keySelectedCampus, campus);
  }

  static Future<String> getSelectedCampus() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(keySelectedCampus) ?? '4 Kilo';
  }
}