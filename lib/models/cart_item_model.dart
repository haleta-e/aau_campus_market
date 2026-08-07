import 'product_model.dart';

class CartItemModel {
  final String productId;
  final String name;
  final double price;
  final String image;
  final String category;
  final ProductSource source;
  final int maxStock;
  int quantity;

  CartItemModel({
    required this.productId,
    required this.name,
    required this.price,
    required this.image,
    required this.category,
    required this.source,
    required this.maxStock,
    required this.quantity,
  });

  double get subtotal => price * quantity;

  factory CartItemModel.fromProduct(ProductModel product, {int quantity = 1}) {
    return CartItemModel(
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      source: product.source,
      maxStock: product.stockQuantity,
      quantity: quantity,
    );
  }

  factory CartItemModel.fromJson(Map<String, dynamic> json) {
    return CartItemModel(
      productId: json['productId'] as String,
      name: json['name'] as String,
      price: (json['price'] as num).toDouble(),
      image: json['image'] as String,
      category: json['category'] as String,
      source: (json['source'] as String) == 'api' ? ProductSource.api : ProductSource.local,
      maxStock: json['maxStock'] as int,
      quantity: json['quantity'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'productId': productId,
      'name': name,
      'price': price,
      'image': image,
      'category': category,
      'source': source.name,
      'maxStock': maxStock,
      'quantity': quantity,
    };
  }

  CartItemModel copyWith({int? quantity}) {
    return CartItemModel(
      productId: productId,
      name: name,
      price: price,
      image: image,
      category: category,
      source: source,
      maxStock: maxStock,
      quantity: quantity ?? this.quantity,
    );
  }
}