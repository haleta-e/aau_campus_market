import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../providers/seller_provider.dart';
import '../../providers/campus_provider.dart';
import '../../providers/product_provider.dart';
import '../../providers/discount_provider.dart';
import '../../providers/review_provider.dart';
import '../../providers/auth_provider.dart';
import '../../services/discount_service.dart';
import '../../widgets/product_card.dart';
import '../../widgets/empty_state.dart';
import '../products/product_details_screen.dart';

class SellerDetailsScreen extends ConsumerWidget {
  final String sellerId;
  const SellerDetailsScreen({super.key, required this.sellerId});

  Future<void> _call(String phone) async {
    final uri = Uri(scheme: 'tel', path: phone);
    if (await canLaunchUrl(uri)) await launchUrl(uri);
  }

  Future<void> _sms(String phone) async {
    final uri = Uri(scheme: 'sms', path: phone);
    if (await canLaunchUrl(uri)) await launchUrl(uri);
  }

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
    final reviews = ref.watch(sellerReviewsProvider(seller.id));

    return Scaffold(
      appBar: AppBar(title: Text(seller.name)),
      floatingActionButton: FloatingActionButton.extended(
        icon: const Icon(Icons.rate_review_outlined),
        label: const Text('Leave a Review'),
        onPressed: () => _showReviewDialog(context, ref, seller.id),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 90),
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
          const SizedBox(height: 16),
          Row(children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => _call(seller.phone),
                icon: const Icon(Icons.call_outlined),
                label: const Text('Call'),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => _sms(seller.phone),
                icon: const Icon(Icons.sms_outlined),
                label: const Text('Message'),
              ),
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
          const Divider(height: 32),
          Text('Student Reviews (${reviews.length})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 12),
          if (reviews.isEmpty)
            const Text('No reviews yet. Be the first to leave one!', style: TextStyle(color: Colors.grey))
          else
            ...reviews.map((r) => Card(
                  margin: const EdgeInsets.only(bottom: 8),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Row(children: [
                        Text(r.studentName, style: const TextStyle(fontWeight: FontWeight.w600)),
                        const Spacer(),
                        Row(children: List.generate(5, (i) => Icon(
                              i < r.rating ? Icons.star : Icons.star_border,
                              size: 14, color: Colors.amber,
                            ))),
                      ]),
                      const SizedBox(height: 4),
                      Text(r.comment),
                    ]),
                  ),
                )),
        ],
      ),
    );
  }

  void _showReviewDialog(BuildContext context, WidgetRef ref, String sellerId) {
    final commentController = TextEditingController();
    double rating = 5;
    final studentName = ref.read(authProvider).student?.name ?? 'Anonymous Student';

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text('Leave a Review'),
          content: Column(mainAxisSize: MainAxisSize.min, children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(5, (i) {
                return IconButton(
                  icon: Icon(i < rating ? Icons.star : Icons.star_border, color: Colors.amber),
                  onPressed: () => setState(() => rating = (i + 1).toDouble()),
                );
              }),
            ),
            TextField(
              controller: commentController,
              maxLines: 3,
              decoration: const InputDecoration(hintText: 'How was this seller?', border: OutlineInputBorder()),
            ),
          ]),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () async {
                if (commentController.text.trim().isEmpty) return;
                await ref.read(reviewSubmitProvider.notifier).submit(
                      sellerId: sellerId,
                      studentName: studentName,
                      comment: commentController.text.trim(),
                      rating: rating,
                    );
                if (context.mounted) Navigator.pop(context);
              },
              child: const Text('Submit'),
            ),
          ],
        ),
      ),
    );
  }
}