import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../models/review_model.dart';
import '../services/storage_service.dart';

class ReviewService {
  final StorageService _storageService;
  ReviewService(this._storageService);

  static const _uuid = Uuid();

  List<ReviewModel> getReviewsForSeller(String sellerId) {
    final raw = _storageService.getAll(StorageService.reviewsBox);
    final reviews = raw.map((e) => ReviewModel.fromJson(e)).where((r) => r.sellerId == sellerId).toList();
    reviews.sort((a, b) => b.date.compareTo(a.date));
    return reviews;
  }

  Future<void> addReview({
    required String sellerId,
    required String studentName,
    required String comment,
    required double rating,
  }) async {
    final review = ReviewModel(
      id: _uuid.v4(),
      sellerId: sellerId,
      studentName: studentName,
      comment: comment,
      rating: rating,
      date: DateTime.now(),
    );
    await _storageService.putItem(StorageService.reviewsBox, review.id, review.toJson());
  }
}

final reviewServiceProvider = Provider<ReviewService>((ref) {
  return ReviewService(ref.watch(storageServiceProvider));
});