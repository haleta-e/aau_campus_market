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

  /// Only populated for API products (Fake Store API provides a rating).
  final double? apiRating;
  final int? apiRatingCount;

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
    required this.source,
    this.apiRating,
    this.apiRatingCount,
  });

  bool get isLocal => source == ProductSource.local;
  bool get isFromApi => source == ProductSource.api;

  /// For local products, admin-set stock decides this.
  /// For API products (read-only), we treat them as always in stock.
  bool get isInStock => isFromApi ? true : stockQuantity > 0;

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

  /// Maps a raw Fake Store API product response into the unified model.
  /// API products have no campus/seller — they're available marketplace-wide.
  factory ProductModel.fromApiJson(Map<String, dynamic> json) {
    final ratingJson = json['rating'] as Map<String, dynamic>?;
    return ProductModel(
      id: 'api_${json['id']}',
      name: json['title'] as String,
      category: _mapApiCategory(json['category'] as String),
      description: json['description'] as String,
      price: (json['price'] as num).toDouble(),
      image: json['image'] as String,
      // Fake Store API has no real stock field; API products are
      // treated as always available (see isInStock), this is only
      // used as a soft display cap for quantity selection.
      stockQuantity: 50,
      availableCampuses: const [],
      sellerIds: const [],
      discountId: null,
      isAvailable: true,
      source: ProductSource.api,
      apiRating: ratingJson != null ? (ratingJson['rate'] as num?)?.toDouble() : null,
      apiRatingCount: ratingJson != null ? ratingJson['count'] as int? : null,
    );
  }

  /// Normalizes Fake Store API's category strings to match our
  /// unified category set shown in the UI (Electronics, Fashion, Accessories).
  static String _mapApiCategory(String apiCategory) {
    switch (apiCategory) {
      case 'electronics':
        return 'Electronics';
      case "men's clothing":
      case "women's clothing":
        return 'Fashion';
      case 'jewelery':
        return 'Accessories';
      default:
        return apiCategory;
    }
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
      source: source,
      apiRating: apiRating,
      apiRatingCount: apiRatingCount,
    );
  }
}