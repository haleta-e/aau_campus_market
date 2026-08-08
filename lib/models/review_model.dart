class ReviewModel {
  final String id;
  final String sellerId;
  final String studentName;
  final String comment;
  final double rating;
  final DateTime date;

  const ReviewModel({
    required this.id,
    required this.sellerId,
    required this.studentName,
    required this.comment,
    required this.rating,
    required this.date,
  });

  factory ReviewModel.fromJson(Map<String, dynamic> json) {
    return ReviewModel(
      id: json['id'] as String,
      sellerId: json['sellerId'] as String,
      studentName: json['studentName'] as String,
      comment: json['comment'] as String,
      rating: (json['rating'] as num).toDouble(),
      date: DateTime.parse(json['date'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'sellerId': sellerId,
      'studentName': studentName,
      'comment': comment,
      'rating': rating,
      'date': date.toIso8601String(),
    };
  }
}