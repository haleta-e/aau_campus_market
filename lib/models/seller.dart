class Seller {
  final String id;
  final String storeName;
  final String ownerName;
  final String department;
  final String campus;
  final double rating;
  final int reviewCount;
  final String phone;
  final String avatarUrl;
  final bool verifiedStudent;
  final String deliveryTime;
  final bool activeStatus;

  Seller({
    required this.id,
    required this.storeName,
    required this.ownerName,
    required this.department,
    required this.campus,
    required this.rating,
    required this.reviewCount,
    required this.phone,
    required this.avatarUrl,
    required this.verifiedStudent,
    required this.deliveryTime,
    required this.activeStatus,
  });

  factory Seller.fromJson(Map<String, dynamic> json) {
    return Seller(
      id: json['id'] ?? '',
      storeName: json['storeName'] ?? '',
      ownerName: json['ownerName'] ?? '',
      department: json['department'] ?? '',
      campus: json['campus'] ?? '4 Kilo',
      rating: (json['rating'] as num?)?.toDouble() ?? 5.0,
      reviewCount: json['reviewCount'] ?? 0,
      phone: json['phone'] ?? '',
      avatarUrl: json['avatarUrl'] ?? '',
      verifiedStudent: json['verifiedStudent'] ?? true,
      deliveryTime: json['deliveryTime'] ?? '15 mins',
      activeStatus: json['activeStatus'] ?? true,
    );
  }
}
