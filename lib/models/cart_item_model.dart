import 'product_model.dart';

class CartItemModel {
  final String productId;
  final String name;
  final double price;
  final String image;
  final String category;
  final ProductSource source;
  final int maxStock;
  final String? note;
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
    this.note,
  });

  double get subtotal => price * quantity;

  factory CartItemModel.fromProduct(ProductModel product, {int quantity = 1, String? note}) {
    return CartItemModel(
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      source: product.source,
      maxStock: product.stockQuantity,
      quantity: quantity,
      note: (note != null && note.trim().isNotEmpty) ? note.trim() : null,
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
      note: json['note'] as String?,
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
      'note': note,
    };
  }

  CartItemModel copyWith({int? quantity, String? note}) {
    return CartItemModel(
      productId: productId,
      name: name,
      price: price,
      image: image,
      category: category,
      source: source,
      maxStock: maxStock,
      quantity: quantity ?? this.quantity,
      note: note ?? this.note,
    );
  }
}