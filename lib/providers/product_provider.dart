import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/product_model.dart';
import '../services/product_service.dart';
import 'campus_provider.dart';

class ProductState {
  final bool isLoading;
  final List<ProductModel> products;
  final String? errorMessage;

  const ProductState({this.isLoading = false, this.products = const [], this.errorMessage});

  ProductState copyWith({
    bool? isLoading,
    List<ProductModel>? products,
    String? errorMessage,
    bool clearError = false,
  }) {
    return ProductState(
      isLoading: isLoading ?? this.isLoading,
      products: products ?? this.products,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

class ProductNotifier extends StateNotifier<ProductState> {
  final ProductService _service;

  ProductNotifier(this._service) : super(const ProductState()) {
    loadProducts();
  }

  Future<void> loadProducts() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final products = await _service.getAllProducts();
      state = state.copyWith(isLoading: false, products: products);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Unable to load products. Please check your connection.',
      );
    }
  }

  Future<bool> createLocalProduct(ProductModel product) async {
    try {
      await _service.createLocalProduct(product);
      await loadProducts();
      return true;
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
      return false;
    }
  }

  Future<bool> updateLocalProduct(ProductModel product) async {
    try {
      await _service.updateLocalProduct(product);
      await loadProducts();
      return true;
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
      return false;
    }
  }

  Future<bool> deleteLocalProduct(String productId) async {
    try {
      await _service.deleteLocalProduct(productId);
      await loadProducts();
      return true;
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
      return false;
    }
  }
}

final productProvider = StateNotifierProvider<ProductNotifier, ProductState>((ref) {
  return ProductNotifier(ref.watch(productServiceProvider));
});

/// Categories — derived live from whatever products are loaded, so it
/// always reflects both local and API categories together.
final categoriesProvider = Provider<List<String>>((ref) {
  final products = ref.watch(productProvider).products;
  return ref.watch(productServiceProvider).getUnifiedCategories(products);
});

final searchQueryProvider = StateProvider<String>((ref) => '');
final selectedCategoryProvider = StateProvider<String?>((ref) => null);

/// When true, Products screen shows items from every campus — lets a
/// student check whether something's worth ordering with delivery vs
/// just waiting until they're at that campus themselves.
final viewAllCampusesProvider = StateProvider<bool>((ref) => false);

/// Narrows results to one specific seller's products (used by Seller
/// Details screen).
final sellerFilterProvider = StateProvider<String?>((ref) => null);

/// What Home/Products screens actually render: campus + category + search applied.
final filteredProductsProvider = Provider<List<ProductModel>>((ref) {
  final service = ref.watch(productServiceProvider);
  final allProducts = ref.watch(productProvider).products;
  final campusId = ref.watch(selectedCampusProvider);
  final viewAll = ref.watch(viewAllCampusesProvider);
  final category = ref.watch(selectedCategoryProvider);
  final query = ref.watch(searchQueryProvider);
  final sellerId = ref.watch(sellerFilterProvider);

  var result = viewAll ? allProducts : service.filterByCampus(allProducts, campusId);
  result = service.filterByCategory(result, category);
  result = service.search(result, query);
  if (sellerId != null) {
    result = result.where((p) => p.sellerIds.contains(sellerId)).toList();
  }
  return result;
});