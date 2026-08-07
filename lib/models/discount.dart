class Discount {
  final String code;
  final double percentage;
  final String title;
  final String description;
  final bool isActive;

  Discount({
    required this.code,
    required this.percentage,
    required this.title,
    required this.description,
    required this.isActive,
  });

  factory Discount.fromJson(Map<String, dynamic> json) {
    return Discount(
      code: json['code'] ?? '',
      percentage: (json['percentage'] as num?)?.toDouble() ?? 0.0,
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      isActive: json['isActive'] ?? true,
    );
  }
}