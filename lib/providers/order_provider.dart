import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/cart_item_model.dart';
import '../models/order_model.dart';
import '../services/order_service.dart';

class OrderState {
  final bool isLoading;
  final List<OrderModel> orders;
  final String? errorMessage;

  const OrderState({this.isLoading = false, this.orders = const [], this.errorMessage});

  OrderState copyWith({
    bool? isLoading,
    List<OrderModel>? orders,
    String? errorMessage,
    bool clearError = false,
  }) {
    return OrderState(
      isLoading: isLoading ?? this.isLoading,
      orders: orders ?? this.orders,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

class OrderNotifier extends StateNotifier<OrderState> {
  final OrderService _service;

  OrderNotifier(this._service) : super(const OrderState()) {
    loadOrders();
  }

  Future<void> loadOrders() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final orders = await _service.getOrders();
      state = state.copyWith(isLoading: false, orders: orders);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: 'Unable to load orders.');
    }
  }

  Future<OrderModel> placeOrder({
    required List<CartItemModel> items,
    required double subtotal,
    required double discount,
    required double total,
    required String paymentMethod,
    required String campusId,
    required List<String> sellerIds,
  }) async {
    final order = await _service.placeOrder(
      items: items,
      subtotal: subtotal,
      discount: discount,
      total: total,
      paymentMethod: paymentMethod,
      campusId: campusId,
      sellerIds: sellerIds,
    );
    await loadOrders();
    return order;
  }

  Future<void> updateOrderStatus(String orderId, OrderStatus status) async {
    await _service.updateOrderStatus(orderId, status);
    await loadOrders();
  }
}

final orderProvider = StateNotifierProvider<OrderNotifier, OrderState>((ref) {
  return OrderNotifier(ref.watch(orderServiceProvider));
});