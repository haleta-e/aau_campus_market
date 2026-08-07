import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'providers/auth_provider.dart';
import 'providers/product_provider.dart';
import 'providers/category_provider.dart';
import 'providers/cart_provider.dart';
import 'providers/order_provider.dart';
import 'providers/search_provider.dart';
import 'providers/admin_provider.dart';

import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'screens/product_details_screen.dart';
import 'screens/search_screen.dart';
import 'screens/category_products_screen.dart';
import 'screens/cart_screen.dart';
import 'screens/checkout_screen.dart';
import 'screens/orders_screen.dart';
import 'screens/order_details_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/admin_dashboard_screen.dart';

import 'utils/theme.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ProductProvider()),
        ChangeNotifierProvider(create: (_) => CategoryProvider()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
        ChangeNotifierProvider(create: (_) => OrderProvider()),
        ChangeNotifierProvider(create: (_) => SearchProvider()),
        ChangeNotifierProvider(create: (_) => AdminProvider()),
      ],
      child: const AAUCampusApp(),
    ),
  );
}

class AAUCampusApp extends StatelessWidget {
  const AAUCampusApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AAU Campus Marketplace',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      initialRoute: '/',
      routes: {
        '/': (context) => const SplashScreen(),
        '/login': (context) => const LoginScreen(),
        '/home': (context) => const HomeScreen(),
        '/product-details': (context) => const ProductDetailsScreen(),
        '/search': (context) => const SearchScreen(),
        '/category': (context) => const CategoryProductsScreen(categoryName: 'Snacks'),
        '/cart': (context) => const CartScreen(),
        '/checkout': (context) => const CheckoutScreen(),
        '/orders': (context) => const OrdersScreen(),
        '/order-details': (context) => const OrderDetailsScreen(),
        '/profile': (context) => const ProfileScreen(),
        '/admin': (context) => const AdminDashboardScreen(),
      },
    );
  }
}
