enum ProductSource { local, api }

class ProductModel {
  final String id;
  final String name;
  final String category;
  final String description;
  final double price;
  final String image;
  final int stockQuantity;
  final List<String> availableCampuses;
  final List<String> sellerIds;
  final String? discountId;
  final bool isAvailable;
  final ProductSource source;

  const ProductModel({
    required this.id,
    required this.name,
    required this.category,
    required this.description,
    required this.price,
    required this.image,
    required this.stockQuantity,
    required this.availableCampuses,
    required this.sellerIds,
    required this.discountId,
    required this.isAvailable,
    this.source = ProductSource.local,
  });

  bool get isLocal => true;
  bool get isFromApi => false;

  /// For all campus products, stockQuantity decides availability.
  bool get isInStock => stockQuantity > 0;

  factory ProductModel.fromLocalJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'] as String,
      name: json['name'] as String,
      category: json['category'] as String,
      description: json['description'] as String,
      price: (json['price'] as num).toDouble(),
      image: json['image'] as String,
      stockQuantity: json['stockQuantity'] as int,
      availableCampuses: List<String>.from(json['availableCampuses'] as List),
      sellerIds: List<String>.from(json['sellerIds'] as List),
      discountId: json['discountId'] as String?,
      isAvailable: json['isAvailable'] as bool? ?? true,
      source: ProductSource.local,
    );
  }

  /// Maps a product from the AAU Node.js/PostgreSQL backend API
  factory ProductModel.fromBackendJson(Map<String, dynamic> json) {
    final sellerId = json['seller_id'] as String? ?? '';
    final rawPrice = json['price'];
    final priceVal = rawPrice is num ? rawPrice.toDouble() : double.tryParse(rawPrice.toString()) ?? 0.0;
    return ProductModel(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? 'Product',
      category: json['category'] as String? ?? 'General',
      description: json['description'] as String? ?? '',
      price: priceVal,
      image: json['image_url'] as String? ?? 'https://placehold.co/400x400/png?text=Product',
      stockQuantity: json['stock_quantity'] as int? ?? 10,
      availableCampuses: const ['Main Campus', '4 Kilo', '5 Kilo', '6 Kilo', 'FBE', 'Black Lion'],
      sellerIds: sellerId.isNotEmpty ? [sellerId] : const [],
      discountId: null,
      isAvailable: (json['status'] as String?) == 'ACTIVE',
      source: ProductSource.local,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'description': description,
      'price': price,
      'image': image,
      'stockQuantity': stockQuantity,
      'availableCampuses': availableCampuses,
      'sellerIds': sellerIds,
      'discountId': discountId,
      'isAvailable': isAvailable,
      'source': source.name,
    };
  }

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'] as String,
      name: json['name'] as String,
      category: json['category'] as String,
      description: json['description'] as String,
      price: (json['price'] as num).toDouble(),
      image: json['image'] as String,
      stockQuantity: json['stockQuantity'] as int,
      availableCampuses: List<String>.from(json['availableCampuses'] as List? ?? []),
      sellerIds: List<String>.from(json['sellerIds'] as List? ?? []),
      discountId: json['discountId'] as String?,
      isAvailable: json['isAvailable'] as bool? ?? true,
      source: (json['source'] as String?) == 'api' ? ProductSource.api : ProductSource.local,
    );
  }

  ProductModel copyWith({
    String? id,
    String? name,
    String? category,
    String? description,
    double? price,
    String? image,
    int? stockQuantity,
    List<String>? availableCampuses,
    List<String>? sellerIds,
    String? discountId,
    bool? isAvailable,
    ProductSource? source,
  }) {
    return ProductModel(
      id: id ?? this.id,
      name: name ?? this.name,
      category: category ?? this.category,
      description: description ?? this.description,
      price: price ?? this.price,
      image: image ?? this.image,
      stockQuantity: stockQuantity ?? this.stockQuantity,
      availableCampuses: availableCampuses ?? this.availableCampuses,
      sellerIds: sellerIds ?? this.sellerIds,
      discountId: discountId ?? this.discountId,
      isAvailable: isAvailable ?? this.isAvailable,
      source: source ?? this.source,
    );
  }
}