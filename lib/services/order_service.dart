import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../models/cart_item_model.dart';
import '../models/order_model.dart';
import 'storage_service.dart';

class OrderService {
  final StorageService _storageService;
  OrderService(this._storageService);

  static const _uuid = Uuid();

  Future<List<OrderModel>> getOrders() async {
    final raw = _storageService.getOrders();
    final orders = raw.map((e) => OrderModel.fromJson(e)).toList();
    orders.sort((a, b) => b.orderDate.compareTo(a.orderDate));
    return orders;
  }

  Future<OrderModel> placeOrder({
    required List<CartItemModel> items,
    required double subtotal,
    required double discount,
    double deliveryFee = 0,
    required double total,
    required String paymentMethod,
    String fulfillmentMethod = 'delivery',
    required String campusId,
    required List<String> sellerIds,
  }) async {
    final order = OrderModel(
      orderId: 'ORD-${_uuid.v4().substring(0, 8).toUpperCase()}',
      items: items,
      subtotal: subtotal,
      discount: discount,
      deliveryFee: deliveryFee,
      total: total,
      paymentMethod: paymentMethod,
      fulfillmentMethod: fulfillmentMethod,
      campusId: campusId,
      sellerIds: sellerIds,
      orderDate: DateTime.now(),
      status: OrderStatus.placed,
    );
    await _storageService.saveOrder(order.orderId, order.toJson());
    return order;
  }

  Future<void> updateOrderStatus(String orderId, OrderStatus status) async {
    final raw = _storageService.getOrders();
    final match = raw.where((o) => o['orderId'] == orderId);
    if (match.isEmpty) return;
    final order = OrderModel.fromJson(match.first).copyWith(status: status);
    await _storageService.saveOrder(orderId, order.toJson());
  }
}

final orderServiceProvider = Provider<OrderService>((ref) {
  return OrderService(ref.watch(storageServiceProvider));
});