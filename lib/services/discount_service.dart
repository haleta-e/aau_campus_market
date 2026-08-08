import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/cart_item_model.dart';
import '../models/discount_model.dart';
import '../models/product_model.dart';
import 'storage_service.dart';

class DiscountService {
  final StorageService _storageService;
  DiscountService(this._storageService);

  Future<void> _seedIfNeeded() async {
    if (!_storageService.isEmpty(StorageService.discountsBox)) return;
    final raw = await rootBundle.loadString('assets/data/discounts.json');
    final list = (jsonDecode(raw) as List).cast<Map<String, dynamic>>();
    await _storageService.seedIfEmpty(
      StorageService.discountsBox,
      list,
      (item) => item['id'] as String,
    );
  }

  Future<List<DiscountModel>> getDiscounts() async {
    await _seedIfNeeded();
    final raw = _storageService.getAll(StorageService.discountsBox);
    return raw.map((e) => DiscountModel.fromJson(e)).toList();
  }

  List<DiscountModel> getActiveDiscounts(List<DiscountModel> discounts) {
    return discounts.where((d) => d.isCurrentlyActive).toList();
  }

  DiscountModel? discountById(List<DiscountModel> discounts, String? id) {
    if (id == null) return null;
    for (final d in discounts) {
      if (d.id == id) return d;
    }
    return null;
  }

  /// Discounted price for a product, if an active discount applies
  /// (by direct discountId first, then by category), else the original price.
  double applyDiscount(ProductModel product, List<DiscountModel> discounts) {
    final direct = discountById(discounts, product.discountId);
    if (direct != null && direct.isCurrentlyActive) {
      return product.price - (product.price * direct.percentage / 100);
    }
    final categoryMatches = discounts.where(
      (d) => d.isCurrentlyActive && d.applicableCategories.contains(product.category),
    );
    if (categoryMatches.isNotEmpty) {
      final d = categoryMatches.first;
      return product.price - (product.price * d.percentage / 100);
    }
    return product.price;
  }

  /// Total discount across a list of cart items — shared by the Cart
  /// screen and the "Buy Now" direct-checkout flow so both compute
  /// totals identically.
  double applyToCartItems(List<CartItemModel> items, List<DiscountModel> discounts) {
    double total = 0;
    for (final item in items) {
      final matches = discounts.where(
        (d) => d.isCurrentlyActive && d.applicableCategories.contains(item.category),
      );
      if (matches.isNotEmpty) {
        total += item.subtotal * matches.first.percentage / 100;
      }
    }
    return total;
  }

  Future<void> createDiscount(DiscountModel discount) async {
    await _storageService.putItem(StorageService.discountsBox, discount.id, discount.toJson());
  }

  Future<void> updateDiscount(DiscountModel discount) async {
    await _storageService.putItem(StorageService.discountsBox, discount.id, discount.toJson());
  }

  Future<void> deleteDiscount(String discountId) async {
    await _storageService.deleteItem(StorageService.discountsBox, discountId);
  }
}

final discountServiceProvider = Provider<DiscountService>((ref) {
  return DiscountService(ref.watch(storageServiceProvider));
});