import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/seller_provider.dart';
import '../../providers/campus_provider.dart';
import '../../providers/product_provider.dart';
import '../../providers/discount_provider.dart';
import '../../services/discount_service.dart';
import '../../widgets/product_card.dart';
import '../../widgets/empty_state.dart';
import '../products/product_details_screen.dart';

class SellerDetailsScreen extends ConsumerWidget {
  final String sellerId;
  const SellerDetailsScreen({super.key, required this.sellerId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final sellers = ref.watch(sellerProvider).sellers;
    final seller = sellers.where((s) => s.id == sellerId).firstOrNull;
    if (seller == null) {
      return const Scaffold(body: Center(child: Text('Seller not found.')));
    }

    final campuses = ref.watch(campusProvider).campuses;
    final campusName = campuses.where((c) => c.id == seller.campusId).map((c) => c.name).firstOrNull ?? '';
    final allProducts = ref.watch(productProvider).products;
    final sellerProducts = allProducts.where((p) => p.sellerIds.contains(seller.id)).toList();
    final discounts = ref.watch(activeDiscountsProvider);
    final discountService = ref.watch(discountServiceProvider);

    return Scaffold(
      appBar: AppBar(title: Text(seller.name)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Row(children: [
            CircleAvatar(radius: 32, backgroundImage: NetworkImage(seller.image)),
            const SizedBox(width: 16),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(seller.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                Text('${seller.department} • $campusName'),
                Row(children: [
                  const Icon(Icons.star, size: 16, color: Colors.amber),
                  Text(' ${seller.rating}'),
                  const SizedBox(width: 10),
                  Text(seller.active ? 'Active' : 'Currently unavailable',
                      style: TextStyle(color: seller.active ? Colors.green : Colors.grey, fontSize: 12)),
                ]),
              ]),
            ),
          ]),
          const Divider(height: 32),
          Text('Products from ${seller.name}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 12),
          if (sellerProducts.isEmpty)
            const EmptyState(message: 'This seller has no products listed right now.')
          else
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2, mainAxisSpacing: 12, crossAxisSpacing: 12, childAspectRatio: 0.62,
              ),
              itemCount: sellerProducts.length,
              itemBuilder: (context, i) {
                final product = sellerProducts[i];
                final price = discountService.applyDiscount(product, discounts);
                return ProductCard(
                  product: product,
                  displayPrice: price,
                  locationLabel: campusName,
                  onTap: () => Navigator.push(context,
                      MaterialPageRoute(builder: (_) => ProductDetailsScreen(productId: product.id))),
                );
              },
            ),
        ],
      ),
    );
  }
}