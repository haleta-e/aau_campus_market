import '../models/seller.dart';
import '../models/market_product.dart';
import '../models/discount.dart';

class AdminService {
  static Future<bool> authenticateAdmin(String email, String password) async {
    await Future.delayed(const Duration(milliseconds: 400));
    return email == 'admin@aau.edu.et' && password == 'admin123';
  }

  static Future<void> toggleSellerVerification(Seller seller) async {
    await Future.delayed(const Duration(milliseconds: 200));
  }

  static Future<void> updateProductStock(MarketProduct product, int newStock) async {
    await Future.delayed(const Duration(milliseconds: 200));
  }

  static Future<void> addAcademicDiscount(Discount discount) async {
    await Future.delayed(const Duration(milliseconds: 200));
  }
}