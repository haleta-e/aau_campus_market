import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../providers/campus_provider.dart';
import '../../providers/product_provider.dart';
import '../../providers/discount_provider.dart';
import '../../services/discount_service.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/error_state.dart';
import '../../widgets/empty_state.dart';
import '../../widgets/product_card.dart';
import '../../widgets/category_card.dart';
import '../../widgets/discount_banner.dart';
import '../../widgets/app_search_bar.dart';
import '../products/product_details_screen.dart';
import '../products/products_screen.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider);
    final campusId = ref.watch(selectedCampusProvider);
    final campuses = ref.watch(campusProvider).campuses;
    final campusName = campuses.where((c) => c.id == campusId).map((c) => c.name).firstOrNull ?? 'Select Campus';
    final productState = ref.watch(productProvider);
    final discounts = ref.watch(activeDiscountsProvider);
    final discountService = ref.watch(discountServiceProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text('Hi, ${auth.student?.name.split(' ').first ?? 'Student'} 👋'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Chip(avatar: const Icon(Icons.location_on, size: 16), label: Text(campusName)),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.read(productProvider.notifier).loadProducts(),
        child: ListView(
          padding: const EdgeInsets.only(bottom: 16),
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: AppSearchBar(
                readOnly: true,
                onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ProductsScreen())),
                onChanged: (_) {},
              ),
            ),
            SizedBox(
              height: 44,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: ref.watch(categoriesProvider).map((c) {
                  return CategoryChip(
                    label: c,
                    selected: false,
                    onTap: () {
                      ref.read(selectedCategoryProvider.notifier).state = c;
                      Navigator.push(context, MaterialPageRoute(builder: (_) => const ProductsScreen()));
                    },
                  );
                }).toList(),
              ),
            ),
            if (discounts.isNotEmpty) DiscountBanner(discount: discounts.first),
            const Padding(
              padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: Text('Featured Products', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ),
            if (productState.isLoading)
              const Padding(padding: EdgeInsets.all(32), child: LoadingWidget())
            else if (productState.errorMessage != null)
              ErrorState(message: productState.errorMessage!, onRetry: () => ref.read(productProvider.notifier).loadProducts())
            else if (productState.products.isEmpty)
              const Padding(padding: EdgeInsets.all(24), child: EmptyState(message: 'No products found.'))
            else
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 16),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2, mainAxisSpacing: 12, crossAxisSpacing: 12, childAspectRatio: 0.68,
                ),
                itemCount: productState.products.take(8).length,
                itemBuilder: (context, i) {
                  final product = productState.products[i];
                  final price = discountService.applyDiscount(product, discounts);
                  return ProductCard(
                    product: product,
                    displayPrice: price,
                    onTap: () => Navigator.push(context,
                        MaterialPageRoute(builder: (_) => ProductDetailsScreen(productId: product.id))),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }
}