import 'market_product.dart';

class CartItem {
  final MarketProduct product;
  int quantity;

  CartItem({
    required this.product,
    this.quantity = 1,
  });

  double get totalETB => product.priceETB * quantity;
}
