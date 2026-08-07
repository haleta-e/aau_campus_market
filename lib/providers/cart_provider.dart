import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import '../models/market_product.dart';

class CartProvider extends ChangeNotifier {
  final List<CartItem> _items = [];
  double _discountRate = 0.0;
  String? _appliedPromoCode;

  List<CartItem> get items => _items;
  double get discountRate => _discountRate;
  String? get appliedPromoCode => _appliedPromoCode;

  double get subtotalETB => _items.fold(0, (sum, item) => sum + item.totalETB);
  double get discountAmountETB => subtotalETB * _discountRate;
  double get deliveryFeeETB => _items.isEmpty ? 0.0 : 25.0;
  double get totalETB => subtotalETB + deliveryFeeETB - discountAmountETB;

  void addToCart(MarketProduct product) {
    final existingIndex = _items.indexWhere((i) => i.product.id == product.id);
    if (existingIndex >= 0) {
      _items[existingIndex].quantity++;
    } else {
      _items.add(CartItem(product: product, quantity: 1));
    }
    notifyListeners();
  }

  bool applyPromoCode(String code) {
    if (code.trim().toUpperCase() == 'HOLIDAY15') {
      _discountRate = 0.15;
      _appliedPromoCode = 'HOLIDAY15';
      notifyListeners();
      return true;
    } else if (code.trim().toUpperCase() == 'AAUSTUDENT10') {
      _discountRate = 0.10;
      _appliedPromoCode = 'AAUSTUDENT10';
      notifyListeners();
      return true;
    }
    return false;
  }

  void clearCart() {
    _items.clear();
    _discountRate = 0.0;
    _appliedPromoCode = null;
    notifyListeners();
  }
}
