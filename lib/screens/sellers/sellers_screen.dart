import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/seller_provider.dart';
import '../../providers/campus_provider.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/error_state.dart';
import '../../widgets/empty_state.dart';
import 'seller_details_screen.dart';

class SellersScreen extends ConsumerWidget {
  const SellersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(sellerProvider);
    final campuses = ref.watch(campusProvider).campuses;

    return Scaffold(
      appBar: AppBar(title: const Text('Sellers')),
      body: state.isLoading
          ? const LoadingWidget()
          : state.errorMessage != null
              ? ErrorState(message: state.errorMessage!, onRetry: () => ref.read(sellerProvider.notifier).loadSellers())
              : state.sellers.isEmpty
                  ? const EmptyState(message: 'No sellers found.', icon: Icons.people_outline)
                  : ListView.builder(
                      padding: const EdgeInsets.all(12),
                      itemCount: state.sellers.length,
                      itemBuilder: (context, i) {
                        final seller = state.sellers[i];
                        final campusName =
                            campuses.where((c) => c.id == seller.campusId).map((c) => c.name).firstOrNull ?? '';
                        return Card(
                          child: ListTile(
                            leading: CircleAvatar(backgroundImage: NetworkImage(seller.image)),
                            title: Text(seller.name),
                            subtitle: Text('${seller.department} • $campusName'),
                            trailing: Row(mainAxisSize: MainAxisSize.min, children: [
                              const Icon(Icons.star, size: 16, color: Colors.amber),
                              Text('${seller.rating}'),
                              if (!seller.active) ...[
                                const SizedBox(width: 8),
                                const Icon(Icons.circle, size: 8, color: Colors.grey),
                              ],
                            ]),
                            onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => SellerDetailsScreen(sellerId: seller.id)),
                            ),
                          ),
                        );
                      },
                    ),
    );
  }
}