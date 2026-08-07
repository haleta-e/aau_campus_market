class MarketProduct {
  final String id;
  final String title;
  final double priceETB;
  final double priceUSD;
  final String description;
  final String category;
  final String displayCategory;
  final String image;
  final double ratingRate;
  final int ratingCount;
  final bool isCampusItem;
  final int stock;
  final String? sellerId;
  final String? campusOrigin;

  MarketProduct({
    required this.id,
    required this.title,
    required this.priceETB,
    required this.priceUSD,
    required this.description,
    required this.category,
    required this.displayCategory,
    required this.image,
    required this.ratingRate,
    required this.ratingCount,
    required this.isCampusItem,
    required this.stock,
    this.sellerId,
    this.campusOrigin,
  });

  factory MarketProduct.fromJson(Map<String, dynamic> json) {
    return MarketProduct(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      priceETB: (json['priceETB'] as num?)?.toDouble() ?? 0.0,
      priceUSD: (json['priceUSD'] as num?)?.toDouble() ?? 0.0,
      description: json['description'] ?? '',
      category: json['category'] ?? 'general',
      displayCategory: json['displayCategory'] ?? 'General',
      image: json['image'] ?? '',
      ratingRate: (json['ratingRate'] as num?)?.toDouble() ?? 5.0,
      ratingCount: json['ratingCount'] ?? 0,
      isCampusItem: json['isCampusItem'] ?? true,
      stock: json['stock'] ?? 10,
      sellerId: json['sellerId'],
      campusOrigin: json['campusOrigin'] ?? '4 Kilo',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'priceETB': priceETB,
    'priceUSD': priceUSD,
    'description': description,
    'category': category,
    'displayCategory': displayCategory,
    'image': image,
    'ratingRate': ratingRate,
    'ratingCount': ratingCount,
    'isCampusItem': isCampusItem,
    'stock': stock,
    'sellerId': sellerId,
    'campusOrigin': campusOrigin,
  };
}