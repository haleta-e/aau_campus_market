import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/campus_model.dart';
import '../services/campus_service.dart';
import '../services/storage_service.dart';

class CampusState {
  final bool isLoading;
  final List<CampusModel> campuses;
  final String? errorMessage;

  const CampusState({this.isLoading = false, this.campuses = const [], this.errorMessage});

  CampusState copyWith({
    bool? isLoading,
    List<CampusModel>? campuses,
    String? errorMessage,
    bool clearError = false,
  }) {
    return CampusState(
      isLoading: isLoading ?? this.isLoading,
      campuses: campuses ?? this.campuses,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

class CampusNotifier extends StateNotifier<CampusState> {
  final CampusService _service;

  CampusNotifier(this._service) : super(const CampusState()) {
    loadCampuses();
  }

  Future<void> loadCampuses() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final campuses = await _service.getCampuses();
      state = state.copyWith(isLoading: false, campuses: campuses);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: 'Unable to load campuses.');
    }
  }

  Future<bool> createCampus(CampusModel campus) async {
    try {
      await _service.createCampus(campus, state.campuses);
      await loadCampuses();
      return true;
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
      return false;
    }
  }

  Future<bool> updateCampus(CampusModel campus) async {
    try {
      await _service.updateCampus(campus, state.campuses);
      await loadCampuses();
      return true;
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
      return false;
    }
  }

  Future<void> deleteCampus(String campusId) async {
    await _service.deleteCampus(campusId);
    await loadCampuses();
  }
}

final campusProvider = StateNotifierProvider<CampusNotifier, CampusState>((ref) {
  return CampusNotifier(ref.watch(campusServiceProvider));
});

/// Currently selected campus — drives product filtering app-wide.
class SelectedCampusNotifier extends StateNotifier<String?> {
  final StorageService _storageService;

  SelectedCampusNotifier(this._storageService) : super(null) {
    _restore();
  }

  Future<void> _restore() async {
    state = await _storageService.getSelectedCampus();
  }

  Future<void> select(String campusId) async {
    state = campusId;
    await _storageService.saveSelectedCampus(campusId);
  }
}

final selectedCampusProvider = StateNotifierProvider<SelectedCampusNotifier, String?>((ref) {
  return SelectedCampusNotifier(ref.watch(storageServiceProvider));
});