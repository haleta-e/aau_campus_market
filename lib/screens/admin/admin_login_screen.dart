import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/admin_provider.dart';
import 'admin_dashboard_screen.dart';

class AdminLoginScreen extends ConsumerStatefulWidget {
  const AdminLoginScreen({super.key});
  @override
  ConsumerState<AdminLoginScreen> createState() => _AdminLoginScreenState();
}

class _AdminLoginScreenState extends ConsumerState<AdminLoginScreen> {
  final _user = TextEditingController(text: 'admin@aau.edu.et');
  final _pass = TextEditingController(text: 'Admin@123456');

  @override
  Widget build(BuildContext context) {
    final admin = ref.watch(adminAuthProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Admin Access')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          const Icon(Icons.admin_panel_settings, size: 64, color: Colors.blueAccent),
          const SizedBox(height: 16),
          const Text(
            'AAU Marketplace Administration',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          const Text(
            'Authenticate with your AAU administrator credentials to inspect platform operations.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 13, color: Colors.grey),
          ),
          const SizedBox(height: 24),
          TextField(
            controller: _user,
            decoration: const InputDecoration(
              labelText: 'Admin Email or Username',
              prefixIcon: Icon(Icons.email_outlined),
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _pass,
            obscureText: true,
            decoration: const InputDecoration(
              labelText: 'Admin Password',
              prefixIcon: Icon(Icons.lock_outline),
              border: OutlineInputBorder(),
            ),
          ),
          if (admin.errorMessage != null) ...[
            const SizedBox(height: 12),
            Text(admin.errorMessage!, style: const TextStyle(color: Colors.red, fontSize: 13)),
          ],
          const SizedBox(height: 24),
          ElevatedButton(
            style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
            onPressed: () async {
              final ok = await ref.read(adminAuthProvider.notifier).login(_user.text, _pass.text);
              if (ok && context.mounted) {
                Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const AdminDashboardScreen()));
              }
            },
            child: const Text('Login as Admin', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.grey.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Default Admin Credentials:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                SizedBox(height: 4),
                Text('Email: admin@aau.edu.et\nPassword: Admin@123456', style: TextStyle(fontSize: 12, color: Colors.grey)),
              ],
            ),
          ),
        ]),
      ),
    );
  }
}