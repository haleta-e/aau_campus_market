import 'package:flutter/material.dart';
import '../models/market_product.dart';

class ProductProvider extends ChangeNotifier {
  List<MarketProduct> _products = [];
  String _selectedCampus = '4 Kilo';

  List<MarketProduct> get products => _products;
  String get selectedCampus => _selectedCampus;

  void setSelectedCampus(String campus) {
    _selectedCampus = campus;
    notifyListeners();
  }

  void setProducts(List<MarketProduct> items) {
    _products = items;
    notifyListeners();
  }
}