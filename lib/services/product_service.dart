import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/product_model.dart';
import 'api_service.dart';
import 'storage_service.dart';

class ProductServiceException implements Exception {
  final String message;
  ProductServiceException(this.message);
  @override
  String toString() => message;
}

class ProductService {
  final ApiService _apiService;
  final StorageService _storageService;

  ProductService(this._apiService, this._storageService);

  Future<void> _seedLocalProductsIfNeeded() async {
    if (!_storageService.isEmpty(StorageService.productsBox)) return;
    try {
      final raw = await rootBundle.loadString('assets/data/local_products.json');
      final list = (jsonDecode(raw) as List).cast<Map<String, dynamic>>();
      await _storageService.seedIfEmpty(
        StorageService.productsBox,
        list,
        (item) => item['id'] as String,
      );
    } catch (_) {}
  }

  Future<List<ProductModel>> getLocalProducts() async {
    await _seedLocalProductsIfNeeded();
    final raw = _storageService.getAll(StorageService.productsBox);
    return raw.map((e) => ProductModel.fromJson(e)).toList();
  }


  Future<List<ProductModel>> getBackendProducts() async {
    try {
      return await _apiService.getProducts();
    } catch (_) {
      return [];
    }
  }

  /// Unified marketplace: always merges LOCAL products + BACKEND products.
  /// Falls back to local-only if backend is unreachable.
  Future<List<ProductModel>> getAllProducts() async {
    // Always load local products first
    final localProducts = await getLocalProducts();

    // Try to load live backend products and merge them
    List<ProductModel> backendProducts = [];
    try {
      backendProducts = await _apiService.getProducts();
    } catch (_) {
      // Backend offline — local products only
    }

    // Deduplicate: backend products keyed by id take precedence over local with same id
    final merged = <String, ProductModel>{};
    for (final p in localProducts) {
      merged[p.id] = p;
    }
    for (final p in backendProducts) {
      merged[p.id] = p;
    }

    final all = merged.values.toList();
    // Sort: local products first, then backend, alphabetically within groups
    all.sort((a, b) {
      if (a.isLocal && !b.isLocal) return -1;
      if (!a.isLocal && b.isLocal) return 1;
      return a.name.compareTo(b.name);
    });
    return all;
  }

  List<String> getUnifiedCategories(List<ProductModel> products) {
    final set = <String>{};
    for (final p in products) {
      set.add(p.category);
    }
    final list = set.toList()..sort();
    return list;
  }

  List<ProductModel> filterByCampus(List<ProductModel> products, String? campusId) {
    if (campusId == null || campusId.isEmpty) return products;
    return products.where((p) {
      if (p.availableCampuses.isEmpty) return true;
      return p.availableCampuses.contains(campusId);
    }).toList();
  }

  List<ProductModel> filterByCategory(List<ProductModel> products, String? category) {
    if (category == null || category.isEmpty) return products;
    return products.where((p) => p.category == category).toList();
  }

  List<ProductModel> search(List<ProductModel> products, String query) {
    if (query.trim().isEmpty) return products;
    final lower = query.trim().toLowerCase();
    return products.where((p) => p.name.toLowerCase().contains(lower) || p.description.toLowerCase().contains(lower)).toList();
  }

  // ---- Admin CRUD ----

  Future<void> createLocalProduct(ProductModel product) async {
    await _seedLocalProductsIfNeeded();
    await _storageService.putItem(StorageService.productsBox, product.id, product.toJson());
  }

  Future<void> updateLocalProduct(ProductModel product) async {
    await _storageService.putItem(StorageService.productsBox, product.id, product.toJson());
  }

  Future<void> deleteLocalProduct(String productId) async {
    await _storageService.deleteItem(StorageService.productsBox, productId);
  }
}

final productServiceProvider = Provider<ProductService>((ref) {
  return ProductService(ref.watch(apiServiceProvider), ref.watch(storageServiceProvider));
});