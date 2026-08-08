import 'package:flutter/material.dart';
import '../screens/products/product_details_screen.dart';

class AppRoutes {
  static const String productDetails = '/product-details';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case productDetails:
        final productId = settings.arguments as String;
        return MaterialPageRoute(builder: (_) => ProductDetailsScreen(productId: productId));
      default:
        return MaterialPageRoute(
          builder: (_) => const Scaffold(body: Center(child: Text('Page not found'))),
        );
    }
  }
}