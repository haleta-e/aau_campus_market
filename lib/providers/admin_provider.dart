import 'package:flutter/material.dart';
import '../services/admin_service.dart';
import '../models/seller.dart';
import '../models/market_product.dart';
import '../models/discount.dart';

class AdminProvider extends ChangeNotifier {
  bool _isAdminLoggedIn = false;
  String _adminName = 'AAU System Admin';

  bool get isAdminLoggedIn => _isAdminLoggedIn;
  String get adminName => _adminName;

  Future<bool> loginAdmin(String email, String password) async {
    final success = await AdminService.authenticateAdmin(email, password);
    if (success) {
      _isAdminLoggedIn = true;
      notifyListeners();
    }
    return success;
  }

  void logoutAdmin() {
    _isAdminLoggedIn = false;
    notifyListeners();
  }

  void verifySeller(Seller seller) {
    AdminService.toggleSellerVerification(seller);
    notifyListeners();
  }

  void adjustStock(MarketProduct product, int newStock) {
    AdminService.updateProductStock(product, newStock);
    notifyListeners();
  }

  void addDiscount(Discount discount) {
    AdminService.addAcademicDiscount(discount);
    notifyListeners();
  }
}