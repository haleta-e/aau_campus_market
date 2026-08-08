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
  final _user = TextEditingController();
  final _pass = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final admin = ref.watch(adminAuthProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Admin Access')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          TextField(controller: _user, decoration: const InputDecoration(labelText: 'Admin Username')),
          const SizedBox(height: 12),
          TextField(controller: _pass, obscureText: true, decoration: const InputDecoration(labelText: 'Admin Password')),
          if (admin.errorMessage != null) ...[
            const SizedBox(height: 8),
            Text(admin.errorMessage!, style: const TextStyle(color: Colors.red)),
          ],
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () async {
              final ok = await ref.read(adminAuthProvider.notifier).login(_user.text, _pass.text);
              if (ok && context.mounted) {
                Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const AdminDashboardScreen()));
              }
            },
            child: const Text('Login as Admin'),
          ),
        ]),
      ),
    );
  }
}