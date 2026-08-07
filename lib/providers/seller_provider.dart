import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/seller_model.dart';
import '../services/seller_service.dart';

class SellerState {
  final bool isLoading;
  final List<SellerModel> sellers;
  final String? errorMessage;

  const SellerState({this.isLoading = false, this.sellers = const [], this.errorMessage});

  SellerState copyWith({
    bool? isLoading,
    List<SellerModel>? sellers,
    String? errorMessage,
    bool clearError = false,
  }) {
    return SellerState(
      isLoading: isLoading ?? this.isLoading,
      sellers: sellers ?? this.sellers,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

class SellerNotifier extends StateNotifier<SellerState> {
  final SellerService _service;

  SellerNotifier(this._service) : super(const SellerState()) {
    loadSellers();
  }

  Future<void> loadSellers() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final sellers = await _service.getSellers();
      state = state.copyWith(isLoading: false, sellers: sellers);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: 'Unable to load sellers.');
    }
  }

  Future<bool> createSeller(SellerModel seller) async {
    try {
      await _service.createSeller(seller);
      await loadSellers();
      return true;
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
      return false;
    }
  }

  Future<bool> updateSeller(SellerModel seller) async {
    try {
      await _service.updateSeller(seller);
      await loadSellers();
      return true;
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
      return false;
    }
  }

  Future<void> deleteSeller(String sellerId) async {
    await _service.deleteSeller(sellerId);
    await loadSellers();
  }
}

final sellerProvider = StateNotifierProvider<SellerNotifier, SellerState>((ref) {
  return SellerNotifier(ref.watch(sellerServiceProvider));
});