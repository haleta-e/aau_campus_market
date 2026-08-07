import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/discount_model.dart';
import '../services/discount_service.dart';

class DiscountState {
  final bool isLoading;
  final List<DiscountModel> discounts;
  final String? errorMessage;

  const DiscountState({this.isLoading = false, this.discounts = const [], this.errorMessage});

  DiscountState copyWith({
    bool? isLoading,
    List<DiscountModel>? discounts,
    String? errorMessage,
    bool clearError = false,
  }) {
    return DiscountState(
      isLoading: isLoading ?? this.isLoading,
      discounts: discounts ?? this.discounts,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

class DiscountNotifier extends StateNotifier<DiscountState> {
  final DiscountService _service;

  DiscountNotifier(this._service) : super(const DiscountState()) {
    loadDiscounts();
  }

  Future<void> loadDiscounts() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final discounts = await _service.getDiscounts();
      state = state.copyWith(isLoading: false, discounts: discounts);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: 'Unable to load discounts.');
    }
  }

  Future<bool> createDiscount(DiscountModel discount) async {
    try {
      await _service.createDiscount(discount);
      await loadDiscounts();
      return true;
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
      return false;
    }
  }

  Future<bool> updateDiscount(DiscountModel discount) async {
    try {
      await _service.updateDiscount(discount);
      await loadDiscounts();
      return true;
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
      return false;
    }
  }

  Future<void> deleteDiscount(String discountId) async {
    await _service.deleteDiscount(discountId);
    await loadDiscounts();
  }
}

final discountProvider = StateNotifierProvider<DiscountNotifier, DiscountState>((ref) {
  return DiscountNotifier(ref.watch(discountServiceProvider));
});

final activeDiscountsProvider = Provider<List<DiscountModel>>((ref) {
  final discounts = ref.watch(discountProvider).discounts;
  return ref.watch(discountServiceProvider).getActiveDiscounts(discounts);
});