class Student {
  final String id;
  final String name;
  final String studentIdNumber;
  final String campus;
  final String department;
  final String dormBlock;
  final String dormRoom;
  final String phone;
  final bool isVerified;

  Student({
    required this.id,
    required this.name,
    required this.studentIdNumber,
    required this.campus,
    required this.department,
    required this.dormBlock,
    required this.dormRoom,
    required this.phone,
    required this.isVerified,
  });

  factory Student.fromJson(Map<String, dynamic> json) {
    return Student(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      studentIdNumber: json['studentIdNumber'] ?? '',
      campus: json['campus'] ?? '4 Kilo',
      department: json['department'] ?? '',
      dormBlock: json['dormBlock'] ?? '',
      dormRoom: json['dormRoom'] ?? '',
      phone: json['phone'] ?? '',
      isVerified: json['isVerified'] ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'studentIdNumber': studentIdNumber,
    'campus': campus,
    'department': department,
    'dormBlock': dormBlock,
    'dormRoom': dormRoom,
    'phone': phone,
    'isVerified': isVerified,
  };
}