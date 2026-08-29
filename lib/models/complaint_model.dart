class ComplaintModel {
  final String id;
  final String orderId;
  final String studentId;
  final String studentName;
  final String issueType; // 'Improper Product' or 'Delivery Issue'
  final String description;
  final String status; // 'PENDING', 'RESOLVED', 'REJECTED'
  final DateTime createdAt;

  ComplaintModel({
    required this.id,
    required this.orderId,
    required this.studentId,
    required this.studentName,
    required this.issueType,
    required this.description,
    this.status = 'PENDING',
    required this.createdAt,
  });

  factory ComplaintModel.fromJson(Map<String, dynamic> json) {
    return ComplaintModel(
      id: json['id'] as String? ?? '',
      orderId: json['order_id'] as String? ?? json['orderId'] as String? ?? '',
      studentId: json['student_id'] as String? ?? json['studentId'] as String? ?? '',
      studentName: json['student_name'] as String? ?? json['studentName'] as String? ?? 'AAU Student',
      issueType: json['issue_type'] as String? ?? json['issueType'] as String? ?? 'Improper Product',
      description: json['description'] as String? ?? '',
      status: json['status'] as String? ?? 'PENDING',
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'order_id': orderId,
      'student_id': studentId,
      'student_name': studentName,
      'issue_type': issueType,
      'description': description,
      'status': status,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
