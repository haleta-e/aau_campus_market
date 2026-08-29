import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/order_provider.dart';
import '../../providers/campus_provider.dart';
import '../../providers/seller_provider.dart';
import '../../providers/auth_provider.dart';
import '../../models/order_model.dart';
import '../../services/complaint_service.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/empty_state.dart';
import '../../utils/formatters.dart';

class OrdersScreen extends ConsumerWidget {
  const OrdersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(orderProvider);
    final campuses = ref.watch(campusProvider).campuses;
    final sellers = ref.watch(sellerProvider).sellers;

    return Scaffold(
      appBar: AppBar(title: const Text('My Orders')),
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
                    final isDelivered = order.status == OrderStatus.delivered;

                    return Card(
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: isDelivered
                              ? Colors.green.shade100
                              : isPickup
                                  ? Colors.orange.shade100
                                  : Colors.blue.shade100,
                          child: Icon(
                            isDelivered
                                ? Icons.check_circle
                                : isPickup
                                    ? Icons.storefront
                                    : Icons.local_shipping,
                            color: isDelivered
                                ? Colors.green.shade800
                                : isPickup
                                    ? Colors.orange.shade800
                                    : Colors.blue.shade800,
                          ),
                        ),
                        title: Text(order.orderId, style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text(
                          '${Formatters.date(order.orderDate)} • ${isPickup ? "Pickup" : "Delivery"}\nStatus: ${isDelivered ? "Delivered & Confirmed" : "Order Placed / Awaiting Delivery"}',
                        ),
                        isThreeLine: true,
                        trailing: Text(Formatters.currency(order.total), style: const TextStyle(fontWeight: FontWeight.bold)),
                        onTap: () => _showOrderDetail(context, ref, order, campuses, sellers),
                      ),
                    );
                  },
                ),
    );
  }

  void _showOrderDetail(BuildContext context, WidgetRef ref, OrderModel order, List campuses, List sellers) {
    final isPickup = order.fulfillmentMethod == 'pickup';
    final campusName = campuses.where((c) => c.id == order.campusId).map((c) => c.name).firstOrNull ?? '';
    final orderSellers = sellers.where((s) => order.sellerIds.contains(s.id)).toList();
    final isDelivered = order.status == OrderStatus.delivered;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => DraggableScrollableSheet(
        initialChildSize: 0.8,
        maxChildSize: 0.95,
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
                avatar: Icon(isDelivered ? Icons.check_circle : (isPickup ? Icons.storefront : Icons.local_shipping), size: 16, color: Colors.white),
                label: Text(isDelivered ? 'Delivered' : 'Awaiting Delivery', style: const TextStyle(color: Colors.white)),
                backgroundColor: isDelivered ? Colors.green : Colors.blue.shade700,
              ),
            ]),
            const SizedBox(height: 4),
            Text('${Formatters.date(order.orderDate)} • $campusName', style: const TextStyle(color: Colors.grey)),
            const Divider(height: 24),

            // Seller Info
            if (orderSellers.isNotEmpty) ...[
              const Text('Seller Information', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              ...orderSellers.map((s) => ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: CircleAvatar(backgroundColor: Colors.purple.shade100, child: const Icon(Icons.store, color: Colors.purple)),
                    title: Text(s.name, style: const TextStyle(fontWeight: FontWeight.w600)),
                    subtitle: Text('${s.department} • ${s.phone}'),
                  )),
              const Divider(height: 24),
            ],

            const Text('Order Items', style: TextStyle(fontWeight: FontWeight.bold)),
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
                        child: Text('Note: ${i.note}', style: const TextStyle(fontSize: 12, fontStyle: FontStyle.italic, color: Colors.grey)),
                      ),
                  ]),
                )),
            const Divider(height: 24),
            _row('Subtotal', Formatters.currency(order.subtotal)),
            _row('Discount', '-${Formatters.currency(order.discount)}'),
            _row(isPickup ? 'Pickup Fee' : 'Delivery Fee', isPickup ? 'Free' : Formatters.currency(order.deliveryFee)),
            const Divider(),
            _row('Total Paid', Formatters.currency(order.total), bold: true),
            const SizedBox(height: 8),
            _row('Payment Method', order.paymentMethod),
            const SizedBox(height: 24),

            // Buyer Delivery Confirmation Action
            if (!isDelivered)
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2E7D32),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                onPressed: () {
                  ref.read(orderProvider.notifier).updateOrderStatus(order.orderId, OrderStatus.delivered);
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Thank you! Order confirmed as delivered.')),
                  );
                },
                icon: const Icon(Icons.check_circle_outline),
                label: const Text('Confirm Item Received / Delivered', style: TextStyle(fontWeight: FontWeight.bold)),
              ),

            const SizedBox(height: 12),
            // Report Complaint / Issue Button
            OutlinedButton.icon(
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.red,
                side: const BorderSide(color: Colors.red),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              onPressed: () {
                Navigator.pop(context);
                _showReportComplaintDialog(context, ref, order);
              },
              icon: const Icon(Icons.report_problem_outlined),
              label: const Text('Report Issue / File Complaint'),
            ),
          ],
        ),
      ),
    );
  }

  void _showReportComplaintDialog(BuildContext context, WidgetRef ref, OrderModel order) {
    String issueType = 'Improper Product';
    final descCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('File Complaint / Dispute'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Order: ${order.orderId}', style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              value: issueType,
              decoration: const InputDecoration(labelText: 'Issue Category', border: OutlineInputBorder()),
              items: const [
                DropdownMenuItem(value: 'Improper Product', child: Text('Improper / Damaged Product')),
                DropdownMenuItem(value: 'Delivery Issue', child: Text('Delivery / Missing Item Issue')),
              ],
              onChanged: (v) => issueType = v!,
            ),
            const SizedBox(height: 12),
            TextField(
              controller: descCtrl,
              maxLines: 3,
              decoration: const InputDecoration(
                labelText: 'Complaint Description',
                hintText: 'Describe the issue clearly for the AAU Admin...',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
            onPressed: () async {
              if (descCtrl.text.trim().isEmpty) return;
              final student = ref.read(authProvider).student;
              await ref.read(complaintServiceProvider).submitComplaint(
                    orderId: order.orderId,
                    studentId: student?.studentId ?? 'student_1',
                    studentName: student?.name ?? 'AAU Student',
                    issueType: issueType,
                    description: descCtrl.text.trim(),
                  );
              if (ctx.mounted) {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Complaint submitted to AAU Admin.')),
                );
              }
            },
            child: const Text('Submit Complaint'),
          ),
        ],
      ),
    );
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