class Validators {
  static bool isValidStudentId(String value) {
    final regExp = RegExp(r'^UGR/\d{4}/\d{2}$');
    return regExp.hasMatch(value.trim());
  }

  static bool isValidPhone(String value) {
    return value.trim().length >= 10;
  }
}