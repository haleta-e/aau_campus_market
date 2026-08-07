import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/market_product.dart';
import '../models/seller.dart';

class LocalDataService {
  static Future<List<MarketProduct>> loadInitialProducts() async {
    try {
      final String response = await rootBundle.loadString('lib/data/campus_products.json');
      final data = json.decode(response) as List;
      return data.map((item) => MarketProduct.fromJson(item)).toList();
    } catch (e) {
      return [];
    }
  }

  static Future<List<Seller>> loadInitialSellers() async {
    try {
      final String response = await rootBundle.loadString('lib/data/sellers.json');
      final data = json.decode(response) as List;
      return data.map((item) => Seller.fromJson(item)).toList();
    } catch (e) {
      return [];
    }
  }
}