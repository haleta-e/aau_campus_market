import 'package:flutter/material.dart';

class SearchProvider extends ChangeNotifier {
  String _query = '';

  String get query => _query;

  void setQuery(String q) {
    _query = q;
    notifyListeners();
  }

  void clearQuery() {
    _query = '';
    notifyListeners();
  }
}
