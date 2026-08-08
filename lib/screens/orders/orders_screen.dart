import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/order_provider.dart';
import '../../models/order_model.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/empty_state.dart';
import '../../utils/formatters.dart';

class OrdersScreen extends ConsumerWidget {
  const OrdersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(orderProvider);

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
                    return Card(
                      child: ListTile(
                        title: Text(order.orderId, style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text('${Formatters.date(order.orderDate)} • ${order.paymentMethod}'),
                        trailing: Text(Formatters.currency(order.total)),
                        onTap: () => _showOrderDetail(context, ref, order),
                      ),
                    );
                  },
                ),
    );
  }

  void _showOrderDetail(BuildContext context, WidgetRef ref, OrderModel order) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(order.orderId, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          ...order.items.map((i) => Text('${i.name} x${i.quantity} — ${Formatters.currency(i.subtotal)}')),
          const Divider(),
          Text('Total: ${Formatters.currency(order.total)}', style: const TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          const Text('Delivery Status', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Wrap(spacing: 8, children: OrderStatus.values.map((s) {
            final reached = s.index <= order.status.index;
            return Chip(
              label: Text(s.label),
              backgroundColor: reached ? const Color(0xFF2E7D32) : null,
              labelStyle: TextStyle(color: reached ? Colors.white : null),
            );
          }).toList()),
          const SizedBox(height: 16),
          if (order.status != OrderStatus.delivered)
            ElevatedButton(
              onPressed: () {
                final next = OrderStatus.values[order.status.index + 1];
                ref.read(orderProvider.notifier).updateOrderStatus(order.orderId, next);
                Navigator.pop(context);
              },
              child: const Text('Simulate Next Delivery Step'),
            ),
        ]),
      ),
    );
  }
}