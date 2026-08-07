class StudentModel {
  final String studentId;
  final String name;
  final String department;
  final String campusId;
  final String email;
  final String phone;
  final String apiUsername;
  final String apiPassword;

  const StudentModel({
    required this.studentId,
    required this.name,
    required this.department,
    required this.campusId,
    required this.email,
    required this.phone,
    required this.apiUsername,
    required this.apiPassword,
  });

  factory StudentModel.fromJson(Map<String, dynamic> json) {
    return StudentModel(
      studentId: json['studentId'] as String,
      name: json['name'] as String,
      department: json['department'] as String,
      campusId: json['campusId'] as String,
      email: json['email'] as String,
      phone: json['phone'] as String,
      apiUsername: json['apiUsername'] as String,
      apiPassword: json['apiPassword'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'studentId': studentId,
      'name': name,
      'department': department,
      'campusId': campusId,
      'email': email,
      'phone': phone,
      'apiUsername': apiUsername,
      'apiPassword': apiPassword,
    };
  }

  /// Used for the logged-in session snapshot (no password included).
  Map<String, dynamic> toPublicJson() {
    return {
      'studentId': studentId,
      'name': name,
      'department': department,
      'campusId': campusId,
      'email': email,
      'phone': phone,
    };
  }
}