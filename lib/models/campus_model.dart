class CampusModel {
  final String id;
  final String name;
  final String code;
  final String description;
  final String academicFocus;
  final bool deliveryAvailable;

  const CampusModel({
    required this.id,
    required this.name,
    required this.code,
    required this.description,
    required this.academicFocus,
    required this.deliveryAvailable,
  });

  factory CampusModel.fromJson(Map<String, dynamic> json) {
    return CampusModel(
      id: json['id'] as String,
      name: json['name'] as String,
      code: json['code'] as String,
      description: json['description'] as String,
      academicFocus: json['academicFocus'] as String,
      deliveryAvailable: json['deliveryAvailable'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'code': code,
      'description': description,
      'academicFocus': academicFocus,
      'deliveryAvailable': deliveryAvailable,
    };
  }

  CampusModel copyWith({
    String? id,
    String? name,
    String? code,
    String? description,
    String? academicFocus,
    bool? deliveryAvailable,
  }) {
    return CampusModel(
      id: id ?? this.id,
      name: name ?? this.name,
      code: code ?? this.code,
      description: description ?? this.description,
      academicFocus: academicFocus ?? this.academicFocus,
      deliveryAvailable: deliveryAvailable ?? this.deliveryAvailable,
    );
  }
}