class SellerModel {
  final String id;
  final String name;
  final String studentId;
  final String gender;
  final String department;
  final String campusId;
  final String phone;
  final String image;
  final double rating;
  final bool active;

  const SellerModel({
    required this.id,
    required this.name,
    required this.studentId,
    required this.gender,
    required this.department,
    required this.campusId,
    required this.phone,
    required this.image,
    required this.rating,
    required this.active,
  });

  factory SellerModel.fromJson(Map<String, dynamic> json) {
    return SellerModel(
      id: json['id'] as String,
      name: json['name'] as String,
      studentId: json['studentId'] as String,
      gender: json['gender'] as String,
      department: json['department'] as String,
      campusId: json['campusId'] as String,
      phone: json['phone'] as String,
      image: json['image'] as String,
      rating: (json['rating'] as num).toDouble(),
      active: json['active'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'studentId': studentId,
      'gender': gender,
      'department': department,
      'campusId': campusId,
      'phone': phone,
      'image': image,
      'rating': rating,
      'active': active,
    };
  }

  SellerModel copyWith({
    String? id,
    String? name,
    String? studentId,
    String? gender,
    String? department,
    String? campusId,
    String? phone,
    String? image,
    double? rating,
    bool? active,
  }) {
    return SellerModel(
      id: id ?? this.id,
      name: name ?? this.name,
      studentId: studentId ?? this.studentId,
      gender: gender ?? this.gender,
      department: department ?? this.department,
      campusId: campusId ?? this.campusId,
      phone: phone ?? this.phone,
      image: image ?? this.image,
      rating: rating ?? this.rating,
      active: active ?? this.active,
    );
  }
}