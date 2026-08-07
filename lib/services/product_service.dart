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
    final raw = await rootBundle.loadString('assets/data/local_products.json');
    final list = (jsonDecode(raw) as List).cast<Map<String, dynamic>>();
    await _storageService.seedIfEmpty(
      StorageService.productsBox,
      list,
      (item) => item['id'] as String,
    );
  }

  Future<List<ProductModel>> getLocalProducts() async {
    await _seedLocalProductsIfNeeded();
    final raw = _storageService.getAll(StorageService.productsBox);
    return raw.map((e) => ProductModel.fromJson(e)).toList();
  }

  Future<List<ProductModel>> getApiProducts() async {
    return _apiService.getProducts();
  }

  /// The unified marketplace: local + API products together.
  Future<List<ProductModel>> getAllProducts() async {
    final results = await Future.wait([getLocalProducts(), getApiProducts()]);
    return [...results[0], ...results[1]];
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
    if (campusId == null) return products;
    return products.where((p) {
      if (p.isFromApi) return true; // API products are campus-agnostic
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
    return products.where((p) => p.name.toLowerCase().contains(lower)).toList();
  }

  // ---- Admin CRUD (local products only) ----

  Future<void> createLocalProduct(ProductModel product) async {
    await _seedLocalProductsIfNeeded();
    await _storageService.putItem(StorageService.productsBox, product.id, product.toJson());
  }

  Future<void> updateLocalProduct(ProductModel product) async {
    if (product.isFromApi) {
      throw ProductServiceException('Fake Store API products are read-only.');
    }
    await _storageService.putItem(StorageService.productsBox, product.id, product.toJson());
  }

  Future<void> deleteLocalProduct(String productId) async {
    if (productId.startsWith('api_')) {
      throw ProductServiceException('Fake Store API products cannot be deleted.');
    }
    await _storageService.deleteItem(StorageService.productsBox, productId);
  }
}

final productServiceProvider = Provider<ProductService>((ref) {
  return ProductService(ref.watch(apiServiceProvider), ref.watch(storageServiceProvider));
});