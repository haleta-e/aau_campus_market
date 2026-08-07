import 'package:flutter/material.dart';

class CategoryProvider extends ChangeNotifier {
  String _selectedCategory = 'All';

  String get selectedCategory => _selectedCategory;

  final List<String> categories = [
    'All',
    'Snacks',
    'Drinks',
    'Stationery',
    'Sanitary',
    'Detergent',
    'Campus Fashion'
  ];

  void setCategory(String category) {
    _selectedCategory = category;
    notifyListeners();
  }
}