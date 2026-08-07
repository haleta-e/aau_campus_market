import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/admin_provider.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({Key? key}) : super(key: key);

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  int _selectedTab = 0;

  @override
  Widget build(BuildContext context) {
    final adminProvider = Provider.of<AdminProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: const [
            Icon(Icons.admin_panel_settings, color: Colors.amber),
            SizedBox(width: 8),
            Text('AAU Admin Portal', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        backgroundColor: const Color(0xFF0F172A),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              adminProvider.logoutAdmin();
              Navigator.pop(context);
            },
          ),
        ],
      ),
      body: Row(
        children: [
          // Navigation Drawer/Sidebar
          NavigationRail(
            selectedIndex: _selectedTab,
            onDestinationSelected: (int index) {
              setState(() {
                _selectedTab = index;
              });
            },
            labelType: NavigationRailLabelType.all,
            destinations: const [
              NavigationRailDestination(
                icon: Icon(Icons.dashboard_outlined),
                selectedIcon: Icon(Icons.dashboard, color: Colors.amber),
                label: Text('Overview'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.store_outlined),
                selectedIcon: Icon(Icons.store, color: Colors.amber),
                label: Text('Sellers'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.inventory_2_outlined),
                selectedIcon: Icon(Icons.inventory_2, color: Colors.amber),
                label: Text('Stock'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.local_offer_outlined),
                selectedIcon: Icon(Icons.local_offer, color: Colors.amber),
                label: Text('Promos'),
              ),
            ],
          ),

          const VerticalDivider(thickness: 1, width: 1),

          // Main Tab Content
          Expanded(
            child: IndexedStack(
              index: _selectedTab,
              children: [
                _buildOverviewTab(),
                _buildSellersTab(adminProvider),
                _buildStockTab(adminProvider),
                _buildPromosTab(adminProvider),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOverviewTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('AAU Campus System Analytics', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          Wrap(
            spacing: 16,
            runSpacing: 16,
            children: [
              _buildMetricCard('Total Campuses', '6', Icons.school, Colors.blue),
              _buildMetricCard('Verified Sellers', '24', Icons.verified_user, Colors.green),
              _buildMetricCard('Campus Products', '148', Icons.shopping_bag, Colors.amber),
              _buildMetricCard('Active Promos', '2', Icons.card_giftcard, Colors.purple),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSellersTab(AdminProvider admin) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text('Student Vendor Verification', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        Card(
          child: ListTile(
            leading: const CircleAvatar(child: Text('4K')),
            title: const Text('Abel Science & Tech Corner (4 Kilo)'),
            subtitle: const Text('Verified CS Student • ID: UGR/1029/14'),
            trailing: ElevatedButton(
              onPressed: () {},
              child: const Text('Verified Student'),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildStockTab(AdminProvider admin) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: const [
        Text('Inventory & Stock Manager', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        SizedBox(height: 12),
        Text('Casio Scientific Calculator FX-991EX — Stock: 25'),
        Text('Sun Chips Paprika — Stock: 120'),
      ],
    );
  }

  Widget _buildPromosTab(AdminProvider admin) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: const [
        Text('Academic Promo Code Manager', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        SizedBox(height: 12),
        Card(
          child: ListTile(
            title: Text('HOLIDAY15 — 15% OFF'),
            subtitle: Text('Semester Final Exams Prep Discount'),
          ),
        ),
      ],
    );
  }

  Widget _buildMetricCard(String title, String value, IconData icon, Color color) {
    return Container(
      width: 180,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          Text(title, style: const TextStyle(color: Colors.grey, fontSize: 12)),
        ],
      ),
    );
  }
}
