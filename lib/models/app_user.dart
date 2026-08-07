class AppUser {
  final String id;
  final String name;
  final String email;
  final String role; // 'student' | 'seller' | 'admin'
  final String campus;

  AppUser({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.campus,
  });
}
