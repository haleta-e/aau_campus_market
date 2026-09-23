import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../providers/seller_provider.dart';
import '../../providers/product_provider.dart';
import '../../providers/admin_provider.dart';
import '../../providers/order_provider.dart';
import '../../models/product_model.dart';
import '../../models/seller_model.dart';
import '../../models/order_model.dart';
import '../../services/complaint_service.dart';
import '../../models/complaint_model.dart';
import '../../utils/formatters.dart';

class AdminDashboardScreen extends ConsumerStatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  ConsumerState<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends ConsumerState<AdminDashboardScreen> {
  int _selectedTab = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AAU Admin Management Portal'),
        backgroundColor: Colors.blueGrey.shade900,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'Refresh All Data',
            onPressed: () {
              ref.read(adminAuthProvider.notifier).fetchStats();
              ref.read(productProvider.notifier).loadProducts();
              ref.read(orderProvider.notifier).loadOrders();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Refreshing admin portal data...'), duration: Duration(seconds: 1)),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Logout Admin',
            onPressed: () async {
              await ref.read(authProvider.notifier).logout();
            },
          ),
        ],
      ),
      body: IndexedStack(
        index: _selectedTab,
        children: [
          _buildOverviewTab(),
          _buildProductsTab(),
          _buildStudentsTab(),
          _buildSellersTab(),
          _buildOrdersTab(),
          _buildComplaintsTab(),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedTab,
        onDestinationSelected: (i) => setState(() => _selectedTab = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard_outlined), selectedIcon: Icon(Icons.dashboard), label: 'Overview'),
          NavigationDestination(icon: Icon(Icons.inventory_2_outlined), selectedIcon: Icon(Icons.inventory_2), label: 'Products'),
          NavigationDestination(icon: Icon(Icons.people_outline), selectedIcon: Icon(Icons.people), label: 'Students'),
          NavigationDestination(icon: Icon(Icons.storefront_outlined), selectedIcon: Icon(Icons.storefront), label: 'Sellers'),
          NavigationDestination(icon: Icon(Icons.receipt_long_outlined), selectedIcon: Icon(Icons.receipt_long), label: 'Orders'),
          NavigationDestination(icon: Icon(Icons.gavel_outlined), selectedIcon: Icon(Icons.gavel), label: 'Disputes'),
        ],
      ),
    );
  }

  // ==========================================
  // TAB 1: OVERVIEW METRICS
  // ==========================================
  Widget _buildOverviewTab() {
    final adminState = ref.watch(adminAuthProvider);
    final statsMap = adminState.stats;

    final revenue = statsMap != null && statsMap['total_revenue_etb'] != null
        ? 'ETB ${double.tryParse(statsMap['total_revenue_etb'].toString())?.toStringAsFixed(2) ?? statsMap['total_revenue_etb']}'
        : 'ETB 0.00';
    final totalOrders = statsMap != null && statsMap['total_orders'] != null ? statsMap['total_orders'] : ref.watch(orderProvider).orders.length;
    final totalUsers = statsMap != null && statsMap['total_users'] != null ? statsMap['total_users'] : 12;
    final sellersCount = ref.watch(sellerProvider).sellers.length;
    final productsCount = ref.watch(productProvider).products.length;

    final stats = [
      ('Total Revenue', revenue, Icons.payments, Colors.green, 4),
      ('Total Orders', '$totalOrders', Icons.shopping_bag, Colors.blue, 4),
      ('Active Sellers', '$sellersCount', Icons.store, Colors.purple, 3),
      ('Listed Products', '$productsCount', Icons.inventory_2, Colors.orange, 1),
      ('Total Students', '$totalUsers', Icons.people, Colors.teal, 2),
      ('Open Disputes', '0 Pending', Icons.gavel, Colors.redAccent, 5),
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.blue.shade50,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.blue.shade200),
            ),
            child: const Row(
              children: [
                Icon(Icons.verified_user, color: Colors.blue, size: 28),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('AAU Backend & Database Active', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                      Text('Connected on Port 4000 (Local & PostgreSQL API)', style: TextStyle(fontSize: 12, color: Colors.grey)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const Text('Marketplace Overview & Controls', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 1.2,
            children: stats.map((s) {
              return Card(
                elevation: 2,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: InkWell(
                  onTap: () => setState(() => _selectedTab = s.$5),
                  borderRadius: BorderRadius.circular(12),
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
                            fontSize: s.$2.startsWith('ETB') ? 15 : 20,
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
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // TAB 2: PRODUCTS MANAGEMENT (CRUD)
  // ==========================================
  Widget _buildProductsTab() {
    final products = ref.watch(productProvider).products;

    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddProductDialog(context),
        icon: const Icon(Icons.add),
        label: const Text('Add Product'),
        backgroundColor: const Color(0xFF2E7D32),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: products.length,
        itemBuilder: (context, i) {
          final p = products[i];
          return Card(
            child: ListTile(
              leading: Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(8)),
                child: p.isFromApi
                    ? Image.network(p.image, fit: BoxFit.cover)
                    : Image.asset(p.image, fit: BoxFit.cover, errorBuilder: (_, __, ___) => const Icon(Icons.image)),
              ),
              title: Text(p.name, style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text('${p.category} • ${Formatters.currency(p.price)} • Stock: ${p.stockQuantity}'),
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    icon: const Icon(Icons.edit, color: Colors.blue),
                    onPressed: () => _showEditProductDialog(context, p),
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete_outline, color: Colors.red),
                    onPressed: () => _deleteProduct(p.id),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  void _showAddProductDialog(BuildContext context) {
    final nameCtrl = TextEditingController();
    final priceCtrl = TextEditingController();
    final stockCtrl = TextEditingController(text: '10');
    final descCtrl = TextEditingController();
    final imageCtrl = TextEditingController(text: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500');
    String category = 'Electronics';

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Add New Product'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(controller: nameCtrl, decoration: const InputDecoration(labelText: 'Product Name')),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  initialValue: category,
                  decoration: const InputDecoration(labelText: 'Category'),
                  items: const [
                    DropdownMenuItem(value: 'Electronics', child: Text('Electronics')),
                    DropdownMenuItem(value: 'Books & Stationery', child: Text('Books & Stationery')),
                    DropdownMenuItem(value: 'Fashion', child: Text('Fashion')),
                    DropdownMenuItem(value: 'Dorm & Living', child: Text('Dorm & Living')),
                    DropdownMenuItem(value: 'Sports & Gear', child: Text('Sports & Gear')),
                  ],
                  onChanged: (v) => category = v!,
                ),
                const SizedBox(height: 8),
                TextField(controller: priceCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Price (ETB)')),
                const SizedBox(height: 8),
                TextField(controller: stockCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Stock Quantity')),
                const SizedBox(height: 8),
                TextField(
                  controller: imageCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Image URL or Asset Path',
                    hintText: 'https://... or assets/images/...',
                    prefixIcon: Icon(Icons.image_outlined),
                  ),
                  onChanged: (_) => setDialogState(() {}),
                ),
                const SizedBox(height: 8),
                // Live Image Preview Box
                if (imageCtrl.text.isNotEmpty)
                  Container(
                    height: 80,
                    width: 80,
                    margin: const EdgeInsets.only(top: 8),
                    decoration: BoxDecoration(color: Colors.grey.shade200, borderRadius: BorderRadius.circular(8)),
                    child: imageCtrl.text.startsWith('http')
                        ? Image.network(imageCtrl.text, fit: BoxFit.cover, errorBuilder: (_, __, ___) => const Icon(Icons.broken_image))
                        : Image.asset(imageCtrl.text, fit: BoxFit.cover, errorBuilder: (_, __, ___) => const Icon(Icons.broken_image)),
                  ),
                const SizedBox(height: 8),
                TextField(controller: descCtrl, decoration: const InputDecoration(labelText: 'Description')),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () async {
                if (nameCtrl.text.trim().isEmpty || priceCtrl.text.trim().isEmpty) return;
                final imgUrl = imageCtrl.text.trim().isNotEmpty ? imageCtrl.text.trim() : 'https://placehold.co/400x400/png?text=Product';
                final newProduct = ProductModel(
                  id: 'prod_${DateTime.now().millisecondsSinceEpoch}',
                  name: nameCtrl.text.trim(),
                  category: category,
                  description: descCtrl.text.trim(),
                  price: double.tryParse(priceCtrl.text) ?? 0.0,
                  image: imgUrl,
                  stockQuantity: int.tryParse(stockCtrl.text) ?? 10,
                  availableCampuses: const ['main_campus', '4_kilo', '5_kilo', '6_kilo', 'fbe', 'black_lion'],
                  sellerIds: const ['s1'],
                  discountId: null,
                  isAvailable: true,
                  source: ProductSource.local,
                );
                await ref.read(productProvider.notifier).createLocalProduct(newProduct);
                if (ctx.mounted) Navigator.pop(ctx);
              },
              child: const Text('Add Product'),
            ),
          ],
        ),
      ),
    );
  }

  void _showEditProductDialog(BuildContext context, ProductModel product) {
    final priceCtrl = TextEditingController(text: product.price.toString());
    final stockCtrl = TextEditingController(text: product.stockQuantity.toString());
    final imageCtrl = TextEditingController(text: product.image);

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: Text('Edit ${product.name}'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(controller: priceCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Price (ETB)')),
                const SizedBox(height: 12),
                TextField(controller: stockCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Stock Quantity')),
                const SizedBox(height: 12),
                TextField(
                  controller: imageCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Product Image URL / Path',
                    prefixIcon: Icon(Icons.image_outlined),
                  ),
                  onChanged: (_) => setDialogState(() {}),
                ),
                const SizedBox(height: 8),
                // Live Image Preview
                if (imageCtrl.text.isNotEmpty)
                  Container(
                    height: 80,
                    width: 80,
                    decoration: BoxDecoration(color: Colors.grey.shade200, borderRadius: BorderRadius.circular(8)),
                    child: imageCtrl.text.startsWith('http')
                        ? Image.network(imageCtrl.text, fit: BoxFit.cover, errorBuilder: (_, __, ___) => const Icon(Icons.broken_image))
                        : Image.asset(imageCtrl.text, fit: BoxFit.cover, errorBuilder: (_, __, ___) => const Icon(Icons.broken_image)),
                  ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () async {
                final updated = product.copyWith(
                  price: double.tryParse(priceCtrl.text) ?? product.price,
                  stockQuantity: int.tryParse(stockCtrl.text) ?? product.stockQuantity,
                  image: imageCtrl.text.trim().isNotEmpty ? imageCtrl.text.trim() : product.image,
                );
                await ref.read(productProvider.notifier).updateLocalProduct(updated);
                if (ctx.mounted) Navigator.pop(ctx);
              },
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    );
  }


  Future<void> _deleteProduct(String productId) async {
    await ref.read(productProvider.notifier).deleteLocalProduct(productId);
  }

  // ==========================================
  // TAB 3: STUDENTS MANAGEMENT
  // ==========================================
  Widget _buildStudentsTab() {
    final students = [
      ('Abebe Bikila', 'UGR/1024/15', 'Computer Science', 'Main Campus', 'abebe@aau.edu.et'),
      ('Tigist Assefa', 'UGR/2048/16', 'Business & Economics', 'FBE', 'tigist@aau.edu.et'),
      ('Dawit Yohannes', 'UGR/3096/14', 'Electrical Engineering', '5 Kilo', 'dawit@aau.edu.et'),
      ('Bethlehem Alemu', 'UGR/4012/15', 'Medicine', 'Black Lion', 'bethlehem@aau.edu.et'),
      ('Kaleb Tadesse', 'UGR/5050/16', 'Natural Sciences', '4 Kilo', 'kaleb@aau.edu.et'),
    ];

    return Scaffold(
      body: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: students.length,
        itemBuilder: (context, i) {
          final s = students[i];
          return Card(
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: Colors.teal.shade100,
                child: Text(s.$1[0], style: TextStyle(fontWeight: FontWeight.bold, color: Colors.teal.shade900)),
              ),
              title: Text(s.$1, style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text('${s.$2} • ${s.$3} (${s.$4})'),
              trailing: const Chip(
                label: Text('Registered Student', style: TextStyle(fontSize: 11, color: Colors.white)),
                backgroundColor: Color(0xFF2E7D32),
              ),
            ),
          );
        },
      ),
    );
  }

  // ==========================================
  // TAB 4: SELLERS MANAGEMENT (ADMIN SELLER TAB)
  // ==========================================
  Widget _buildSellersTab() {
    final sellers = ref.watch(sellerProvider).sellers;

    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddSellerDialog(context),
        icon: const Icon(Icons.add_business),
        label: const Text('Add Seller'),
        backgroundColor: Colors.purple.shade700,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: sellers.length,
        itemBuilder: (context, i) {
          final s = sellers[i];
          return Card(
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: Colors.purple.shade100,
                child: Icon(Icons.store, color: Colors.purple.shade800),
              ),
              title: Text(s.name, style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text('${s.department} • Phone: ${s.phone}'),
              trailing: Switch(
                value: s.active,
                activeThumbColor: Colors.purple,
                onChanged: (val) {
                  ref.read(sellerProvider.notifier).updateSeller(s.copyWith(active: val));
                },
              ),
            ),
          );
        },
      ),
    );
  }

  void _showAddSellerDialog(BuildContext context) {
    final nameCtrl = TextEditingController();
    final deptCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Add AAU Verified Seller'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: nameCtrl, decoration: const InputDecoration(labelText: 'Seller / Store Name')),
            const SizedBox(height: 8),
            TextField(controller: deptCtrl, decoration: const InputDecoration(labelText: 'Department / Campus')),
            const SizedBox(height: 8),
            TextField(controller: phoneCtrl, keyboardType: TextInputType.phone, decoration: const InputDecoration(labelText: 'Phone Number')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () async {
              if (nameCtrl.text.trim().isEmpty) return;
              final newSeller = SellerModel(
                id: 'seller_${DateTime.now().millisecondsSinceEpoch}',
                name: nameCtrl.text.trim(),
                studentId: 'UGR/0000/16',
                gender: 'M',
                department: deptCtrl.text.trim().isNotEmpty ? deptCtrl.text.trim() : 'AAU Campus Store',
                campusId: 'main_campus',
                phone: phoneCtrl.text.trim().isNotEmpty ? phoneCtrl.text.trim() : '+251 91 100 2030',
                image: 'assets/images/default_seller.png',
                active: true,
                rating: 4.8,
              );
              await ref.read(sellerProvider.notifier).createSeller(newSeller);
              if (ctx.mounted) Navigator.pop(ctx);
            },
            child: const Text('Save Seller'),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // TAB 5: ORDERS MONITORING
  // ==========================================
  Widget _buildOrdersTab() {
    final orders = ref.watch(orderProvider).orders;

    if (orders.isEmpty) {
      return const Center(child: Text('No orders placed yet in system.'));
    }

    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: orders.length,
      itemBuilder: (context, i) {
        final o = orders[i];
        return Card(
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: Colors.blue.shade100,
              child: Icon(Icons.receipt, color: Colors.blue.shade800),
            ),
            title: Text(o.orderId, style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text('${Formatters.date(o.orderDate)} • ${o.paymentMethod} • ${o.fulfillmentMethod}'),
            trailing: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(Formatters.currency(o.total), style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green)),
                const SizedBox(height: 4),
                Chip(
                  labelStyle: const TextStyle(fontSize: 10, color: Colors.white),
                  label: Text(o.status.name.toUpperCase()),
                  backgroundColor: o.status == OrderStatus.delivered ? Colors.green : Colors.orange,
                  padding: EdgeInsets.zero,
                  visualDensity: VisualDensity.compact,
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // ==========================================
  // TAB 6: DISPUTES & COMPLAINTS
  // ==========================================
  Widget _buildComplaintsTab() {
    return FutureBuilder<List<ComplaintModel>>(
      future: ref.watch(complaintServiceProvider).getComplaints(),
      builder: (context, snapshot) {
        if (!snapshot.hasData) return const Center(child: CircularProgressIndicator());
        final complaints = snapshot.data!;
        if (complaints.isEmpty) {
          return const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.check_circle_outline, size: 48, color: Colors.green),
                SizedBox(height: 8),
                Text('No open complaints or disputes!'),
              ],
            ),
          );
        }
        return ListView.builder(
          padding: const EdgeInsets.all(12),
          itemCount: complaints.length,
          itemBuilder: (context, i) {
            final c = complaints[i];
            return Card(
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: Colors.red.shade100,
                  child: Icon(Icons.gavel, color: Colors.red.shade800),
                ),
                title: Text('${c.issueType} (${c.orderId})', style: const TextStyle(fontWeight: FontWeight.bold)),
                subtitle: Text('Student: ${c.studentName}\nDescription: ${c.description}'),
                isThreeLine: true,
                trailing: ElevatedButton(
                  onPressed: c.status == 'RESOLVED'
                      ? null
                      : () async {
                          await ref.read(complaintServiceProvider).resolveComplaint(c.id, resolutionNote: 'Resolved by Admin');
                          setState(() {});
                        },
                  child: Text(c.status == 'RESOLVED' ? 'Resolved' : 'Resolve'),
                ),
              ),
            );
          },
        );
      },
    );
  }
}