import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../models/cart_item_model.dart';
import '../../providers/product_provider.dart';
import '../../providers/seller_provider.dart';
import '../../providers/campus_provider.dart';
import '../../providers/discount_provider.dart';
import '../../providers/cart_provider.dart';
import '../../services/discount_service.dart';
import '../../utils/formatters.dart';
import '../checkout/checkout_screen.dart';
import '../sellers/seller_details_screen.dart';

class ProductDetailsScreen extends ConsumerStatefulWidget {
  final String productId;
  const ProductDetailsScreen({super.key, required this.productId});

  @override
  ConsumerState<ProductDetailsScreen> createState() => _ProductDetailsScreenState();
}

class _ProductDetailsScreenState extends ConsumerState<ProductDetailsScreen> {
  int _quantity = 1;
  final _noteController = TextEditingController();

  @override
  void dispose() {
    _noteController.dispose();
    super.dispose();
  }

  Future<void> _call(String phone) async {
    final uri = Uri(scheme: 'tel', path: phone);
    if (await canLaunchUrl(uri)) await launchUrl(uri);
  }

  @override
  Widget build(BuildContext context) {
    final products = ref.watch(productProvider).products;
    final product = products.where((p) => p.id == widget.productId).firstOrNull;
    if (product == null) {
      return const Scaffold(body: Center(child: Text('Product not found.')));
    }

    final sellers = ref.watch(sellerProvider).sellers;
    final productSellers = sellers.where((s) => product.sellerIds.contains(s.id)).toList();
    final campuses = ref.watch(campusProvider).campuses;
    final campusNames = product.availableCampuses
        .map((id) => campuses.where((c) => c.id == id).map((c) => c.name).firstOrNull)
        .whereType<String>()
        .toList();
    final discounts = ref.watch(activeDiscountsProvider);
    final discountService = ref.watch(discountServiceProvider);
    final price = discountService.applyDiscount(product, discounts);

    return Scaffold(
      appBar: AppBar(title: Text(product.name)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            height: 220,
            decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(14)),
            child: product.isFromApi
                ? Image.network(product.image, fit: BoxFit.contain)
                : Image.asset(product.image, fit: BoxFit.contain, errorBuilder: (_, __, ___) => const Icon(Icons.image_not_supported, size: 48)),
          ),
          const SizedBox(height: 16),
          Text(product.name, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Row(children: [
            Text(Formatters.currency(price), style: const TextStyle(fontSize: 18, color: Color(0xFF2E7D32), fontWeight: FontWeight.bold)),
            if (price < product.price) ...[
              const SizedBox(width: 8),
              Text(Formatters.currency(product.price), style: const TextStyle(decoration: TextDecoration.lineThrough, color: Colors.grey)),
            ],
          ]),
          const SizedBox(height: 8),
          Wrap(spacing: 8, runSpacing: 8, children: [
            Chip(label: Text(product.category)),
            if (product.apiRating != null) Chip(avatar: const Icon(Icons.star, size: 16, color: Colors.amber), label: Text('${product.apiRating}')),
            if (product.isLocal) Chip(label: Text(product.isInStock ? 'In stock (${product.stockQuantity})' : 'Out of stock')),
            if (product.isLocal)
              ...campusNames.map((name) => Chip(avatar: const Icon(Icons.location_on, size: 16), label: Text(name))),
          ]),
          const SizedBox(height: 16),
          Text(product.description),
          const SizedBox(height: 16),
          const Text('Estimated delivery: 20–40 mins on campus', style: TextStyle(color: Colors.grey)),
          const SizedBox(height: 16),
          TextField(
            controller: _noteController,
            decoration: const InputDecoration(
              labelText: 'Note for seller (optional)',
              hintText: 'e.g. extra cold, or a specific brand',
              border: OutlineInputBorder(),
              isDense: true,
            ),
            maxLines: 2,
          ),
          if (productSellers.isNotEmpty) ...[
            const Divider(height: 32),
            const Text('Seller', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            ...productSellers.map((s) => ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: CircleAvatar(backgroundImage: NetworkImage(s.image)),
                  title: Text(s.name),
                  subtitle: Text('${s.department} • ${s.active ? "Active" : "Currently unavailable"}'),
                  trailing: Row(mainAxisSize: MainAxisSize.min, children: [
                    IconButton(icon: const Icon(Icons.call_outlined), onPressed: () => _call(s.phone)),
                    const Icon(Icons.star, size: 16, color: Colors.amber),
                    Text('${s.rating}'),
                  ]),
                  onTap: () => Navigator.push(context,
                      MaterialPageRoute(builder: (_) => SellerDetailsScreen(sellerId: s.id))),
                )),
          ],
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Row(children: [
              IconButton(
                onPressed: () => setState(() => _quantity = _quantity > 1 ? _quantity - 1 : 1),
                icon: const Icon(Icons.remove_circle_outline),
              ),
              Text('$_quantity', style: const TextStyle(fontSize: 16)),
              IconButton(
                onPressed: () => setState(() {
                  if (!product.isLocal || _quantity < product.stockQuantity) _quantity++;
                }),
                icon: const Icon(Icons.add_circle_outline),
              ),
              const Spacer(),
              if (product.isLocal && campusNames.isNotEmpty)
                Flexible(
                  child: Text(
                    'Available at: ${campusNames.join(", ")}',
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                    textAlign: TextAlign.right,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
            ]),
            const SizedBox(height: 10),
            Row(children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: !product.isInStock
                      ? null
                      : () async {
                          try {
                            await ref.read(cartProvider.notifier).addToCart(
                                  product,
                                  quantity: _quantity,
                                  note: _noteController.text,
                                );
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Added to cart')));
                            }
                          } catch (e) {
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
                            }
                          }
                        },
                  icon: const Icon(Icons.shopping_cart_outlined),
                  label: const Text('Add to Cart'),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: !product.isInStock
                      ? null
                      : () {
                          if (product.isLocal && _quantity > product.stockQuantity) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Only ${product.stockQuantity} in stock.')),
                            );
                            return;
                          }
                          final buyNowItem = CartItemModel.fromProduct(
                            product, quantity: _quantity, note: _noteController.text,
                          );
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => CheckoutScreen(directItems: [buyNowItem])),
                          );
                        },
                  icon: const Icon(Icons.flash_on),
                  label: const Text('Buy Now'),
                ),
              ),
            ]),
          ]),
        ),
      ),
    );
  }
}