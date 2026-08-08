class AppConstants {
  static const String appName = 'AAU Campus Market';
  static const String tagline = 'Your Campus Marketplace';
  static const List<String> paymentMethods = ['Cash', 'Telebirr', 'CBE Birr', 'Pay on Delivery'];
  static const List<String> categories = [
    'Electronics', 'Fashion', 'Accessories', 'Stationery', 'Snacks', 'Drinks', 'Detergent', 'Sanitary'
  ];
  /// Flat delivery fee applied to every delivery order, regardless of campus.
  static const double deliveryFee = 20.0;

  /// Fake Store API electronics that are impractical for a student (e.g.
  /// oversized TVs/monitors). Titles containing any of these (case-insensitive)
  /// are hidden from the marketplace. Add more keywords here anytime.
  static const List<String> excludedApiKeywords = [
    '49-inch',
    'curved gaming monitor',
  ];
}
