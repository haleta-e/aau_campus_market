import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/campus_provider.dart';
import '../../providers/seller_provider.dart';
import '../../providers/product_provider.dart';
import '../../providers/discount_provider.dart';
import '../../providers/admin_provider.dart';

class AdminDashboardScreen extends ConsumerWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final campuses = ref.watch(campusProvider).campuses.length;
    final sellers = ref.watch(sellerProvider).sellers.length;
    final localProducts = ref.watch(productProvider).products.where((p) => p.isLocal).length;
    final activeDiscounts = ref.watch(activeDiscountsProvider).length;

    final stats = [
      ('Total Campuses', campuses),
      ('Total Sellers', sellers),
      ('Total Local Products', localProducts),
      ('Active Discounts', activeDiscounts),
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('Admin Dashboard'), actions: [
        IconButton(
          icon: const Icon(Icons.logout),
          onPressed: () async {
            await ref.read(adminAuthProvider.notifier).logout();
            if (context.mounted) Navigator.pop(context);
          },
        ),
      ]),
      body: GridView.count(
        padding: const EdgeInsets.all(16),
        crossAxisCount: 2,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 1.3,
        children: stats.map((s) {
          return Card(
            child: Center(
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                Text('${s.$2}', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                Text(s.$1, textAlign: TextAlign.center),
              ]),
            ),
          );
        }).toList(),
      ),
    );
  }
}