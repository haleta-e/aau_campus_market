import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/seller_model.dart';
import 'storage_service.dart';

class SellerServiceException implements Exception {
  final String message;
  SellerServiceException(this.message);
  @override
  String toString() => message;
}

class SellerService {
  final StorageService _storageService;
  SellerService(this._storageService);

  Future<void> _seedIfNeeded() async {
    if (!_storageService.isEmpty(StorageService.sellersBox)) return;
    final raw = await rootBundle.loadString('assets/data/sellers.json');
    final list = (jsonDecode(raw) as List).cast<Map<String, dynamic>>();
    await _storageService.seedIfEmpty(
      StorageService.sellersBox,
      list,
      (item) => item['id'] as String,
    );
  }

  Future<List<SellerModel>> getSellers() async {
    await _seedIfNeeded();
    final raw = _storageService.getAll(StorageService.sellersBox);
    return raw.map((e) => SellerModel.fromJson(e)).toList();
  }

  List<SellerModel> sellersByCampus(List<SellerModel> sellers, String campusId) {
    return sellers.where((s) => s.campusId == campusId).toList();
  }

  SellerModel? sellerById(List<SellerModel> sellers, String id) {
    for (final s in sellers) {
      if (s.id == id) return s;
    }
    return null;
  }

  Future<void> createSeller(SellerModel seller) async {
    _validate(seller);
    await _storageService.putItem(StorageService.sellersBox, seller.id, seller.toJson());
  }

  Future<void> updateSeller(SellerModel seller) async {
    _validate(seller);
    await _storageService.putItem(StorageService.sellersBox, seller.id, seller.toJson());
  }

  Future<void> deleteSeller(String sellerId) async {
    await _storageService.deleteItem(StorageService.sellersBox, sellerId);
  }

  void _validate(SellerModel seller) {
    if (seller.name.trim().isEmpty) {
      throw SellerServiceException('Seller name is required.');
    }
    if (seller.studentId.trim().isEmpty) {
      throw SellerServiceException('Seller student ID is required.');
    }
    if (seller.campusId.trim().isEmpty) {
      throw SellerServiceException('Seller campus is required.');
    }
    if (seller.department.trim().isEmpty) {
      throw SellerServiceException('Seller department is required.');
    }
  }
}

final sellerServiceProvider = Provider<SellerService>((ref) {
  return SellerService(ref.watch(storageServiceProvider));
});