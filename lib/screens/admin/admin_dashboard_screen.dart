import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../providers/campus_provider.dart';
import '../../providers/seller_provider.dart';
import '../../providers/product_provider.dart';
import '../../providers/admin_provider.dart';

class AdminDashboardScreen extends ConsumerWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final adminState = ref.watch(adminAuthProvider);
    final statsMap = adminState.stats;

    // Use live backend metrics if available, otherwise fallback to local providers
    final revenue = statsMap != null && statsMap['total_revenue_etb'] != null
        ? 'ETB ${double.tryParse(statsMap['total_revenue_etb'].toString())?.toStringAsFixed(2) ?? statsMap['total_revenue_etb']}'
        : 'ETB 0.00';

    final totalOrders = statsMap != null && statsMap['total_orders'] != null
        ? statsMap['total_orders']
        : 0;

    final totalUsers = statsMap != null && statsMap['total_users'] != null
        ? statsMap['total_users']
        : ref.watch(campusProvider).campuses.length;

    final sellers = statsMap != null && statsMap['total_sellers'] != null
        ? statsMap['total_sellers']
        : ref.watch(sellerProvider).sellers.length;

    final productsCount = statsMap != null && statsMap['total_products'] != null
        ? statsMap['total_products']
        : ref.watch(productProvider).products.length;

    final openDisputes = statsMap != null && statsMap['total_complaints'] != null
        ? statsMap['total_complaints']
        : 0;

    final stats = [
      ('Total Revenue', revenue, Icons.payments, Colors.green),
      ('Total Orders', '$totalOrders', Icons.shopping_bag, Colors.blue),
      ('Active Sellers', '$sellers', Icons.store, Colors.purple),
      ('Listed Products', '$productsCount', Icons.inventory_2, Colors.orange),
      ('Total Users', '$totalUsers', Icons.people, Colors.teal),
      ('Open Disputes', '$openDisputes', Icons.gavel, Colors.redAccent),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('AAU Admin Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'Refresh Live Metrics',
            onPressed: () {
              ref.read(adminAuthProvider.notifier).fetchStats();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Refreshing live metrics from AAU backend...'), duration: Duration(seconds: 1)),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
            onPressed: () async {
              await ref.read(authProvider.notifier).logout();
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primaryContainer.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.2)),
              ),
              child: Row(
                children: [
                  Icon(Icons.hub, color: Theme.of(context).colorScheme.primary, size: 28),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('AAU Backend Connected', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                        Text('Live synchronization with PostgreSQL database active.', style: TextStyle(fontSize: 12, color: Colors.grey)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            const Text('Marketplace Overview', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.25,
              children: stats.map((s) {
                return Card(
                  elevation: 2,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(s.$3, color: s.$4, size: 28),
                        const SizedBox(height: 6),
                        Text(
                          s.$2,
                          style: TextStyle(
                            fontSize: s.$2.startsWith('ETB') ? 16 : 22,
                            fontWeight: FontWeight.bold,
                            color: s.$4,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 4),
                        Text(s.$1, textAlign: TextAlign.center, style: const TextStyle(fontSize: 12, color: Colors.grey)),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }
}