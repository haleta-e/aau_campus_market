class Store {
  final String id;
  final String name;
  final String campus;
  final String dormBlock;
  final String ownerName;
  final String ownerPhone;
  final String rating;
  final int totalSales;
  final bool isOpen;

  Store({
    required this.id,
    required this.name,
    required this.campus,
    required this.dormBlock,
    required this.ownerName,
    required this.ownerPhone,
    required this.rating,
    required this.totalSales,
    required this.isOpen,
  });

  factory Store.fromJson(Map<String, dynamic> json) {
    return Store(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      campus: json['campus'] ?? '4 Kilo',
      dormBlock: json['dormBlock'] ?? '',
      ownerName: json['ownerName'] ?? '',
      ownerPhone: json['ownerPhone'] ?? '',
      rating: json['rating']?.toString() ?? '5.0',
      totalSales: json['totalSales'] ?? 0,
      isOpen: json['isOpen'] ?? true,
    );
  }
}
