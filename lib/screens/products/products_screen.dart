import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/product_model.dart';
import '../../providers/product_provider.dart';
import '../../providers/discount_provider.dart';
import '../../providers/campus_provider.dart';
import '../../services/discount_service.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/error_state.dart';
import '../../widgets/empty_state.dart';
import '../../widgets/product_card.dart';
import '../../widgets/category_card.dart';
import '../../widgets/app_search_bar.dart';
import 'product_details_screen.dart';
import '../sellers/sellers_screen.dart';

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
    final viewAll = ref.watch(viewAllCampusesProvider);
    final campuses = ref.watch(campusProvider).campuses;

    String? locationLabelFor(ProductModel product) {
      if (product.isFromApi) return null;
      final names = product.availableCampuses
          .map((id) => campuses.where((c) => c.id == id).map((c) => c.name).firstOrNull)
          .whereType<String>()
          .toList();
      if (names.isEmpty) return null;
      return names.join(', ');
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Products'),
        actions: [
          IconButton(
            tooltip: 'Browse by seller',
            icon: const Icon(Icons.people_outline),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const SellersScreen())),
          ),
        ],
      ),
      body: Column(children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: AppSearchBar(onChanged: (v) => ref.read(searchQueryProvider.notifier).state = v),
        ),
        SwitchListTile(
          dense: true,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16),
          title: const Text('Show all campuses', style: TextStyle(fontSize: 13)),
          subtitle: const Text("See what's available elsewhere before you order", style: TextStyle(fontSize: 11)),
          value: viewAll,
          onChanged: (v) => ref.read(viewAllCampusesProvider.notifier).state = v,
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
  onSelected: (_) =>
      ref.read(selectedCategoryProvider.notifier).state = null,
),

...categories.map(
  (c) => CategoryChip(
    label: c,
    isSelected: selectedCategory == c,
    onSelected: (_) =>
        ref.read(selectedCategoryProvider.notifier).state = c,
  ),
),]
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
                            crossAxisCount: 2, mainAxisSpacing: 12, crossAxisSpacing: 12, childAspectRatio: 0.62,
                          ),
                          itemCount: filtered.length,
                          itemBuilder: (context, i) {
                            final product = filtered[i];
                            final price = discountService.applyDiscount(product, discounts);
                            return ProductCard(
                              product: product,
                              displayPrice: price,
                              locationLabel: locationLabelFor(product),
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