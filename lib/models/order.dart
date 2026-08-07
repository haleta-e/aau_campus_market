import 'cart_item.dart';

class Order {
  final String orderId;
  final List<CartItem> items;
  final double totalAmountETB;
  final String campus;
  final String dormBlock;
  final String dormRoom;
  final String paymentMethod;
  final String status;
  final DateTime createdAt;

  Order({
    required this.orderId,
    required this.items,
    required this.totalAmountETB,
    required this.campus,
    required this.dormBlock,
    required this.dormRoom,
    required this.paymentMethod,
    required this.status,
    required this.createdAt,
  });
}