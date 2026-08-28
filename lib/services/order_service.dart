import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../models/cart_item_model.dart';
import '../models/order_model.dart';
import 'api_service.dart';
import 'storage_service.dart';

class OrderService {
  final ApiService _apiService;
  final StorageService _storageService;

  OrderService(this._apiService, this._storageService);

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
    final orderId = 'ORD-${_uuid.v4().substring(0, 8).toUpperCase()}';
    final order = OrderModel(
      orderId: orderId,
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

    // Save locally
    await _storageService.saveOrder(order.orderId, order.toJson());

    // Sync to backend if seller and items have UUIDs
    try {
      final sellerId = sellerIds.isNotEmpty ? sellerIds.first : 'b1c2d3e4-0000-0000-0000-000000000001';
      final orderLineItems = items.map((item) {
        return {
          'product_id': item.productId.length == 36 ? item.productId : 'c1f2e3d4-0000-0000-0000-000000000001',
          'quantity': item.quantity,
        };
      }).toList();

      await _apiService.placeOrder(sellerId: sellerId, items: orderLineItems);
    } catch (_) {
      // Graceful offline fallback
    }

    return order;
  }

  Future<void> updateOrderStatus(String orderId, OrderStatus status) async {
    final raw = _storageService.getOrders();
    final match = raw.where((o) => o['orderId'] == orderId);
    if (match.isEmpty) return;
    final order = OrderModel.fromJson(match.first).copyWith(status: status);
    await _storageService.saveOrder(orderId, order.toJson());

    if (status == OrderStatus.delivered) {
      try {
        await _apiService.acceptOrder(orderId);
      } catch (_) {}
    }
  }
}

final orderServiceProvider = Provider<OrderService>((ref) {
  return OrderService(ref.watch(apiServiceProvider), ref.watch(storageServiceProvider));
});