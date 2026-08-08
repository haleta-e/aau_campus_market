import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/product_model.dart';

class ApiException implements Exception {
  final String message;
  ApiException(this.message);
  @override
  String toString() => message;
}

class ApiService {
  static const String _baseUrl = 'https://fakestoreapi.com';
  static const Duration _timeout = Duration(seconds: 12);

  Future<String> login(String username, String password) async {
    try {
      final response = await http
          .post(
            Uri.parse('$_baseUrl/auth/login'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'username': username, 'password': password}),
          )
          .timeout(_timeout);

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        final token = data['token'] as String?;
        if (token == null || token.isEmpty) {
          throw ApiException('Login failed: no token returned.');
        }
        return token;
      } else if (response.statusCode == 401) {
        throw ApiException('Invalid marketplace credentials.');
      } else {
        throw ApiException('Login failed (code ${response.statusCode}).');
      }
    } on SocketException {
      throw ApiException('No internet connection. Please try again.');
    } on TimeoutException {
      throw ApiException('Connection timed out. Please try again.');
    } on FormatException {
      throw ApiException('Received an invalid response from the server.');
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException('Something went wrong. Please try again.');
    }
  }

  Future<List<Map<String, dynamic>>> getUsers() async {
    return _getList('$_baseUrl/users');
  }

  Future<Map<String, dynamic>> getUserById(int id) async {
    try {
      final response =
          await http.get(Uri.parse('$_baseUrl/users/$id')).timeout(_timeout);
      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      }
      throw ApiException('Unable to load profile (code ${response.statusCode}).');
    } on SocketException {
      throw ApiException('No internet connection. Please try again.');
    } on TimeoutException {
      throw ApiException('Connection timed out. Please try again.');
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException('Unable to load profile.');
    }
  }

  Future<List<ProductModel>> getProducts() async {
    final list = await _getList('$_baseUrl/products');
    return list.map((e) => ProductModel.fromApiJson(e)).toList();
  }

  Future<List<String>> getCategories() async {
    try {
      final response = await http
          .get(Uri.parse('$_baseUrl/products/categories'))
          .timeout(_timeout);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as List;
        return data.map((e) => e.toString()).toList();
      }
      throw ApiException('Unable to load categories (code ${response.statusCode}).');
    } on SocketException {
      throw ApiException('No internet connection. Please try again.');
    } on TimeoutException {
      throw ApiException('Connection timed out. Please try again.');
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException('Unable to load categories.');
    }
  }

  Future<List<Map<String, dynamic>>> _getList(String url) async {
    try {
      final response = await http.get(Uri.parse(url)).timeout(_timeout);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as List;
        return data.cast<Map<String, dynamic>>();
      }
      throw ApiException('Request failed (code ${response.statusCode}).');
    } on SocketException {
      throw ApiException('No internet connection. Please try again.');
    } on TimeoutException {
      throw ApiException('Connection timed out. Please try again.');
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException('Something went wrong. Please try again.');
    }
  }
}

final apiServiceProvider = Provider<ApiService>((ref) => ApiService());