import 'dart:convert';
import '../models/market_product.dart';
import '../models/seller.dart';

class ApiService {
  static Future<List<MarketProduct>> fetchCampusProducts() async {
    // Simulated network delay fetching AAU products
    await Future.delayed(const Duration(milliseconds: 300));
    return [];
  }

  static Future<List<Seller>> fetchCampusSellers() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return [];
  }
}