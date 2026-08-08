import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/cart_provider.dart';
import '../../providers/order_provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/campus_provider.dart';
import '../../utils/constants.dart';
import '../../utils/formatters.dart';
import '../orders/orders_screen.dart';

class CheckoutScreen extends ConsumerStatefulWidget {
  const CheckoutScreen({super.key});
  @override
  ConsumerState<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends ConsumerState<CheckoutScreen> {
  String _paymentMethod = AppConstants.paymentMethods.first;
  bool _placing = false;

  @override
  Widget build(BuildContext context) {
    final items = ref.watch(cartProvider);
    final subtotal = ref.watch(cartSubtotalProvider);
    final discount = ref.watch(cartDiscountProvider);
    final total = ref.watch(cartTotalProvider);
    final campusId = ref.watch(selectedCampusProvider) ?? '';
    final sellerIds = items.map((i) => i.productId).toSet().toList();

    return Scaffold(
      appBar: AppBar(title: const Text('Checkout')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('Payment Method', style: TextStyle(fontWeight: FontWeight.bold)),
          ...AppConstants.paymentMethods.map((m) => RadioListTile<String>(
                value: m, groupValue: _paymentMethod, title: Text(m),
                onChanged: (v) => setState(() => _paymentMethod = v!),
              )),
          const Divider(height: 32),
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [const Text('Subtotal'), Text(Formatters.currency(subtotal))]),
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [const Text('Discount'), Text('-${Formatters.currency(discount)}')]),
          const Divider(),
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            const Text('Total', style: TextStyle(fontWeight: FontWeight.bold)),
            Text(Formatters.currency(total), style: const TextStyle(fontWeight: FontWeight.bold)),
          ]),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ElevatedButton(
            onPressed: _placing
                ? null
                : () async {
                    setState(() => _placing = true);
                    await ref.read(orderProvider.notifier).placeOrder(
                          items: items, subtotal: subtotal, discount: discount, total: total,
                          paymentMethod: _paymentMethod, campusId: campusId, sellerIds: sellerIds,
                        );
                    await ref.read(cartProvider.notifier).clearCart();
                    if (context.mounted) {
                      Navigator.pushAndRemoveUntil(
                        context, MaterialPageRoute(builder: (_) => const OrdersScreen()), (r) => r.isFirst,
                      );
                    }
                  },
            child: _placing ? const CircularProgressIndicator(color: Colors.white) : const Text('Place Order'),
          ),
        ),
      ),
    );
  }
}