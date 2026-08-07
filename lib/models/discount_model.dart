class DiscountModel {
  final String id;
  final String name;
  final double percentage;
  final DateTime startDate;
  final DateTime endDate;
  final List<String> applicableCategories;
  final bool active;

  const DiscountModel({
    required this.id,
    required this.name,
    required this.percentage,
    required this.startDate,
    required this.endDate,
    required this.applicableCategories,
    required this.active,
  });

  /// True only when the admin has enabled it AND today falls within
  /// its configured date range. This is the single source of truth
  /// for whether a discount should visibly apply anywhere in the app.
  bool get isCurrentlyActive {
    final now = DateTime.now();
    return active && !now.isBefore(startDate) && !now.isAfter(endDate);
  }

  factory DiscountModel.fromJson(Map<String, dynamic> json) {
    return DiscountModel(
      id: json['id'] as String,
      name: json['name'] as String,
      percentage: (json['percentage'] as num).toDouble(),
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: DateTime.parse(json['endDate'] as String),
      applicableCategories: List<String>.from(json['applicableCategories'] as List),
      active: json['active'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'percentage': percentage,
      'startDate': startDate.toIso8601String().split('T').first,
      'endDate': endDate.toIso8601String().split('T').first,
      'applicableCategories': applicableCategories,
      'active': active,
    };
  }

  DiscountModel copyWith({
    String? id,
    String? name,
    double? percentage,
    DateTime? startDate,
    DateTime? endDate,
    List<String>? applicableCategories,
    bool? active,
  }) {
    return DiscountModel(
      id: id ?? this.id,
      name: name ?? this.name,
      percentage: percentage ?? this.percentage,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      applicableCategories: applicableCategories ?? this.applicableCategories,
      active: active ?? this.active,
    );
  }
}