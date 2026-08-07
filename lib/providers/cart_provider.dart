import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/cart_item_model.dart';
import '../models/product_model.dart';
import '../services/storage_service.dart';
import 'discount_provider.dart';

class CartNotifier extends StateNotifier<List<CartItemModel>> {
  final StorageService _storageService;

  CartNotifier(this._storageService) : super([]) {
    _restore();
  }

  Future<void> _restore() async {
    final raw = _storageService.getCartItems();
    state = raw.map((e) => CartItemModel.fromJson(e)).toList();
  }

  Future<void> addToCart(ProductModel product, {int quantity = 1}) async {
    final index = state.indexWhere((i) => i.productId == product.id);
    if (index >= 0) {
      final existing = state[index];
      final newQty = existing.quantity + quantity;
      if (!product.isFromApi && newQty > product.stockQuantity) {
        throw Exception('Only ${product.stockQuantity} in stock.');
      }
      final updated = existing.copyWith(quantity: newQty);
      state = [...state]..[index] = updated;
      await _storageService.saveCartItem(product.id, updated.toJson());
    } else {
      if (!product.isFromApi && quantity > product.stockQuantity) {
        throw Exception('Only ${product.stockQuantity} in stock.');
      }
      final item = CartItemModel.fromProduct(product, quantity: quantity);
      state = [...state, item];
      await _storageService.saveCartItem(product.id, item.toJson());
    }
  }

  Future<void> increaseQuantity(String productId) async {
    final index = state.indexWhere((i) => i.productId == productId);
    if (index < 0) return;
    final item = state[index];
    if (item.maxStock > 0 && item.quantity >= item.maxStock) return;
    final updated = item.copyWith(quantity: item.quantity + 1);
    state = [...state]..[index] = updated;
    await _storageService.saveCartItem(productId, updated.toJson());
  }

  Future<void> decreaseQuantity(String productId) async {
    final index = state.indexWhere((i) => i.productId == productId);
    if (index < 0) return;
    final item = state[index];
    if (item.quantity <= 1) {
      await removeItem(productId);
      return;
    }
    final updated = item.copyWith(quantity: item.quantity - 1);
    state = [...state]..[index] = updated;
    await _storageService.saveCartItem(productId, updated.toJson());
  }

  Future<void> removeItem(String productId) async {
    state = state.where((i) => i.productId != productId).toList();
    await _storageService.removeCartItem(productId);
  }

  Future<void> clearCart() async {
    state = [];
    await _storageService.clearCart();
  }
}

final cartProvider = StateNotifierProvider<CartNotifier, List<CartItemModel>>((ref) {
  return CartNotifier(ref.watch(storageServiceProvider));
});

final cartSubtotalProvider = Provider<double>((ref) {
  final items = ref.watch(cartProvider);
  return items.fold(0.0, (sum, item) => sum + item.subtotal);
});

/// Total discount amount across all cart items, based on active discounts.
final cartDiscountProvider = Provider<double>((ref) {
  final items = ref.watch(cartProvider);
  final discounts = ref.watch(discountProvider).discounts;

  double totalDiscount = 0;
  for (final item in items) {
    final matches = discounts.where(
      (d) => d.isCurrentlyActive && d.applicableCategories.contains(item.category),
    );
    if (matches.isNotEmpty) {
      totalDiscount += item.subtotal * matches.first.percentage / 100;
    }
  }
  return totalDiscount;
});

final cartTotalProvider = Provider<double>((ref) {
  final subtotal = ref.watch(cartSubtotalProvider);
  final discount = ref.watch(cartDiscountProvider);
  return subtotal - discount;
});

final cartItemCountProvider = Provider<int>((ref) {
  final items = ref.watch(cartProvider);
  return items.fold(0, (sum, item) => sum + item.quantity);
});