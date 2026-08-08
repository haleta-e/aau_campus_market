import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/cart_item_model.dart';
import '../../providers/cart_provider.dart';
import '../../providers/discount_provider.dart';
import '../../providers/order_provider.dart';
import '../../providers/campus_provider.dart';
import '../../providers/product_provider.dart';
import '../../services/discount_service.dart';
import '../../utils/constants.dart';
import '../../utils/formatters.dart';
import '../orders/orders_screen.dart';

class CheckoutScreen extends ConsumerStatefulWidget {
  /// When set, checkout uses these items instead of the cart — the "Buy
  /// Now" flow — and does NOT touch or clear the user's actual cart.
  final List<CartItemModel>? directItems;

  const CheckoutScreen({super.key, this.directItems});

  @override
  ConsumerState<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends ConsumerState<CheckoutScreen> {
  String _paymentMethod = AppConstants.paymentMethods.first;
  String _fulfillmentMethod = 'delivery';
  bool _placing = false;

  bool get _isBuyNow => widget.directItems != null;

  @override
  Widget build(BuildContext context) {
    final cartItems = ref.watch(cartProvider);
    final items = widget.directItems ?? cartItems;

    final discounts = ref.watch(activeDiscountsProvider);
    final discountService = ref.watch(discountServiceProvider);

    final subtotal = items.fold(0.0, (sum, i) => sum + i.subtotal);
    final discount = discountService.applyToCartItems(items, discounts);

    // Pickup only makes sense for local campus products with a real
    // seller physically present. API (marketplace) products have no
    // campus presence, so any API item in the order forces delivery.
    final hasApiItem = items.any((i) => i.source.name == 'api');
    final canPickup = !hasApiItem && items.isNotEmpty;

    final deliveryFee = (_fulfillmentMethod == 'delivery') ? AppConstants.deliveryFee : 0.0;
    final total = subtotal - discount + deliveryFee;

    final campusId = ref.watch(selectedCampusProvider) ?? '';
    final campuses = ref.watch(campusProvider).campuses;
    final campusName = campuses.where((c) => c.id == campusId).map((c) => c.name).firstOrNull ?? '';

    final allProducts = ref.watch(productProvider).products;
    final sellerIds = <String>{};
    for (final item in items) {
      final product = allProducts.where((p) => p.id == item.productId).firstOrNull;
      if (product != null) sellerIds.addAll(product.sellerIds);
    }

    return Scaffold(
      appBar: AppBar(title: Text(_isBuyNow ? 'Buy Now' : 'Checkout')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('Fulfillment', style: TextStyle(fontWeight: FontWeight.bold)),
          RadioListTile<String>(
            value: 'delivery',
            groupValue: _fulfillmentMethod,
            title: const Text('Delivery'),
            subtitle: Text('Delivered to you at $campusName • +${Formatters.currency(AppConstants.deliveryFee)}'),
            onChanged: (v) => setState(() => _fulfillmentMethod = v!),
          ),
          RadioListTile<String>(
            value: 'pickup',
            groupValue: _fulfillmentMethod,
            title: const Text('Pick up myself'),
            subtitle: Text(canPickup
                ? 'Collect directly from the seller at $campusName • Free'
                : 'Not available — this order includes marketplace items that must be delivered'),
            onChanged: canPickup ? (v) => setState(() => _fulfillmentMethod = v!) : null,
          ),
          const Divider(height: 32),
          const Text('Payment Method', style: TextStyle(fontWeight: FontWeight.bold)),
          ...AppConstants.paymentMethods.map((m) => RadioListTile<String>(
                value: m,
                groupValue: _paymentMethod,
                title: Text(m),
                onChanged: (v) => setState(() => _paymentMethod = v!),
              )),
          const Divider(height: 32),
          _summaryRow('Subtotal', subtotal),
          _summaryRow('Discount', -discount),
          _summaryRow('Delivery Fee', deliveryFee),
          const Divider(),
          _summaryRow('Total', total, bold: true),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ElevatedButton(
            onPressed: (items.isEmpty || _placing)
                ? null
                : () async {
                    setState(() => _placing = true);
                    await ref.read(orderProvider.notifier).placeOrder(
                          items: items,
                          subtotal: subtotal,
                          discount: discount,
                          deliveryFee: deliveryFee,
                          total: total,
                          paymentMethod: _paymentMethod,
                          fulfillmentMethod: _fulfillmentMethod,
                          campusId: campusId,
                          sellerIds: sellerIds.toList(),
                        );
                    // Only clear the real cart if this checkout came from
                    // the cart screen, not from Buy Now.
                    if (!_isBuyNow) {
                      await ref.read(cartProvider.notifier).clearCart();
                    }
                    if (context.mounted) {
                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(builder: (_) => const OrdersScreen()),
                        (r) => r.isFirst,
                      );
                    }
                  },
            child: _placing
                ? const CircularProgressIndicator(color: Colors.white)
                : Text(_isBuyNow ? 'Buy Now' : 'Place Order'),
          ),
        ),
      ),
    );
  }

  Widget _summaryRow(String label, double value, {bool bold = false}) {
    final style = TextStyle(fontWeight: bold ? FontWeight.bold : FontWeight.normal, fontSize: bold ? 16 : 14);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Text(label, style: style),
        Text(Formatters.currency(value), style: style),
      ]),
    );
  }
}
