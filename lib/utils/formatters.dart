class Formatters {
  static String currency(double amount) => '${amount.toStringAsFixed(2)} Birr';
  static String date(DateTime d) => '${d.day}/${d.month}/${d.year}';
}