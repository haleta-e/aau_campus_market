import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/review_model.dart';
import '../services/review_service.dart';

/// Bumped after every submitted review to force sellerReviewsProvider
/// to re-read from storage (ReviewService has no StateNotifier of its
/// own — it reads Hive directly — so this refresh token stands in for
/// that missing reactivity).
final reviewRefreshProvider = StateProvider<int>((ref) => 0);

final sellerReviewsProvider = Provider.family<List<ReviewModel>, String>((ref, sellerId) {
  ref.watch(reviewRefreshProvider);
  return ref.watch(reviewServiceProvider).getReviewsForSeller(sellerId);
});

class ReviewSubmitNotifier extends StateNotifier<bool> {
  final Ref ref;
  ReviewSubmitNotifier(this.ref) : super(false);

  Future<void> submit({
    required String sellerId,
    required String studentName,
    required String comment,
    required double rating,
  }) async {
    state = true;
    await ref.read(reviewServiceProvider).addReview(
          sellerId: sellerId,
          studentName: studentName,
          comment: comment,
          rating: rating,
        );
    ref.read(reviewRefreshProvider.notifier).state++;
    state = false;
  }
}

final reviewSubmitProvider = StateNotifierProvider<ReviewSubmitNotifier, bool>((ref) {
  return ReviewSubmitNotifier(ref);
});