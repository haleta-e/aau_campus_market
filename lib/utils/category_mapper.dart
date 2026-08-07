class CategoryMapper {
  static String mapToDisplay(String category) {
    switch (category.toLowerCase()) {
      case 'snacks':
        return '🍿 Snacks & Refreshments';
      case 'drinks':
        return '🥤 Cold Drinks & Water';
      case 'stationery':
        return '📝 Exam & Class Stationery';
      case 'sanitary':
        return '🧼 Personal Care & Hygiene';
      case 'detergent':
        return '🧺 Laundry & Dorm Cleaning';
      case 'fashion':
        return '👕 AAU Apparel & Merch';
      default:
        return '📦 Campus Goods';
    }
  }
}