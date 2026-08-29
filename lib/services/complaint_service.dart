import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../models/complaint_model.dart';
import 'api_service.dart';
import 'storage_service.dart';

class ComplaintService {
  final ApiService _apiService;
  final StorageService _storageService;
  static const _uuid = Uuid();
  static const String _complaintsBox = 'complaints_box';

  ComplaintService(this._apiService, this._storageService);

  Future<List<ComplaintModel>> getComplaints() async {
    // Read local complaints
    final raw = _storageService.getAll(_complaintsBox);
    final localList = raw.map((e) => ComplaintModel.fromJson(e)).toList();

    // Fetch live complaints from backend if reachable
    try {
      final backendComplaints = await _apiService.getAdminComplaints();
      for (final json in backendComplaints) {
        final complaint = ComplaintModel.fromJson(json);
        if (!localList.any((c) => c.id == complaint.id)) {
          localList.add(complaint);
        }
      }
    } catch (_) {}

    localList.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return localList;
  }

  Future<ComplaintModel> submitComplaint({
    required String orderId,
    required String studentId,
    required String studentName,
    required String issueType,
    required String description,
  }) async {
    final complaintId = 'CMP-${_uuid.v4().substring(0, 8).toUpperCase()}';
    final complaint = ComplaintModel(
      id: complaintId,
      orderId: orderId,
      studentId: studentId,
      studentName: studentName,
      issueType: issueType,
      description: description,
      status: 'PENDING',
      createdAt: DateTime.now(),
    );

    // Save locally
    await _storageService.putItem(_complaintsBox, complaint.id, complaint.toJson());
    return complaint;
  }

  Future<void> resolveComplaint(String complaintId, {required String resolutionNote}) async {
    final raw = _storageService.getAll(_complaintsBox);
    final match = raw.where((c) => c['id'] == complaintId).firstOrNull;
    if (match != null) {
      match['status'] = 'RESOLVED';
      await _storageService.putItem(_complaintsBox, complaintId, match);
    }
    try {
      await _apiService.resolveComplaint(complaintId, resolutionNote);
    } catch (_) {}
  }
}

final complaintServiceProvider = Provider<ComplaintService>((ref) {
  return ComplaintService(ref.watch(apiServiceProvider), ref.watch(storageServiceProvider));
});
