import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/product_provider.dart';
import '../../providers/discount_provider.dart';
import '../../services/discount_service.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/error_state.dart';
import '../../widgets/empty_state.dart';
import '../../widgets/product_card.dart';
import '../../widgets/category_card.dart';
import '../../widgets/app_search_bar.dart';
import 'product_details_screen.dart';

class ProductsScreen extends ConsumerWidget {
  const ProductsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productState = ref.watch(productProvider);
    final filtered = ref.watch(filteredProductsProvider);
    final categories = ref.watch(categoriesProvider);
    final selectedCategory = ref.watch(selectedCategoryProvider);
    final discounts = ref.watch(activeDiscountsProvider);
    final discountService = ref.watch(discountServiceProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Products')),
      body: Column(children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: AppSearchBar(onChanged: (v) => ref.read(searchQueryProvider.notifier).state = v),
        ),
        SizedBox(
          height: 44,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            children: [
           CategoryChip(
  label: 'All',
  isSelected: selectedCategory == null,
  onSelected: (value) =>
      ref.read(selectedCategoryProvider.notifier).state = null,
),

...categories.map(
  (c) => CategoryChip(
    label: c,
    isSelected: selectedCategory == c,
    onSelected: (value) =>
        ref.read(selectedCategoryProvider.notifier).state = c,
  ),
),
            ],
          ),
        ),
        const SizedBox(height: 8),
        Expanded(
          child: productState.isLoading
              ? const LoadingWidget()
              : productState.errorMessage != null
                  ? ErrorState(message: productState.errorMessage!, onRetry: () => ref.read(productProvider.notifier).loadProducts())
                  : filtered.isEmpty
                      ? const EmptyState(message: 'No products found.')
                      : GridView.builder(
                          padding: const EdgeInsets.all(16),
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2, mainAxisSpacing: 12, crossAxisSpacing: 12, childAspectRatio: 0.68,
                          ),
                          itemCount: filtered.length,
                          itemBuilder: (context, i) {
                            final product = filtered[i];
                            final price = discountService.applyDiscount(product, discounts);
                            return ProductCard(
                              product: product,
                              displayPrice: price,
                              onTap: () => Navigator.push(context,
                                  MaterialPageRoute(builder: (_) => ProductDetailsScreen(productId: product.id))),
                            );
                          },
                        ),
        ),
      ]),
    );
  }
}