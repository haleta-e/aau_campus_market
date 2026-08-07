import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/campus_model.dart';
import 'storage_service.dart';

class CampusServiceException implements Exception {
  final String message;
  CampusServiceException(this.message);
  @override
  String toString() => message;
}

class CampusService {
  final StorageService _storageService;
  CampusService(this._storageService);

  Future<void> _seedIfNeeded() async {
    if (!_storageService.isEmpty(StorageService.campusesBox)) return;
    final raw = await rootBundle.loadString('assets/data/campuses.json');
    final list = (jsonDecode(raw) as List).cast<Map<String, dynamic>>();
    await _storageService.seedIfEmpty(
      StorageService.campusesBox,
      list,
      (item) => item['id'] as String,
    );
  }

  Future<List<CampusModel>> getCampuses() async {
    await _seedIfNeeded();
    final raw = _storageService.getAll(StorageService.campusesBox);
    final campuses = raw.map((e) => CampusModel.fromJson(e)).toList();
    campuses.sort((a, b) => a.name.compareTo(b.name));
    return campuses;
  }

  Future<void> createCampus(CampusModel campus, List<CampusModel> existing) async {
    _assertNoDuplicateName(campus, existing);
    await _storageService.putItem(StorageService.campusesBox, campus.id, campus.toJson());
  }

  Future<void> updateCampus(CampusModel campus, List<CampusModel> existing) async {
    _assertNoDuplicateName(campus, existing);
    await _storageService.putItem(StorageService.campusesBox, campus.id, campus.toJson());
  }

  Future<void> deleteCampus(String campusId) async {
    await _storageService.deleteItem(StorageService.campusesBox, campusId);
  }

  void _assertNoDuplicateName(CampusModel campus, List<CampusModel> existing) {
    final duplicate = existing.any(
      (c) => c.name.toLowerCase() == campus.name.toLowerCase() && c.id != campus.id,
    );
    if (duplicate) {
      throw CampusServiceException('A campus with this name already exists.');
    }
  }
}

final campusServiceProvider = Provider<CampusService>((ref) {
  return CampusService(ref.watch(storageServiceProvider));
});