class Formatters {
  static String formatCurrencyETB(double amount) {
    return '${amount.toStringAsFixed(0)} ETB';
  }

  static String formatPhone(String phone) {
    if (!phone.startsWith('+251')) {
      return '+251 $phone';
    }
    return phone;
  }
}