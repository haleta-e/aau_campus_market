import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/order_provider.dart';
import '../../providers/campus_provider.dart';
import '../../models/order_model.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/empty_state.dart';
import '../../utils/formatters.dart';

class OrdersScreen extends ConsumerWidget {
  const OrdersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(orderProvider);
    final campuses = ref.watch(campusProvider).campuses;

    return Scaffold(
      appBar: AppBar(title: const Text('Orders')),
      body: state.isLoading
          ? const LoadingWidget()
          : state.orders.isEmpty
              ? const EmptyState(message: 'No orders yet.', icon: Icons.receipt_long_outlined)
              : ListView.builder(
                  padding: const EdgeInsets.all(12),
                  itemCount: state.orders.length,
                  itemBuilder: (context, i) {
                    final order = state.orders[i];
                    final isPickup = order.fulfillmentMethod == 'pickup';
                    return Card(
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: isPickup ? Colors.orange.shade100 : Colors.green.shade100,
                          child: Icon(
                            isPickup ? Icons.storefront : Icons.delivery_dining,
                            color: isPickup ? Colors.orange.shade800 : Colors.green.shade800,
                          ),
                        ),
                        title: Text(order.orderId, style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text(
                          '${Formatters.date(order.orderDate)} • ${isPickup ? "Pickup" : "Delivery"} • ${order.paymentMethod}',
                        ),
                        trailing: Text(Formatters.currency(order.total)),
                        onTap: () => _showOrderDetail(context, ref, order, campuses),
                      ),
                    );
                  },
                ),
    );
  }

  void _showOrderDetail(BuildContext context, WidgetRef ref, OrderModel order, List campuses) {
    final isPickup = order.fulfillmentMethod == 'pickup';
    final campusName = campuses.where((c) => c.id == order.campusId).map((c) => c.name).firstOrNull ?? '';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => DraggableScrollableSheet(
        initialChildSize: 0.75,
        maxChildSize: 0.9,
        expand: false,
        builder: (context, scrollController) => ListView(
          controller: scrollController,
          padding: const EdgeInsets.all(20),
          children: [
            Row(children: [
              Expanded(
                child: Text(order.orderId, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ),
              Chip(
                avatar: Icon(isPickup ? Icons.storefront : Icons.delivery_dining, size: 16),
                label: Text(isPickup ? 'Pickup' : 'Delivery'),
                backgroundColor: isPickup ? Colors.orange.shade50 : Colors.green.shade50,
              ),
            ]),
            const SizedBox(height: 4),
            Text('${Formatters.date(order.orderDate)} • $campusName', style: const TextStyle(color: Colors.grey)),
            const Divider(height: 24),
            const Text('Items', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            ...order.items.map((i) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                      Expanded(child: Text('${i.name} x${i.quantity}')),
                      Text(Formatters.currency(i.subtotal)),
                    ]),
                    if (i.note != null && i.note!.trim().isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(top: 2),
                        child: Text('Note: ${i.note}',
                            style: const TextStyle(fontSize: 12, fontStyle: FontStyle.italic, color: Colors.grey)),
                      ),
                  ]),
                )),
            const Divider(height: 24),
            _row('Subtotal', Formatters.currency(order.subtotal)),
            _row('Discount', '-${Formatters.currency(order.discount)}'),
            _row(isPickup ? 'Pickup Fee' : 'Delivery Fee', isPickup ? 'Free' : Formatters.currency(order.deliveryFee)),
            const Divider(),
            _row('Total', Formatters.currency(order.total), bold: true),
            const SizedBox(height: 8),
            _row('Payment Method', order.paymentMethod),
            const SizedBox(height: 20),
            Text(
              isPickup ? 'Pickup Status' : 'Delivery Status',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: _statusLabels(isPickup).asMap().entries.map((entry) {
                final reached = entry.key <= order.status.index;
                return Chip(
                  label: Text(entry.value),
                  backgroundColor: reached ? const Color(0xFF2E7D32) : null,
                  labelStyle: TextStyle(color: reached ? Colors.white : null),
                );
              }).toList(),
            ),
            const SizedBox(height: 16),
            if (order.status != OrderStatus.delivered)
              ElevatedButton(
                onPressed: () {
                  final next = OrderStatus.values[order.status.index + 1];
                  ref.read(orderProvider.notifier).updateOrderStatus(order.orderId, next);
                  Navigator.pop(context);
                },
                child: Text('Simulate: ${_statusLabels(isPickup)[order.status.index + 1]}'),
              ),
          ],
        ),
      ),
    );
  }

  /// Pickup orders use different wording for the last two steps since
  /// there's no actual delivery happening — this is the fix: fulfillment
  /// method now visibly changes the status labels shown to the student.
  List<String> _statusLabels(bool isPickup) {
    if (isPickup) {
      return const ['Order Placed', 'Preparing', 'Ready for Pickup', 'Picked Up'];
    }
    return OrderStatus.values.map((s) => s.label).toList();
  }

  Widget _row(String label, String value, {bool bold = false}) {
    final style = TextStyle(fontWeight: bold ? FontWeight.bold : FontWeight.normal, fontSize: bold ? 16 : 14);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Text(label, style: style),
        Text(value, style: style),
      ]),
    );
  }
}