import 'dart:async';
import 'dart:convert';
import 'dart:io' show Platform, SocketException;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/product_model.dart';
import 'storage_service.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final String? code;

  ApiException(this.message, {this.statusCode, this.code});

  @override
  String toString() => message;
}

class ApiService {
  final StorageService _storageService;

  ApiService(this._storageService);

  static const Duration _timeout = Duration(seconds: 10);

  /// Automatically picks localhost or Android emulator host IP (10.0.2.2)
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:4000/api/v1';
    }
    try {
      if (Platform.isAndroid) {
        return 'http://10.0.2.2:4000/api/v1';
      }
    } catch (_) {}
    return 'http://localhost:4000/api/v1';
  }

  Future<Map<String, String>> _getHeaders({bool withAuth = true}) async {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (withAuth) {
      final token = await _storageService.getAuthToken();
      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }
    }
    return headers;
  }

  // ─── AUTHENTICATION ────────────────────────────────────────────────────────

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final headers = await _getHeaders(withAuth: false);
      final response = await http
          .post(
            Uri.parse('$baseUrl/auth/login'),
            headers: headers,
            body: jsonEncode({'usernameOrEmail': email, 'password': password}),
          )
          .timeout(_timeout);

      final data = jsonDecode(response.body) as Map<String, dynamic>;

      if (response.statusCode == 200) {
        final payload = data['data'] as Map<String, dynamic>;
        final token = payload['accessToken'] as String;
        final refreshToken = payload['refreshToken'] as String?;
        final user = payload['user'] as Map<String, dynamic>;
        final role = user['role'] as String?;

        await _storageService.saveAuthToken(token, refreshToken: refreshToken, role: role);
        return payload;
      } else {
        final message = data['message'] ?? 'Authentication failed.';
        throw ApiException(message.toString(), statusCode: response.statusCode);
      }
    } on SocketException {
      throw ApiException('Cannot reach AAU backend at $baseUrl. Ensure server is running.');
    } on TimeoutException {
      throw ApiException('Connection to server timed out.');
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException('Login failed: ${e.toString()}');
    }
  }


  Future<Map<String, dynamic>> register({
    required String username,
    required String email,
    required String password,
  }) async {
    try {
      final headers = await _getHeaders(withAuth: false);
      final response = await http
          .post(
            Uri.parse('$baseUrl/auth/register'),
            headers: headers,
            body: jsonEncode({
              'username': username,
              'email': email,
              'password': password,
            }),
          )
          .timeout(_timeout);

      final data = jsonDecode(response.body) as Map<String, dynamic>;
      if (response.statusCode == 201) {
        final payload = data['data'] as Map<String, dynamic>;
        final token = payload['accessToken'] as String;
        final refreshToken = payload['refreshToken'] as String?;
        final user = payload['user'] as Map<String, dynamic>;
        final role = user['role'] as String?;

        await _storageService.saveAuthToken(token, refreshToken: refreshToken, role: role);
        return payload;
      } else {
        final message = data['message'] ?? 'Registration failed.';
        throw ApiException(message.toString(), statusCode: response.statusCode);
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Registration failed: $e');
    }
  }

  // ─── PRODUCTS ──────────────────────────────────────────────────────────────

  Future<List<ProductModel>> getProducts({String? category, String? search}) async {
    try {
      final queryParams = <String, String>{};
      if (category != null && category.isNotEmpty) queryParams['category'] = category;
      if (search != null && search.isNotEmpty) queryParams['search'] = search;

      final uri = Uri.parse('$baseUrl/products').replace(queryParameters: queryParams);
      final headers = await _getHeaders(withAuth: false);
      final response = await http.get(uri, headers: headers).timeout(_timeout);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        final list = (data['data'] as List? ?? []);
        return list.map((e) => ProductModel.fromBackendJson(e as Map<String, dynamic>)).toList();
      }
      throw ApiException('Failed to load products (code ${response.statusCode})');
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Unable to load products from server.');
    }
  }

  Future<List<String>> getCategories() async {
    try {
      final products = await getProducts();
      final set = <String>{};
      for (final p in products) {
        set.add(p.category);
      }
      return set.toList()..sort();
    } catch (_) {
      return ['Electronics', 'Books & Stationery', 'Fashion', 'Dorm & Living', 'Sports & Gear'];
    }
  }

  Future<List<Map<String, dynamic>>> getUsers() async {
    try {
      final headers = await _getHeaders(withAuth: true);
      final response = await http.get(Uri.parse('$baseUrl/admin/users'), headers: headers).timeout(_timeout);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        return (data['data'] as List).cast<Map<String, dynamic>>();
      }
      return [];
    } catch (_) {
      return [];
    }
  }

  // ─── ORDERS ────────────────────────────────────────────────────────────────

  Future<Map<String, dynamic>> placeOrder({
    required String sellerId,
    required List<Map<String, dynamic>> items,
  }) async {
    try {
      final headers = await _getHeaders(withAuth: true);
      final response = await http
          .post(
            Uri.parse('$baseUrl/orders'),
            headers: headers,
            body: jsonEncode({
              'seller_id': sellerId,
              'items': items,
            }),
          )
          .timeout(_timeout);

      final data = jsonDecode(response.body) as Map<String, dynamic>;
      if (response.statusCode == 201) {
        return data['data'] as Map<String, dynamic>;
      } else {
        throw ApiException(data['message'] ?? 'Failed to place order', statusCode: response.statusCode);
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Order failed: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getMyOrders() async {
    try {
      final headers = await _getHeaders(withAuth: true);
      final response = await http.get(Uri.parse('$baseUrl/orders/my'), headers: headers).timeout(_timeout);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        return (data['data'] as List).cast<Map<String, dynamic>>();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<bool> acceptOrder(String orderId) async {
    try {
      final headers = await _getHeaders(withAuth: true);
      final response = await http
          .post(
            Uri.parse('$baseUrl/orders/$orderId/accept'),
            headers: headers,
            body: jsonEncode({'confirm': true}),
          )
          .timeout(_timeout);
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  // ─── ADMIN DASHBOARD STATS ────────────────────────────────────────────────

  Future<Map<String, dynamic>> getAdminStats() async {
    try {
      final headers = await _getHeaders(withAuth: true);
      final response = await http.get(Uri.parse('$baseUrl/admin/stats'), headers: headers).timeout(_timeout);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        return data['data'] as Map<String, dynamic>;
      }
      throw ApiException('Failed to load admin stats', statusCode: response.statusCode);
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Unable to load admin stats.');
    }
  }

  Future<List<Map<String, dynamic>>> getAdminOrders() async {
    try {
      final headers = await _getHeaders(withAuth: true);
      final response = await http.get(Uri.parse('$baseUrl/admin/orders'), headers: headers).timeout(_timeout);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        return (data['data'] as List).cast<Map<String, dynamic>>();
      }
      return [];
    } catch (_) {
      return [];
    }
  }

  Future<List<Map<String, dynamic>>> getAdminComplaints() async {
    try {
      final headers = await _getHeaders(withAuth: true);
      final response = await http.get(Uri.parse('$baseUrl/complaints/admin'), headers: headers).timeout(_timeout);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        return (data['data'] as List).cast<Map<String, dynamic>>();
      }
      return [];
    } catch (_) {
      return [];
    }
  }

  Future<bool> resolveComplaint(String complaintId, String resolutionNotes) async {
    try {
      final headers = await _getHeaders(withAuth: true);
      final response = await http
          .patch(
            Uri.parse('$baseUrl/complaints/$complaintId/resolve'),
            headers: headers,
            body: jsonEncode({
              'status': 'RESOLVED',
              'resolution': resolutionNotes,
            }),
          )
          .timeout(_timeout);
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }
}

final apiServiceProvider = Provider<ApiService>((ref) {
  return ApiService(ref.watch(storageServiceProvider));
});