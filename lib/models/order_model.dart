import 'cart_item_model.dart';

enum OrderStatus { placed, preparing, outForDelivery, delivered }

extension OrderStatusLabel on OrderStatus {
  String get label {
    switch (this) {
      case OrderStatus.placed:
        return 'Order Placed';
      case OrderStatus.preparing:
        return 'Preparing';
      case OrderStatus.outForDelivery:
        return 'Out for Delivery';
      case OrderStatus.delivered:
        return 'Delivered';
    }
  }
}

class OrderModel {
  final String orderId;
  final List<CartItemModel> items;
  final double subtotal;
  final double discount;
  final double total;
  final String paymentMethod;
  final String campusId;
  final List<String> sellerIds;
  final DateTime orderDate;
  final OrderStatus status;

  const OrderModel({
    required this.orderId,
    required this.items,
    required this.subtotal,
    required this.discount,
    required this.total,
    required this.paymentMethod,
    required this.campusId,
    required this.sellerIds,
    required this.orderDate,
    required this.status,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    return OrderModel(
      orderId: json['orderId'] as String,
      items: (json['items'] as List)
          .map((e) => CartItemModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      subtotal: (json['subtotal'] as num).toDouble(),
      discount: (json['discount'] as num).toDouble(),
      total: (json['total'] as num).toDouble(),
      paymentMethod: json['paymentMethod'] as String,
      campusId: json['campusId'] as String,
      sellerIds: List<String>.from(json['sellerIds'] as List),
      orderDate: DateTime.parse(json['orderDate'] as String),
      status: OrderStatus.values.firstWhere(
        (s) => s.name == json['status'],
        orElse: () => OrderStatus.placed,
      ),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'orderId': orderId,
      'items': items.map((e) => e.toJson()).toList(),
      'subtotal': subtotal,
      'discount': discount,
      'total': total,
      'paymentMethod': paymentMethod,
      'campusId': campusId,
      'sellerIds': sellerIds,
      'orderDate': orderDate.toIso8601String(),
      'status': status.name,
    };
  }

  OrderModel copyWith({OrderStatus? status}) {
    return OrderModel(
      orderId: orderId,
      items: items,
      subtotal: subtotal,
      discount: discount,
      total: total,
      paymentMethod: paymentMethod,
      campusId: campusId,
      sellerIds: sellerIds,
      orderDate: orderDate,
      status: status ?? this.status,
    );
  }
}