import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../providers/campus_provider.dart';
import '../admin/admin_login_screen.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});
  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _idController = TextEditingController();
  final _passwordController = TextEditingController();
  String? _selectedCampusId;
  bool _obscure = true;

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authProvider);
    final campusState = ref.watch(campusProvider);

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            const SizedBox(height: 40),
            GestureDetector(
              onLongPress: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminLoginScreen())),
              child: Column(children: [
                const Icon(Icons.storefront, size: 64, color: Color(0xFF2E7D32)),
                const SizedBox(height: 8),
                const Text('AAU Campus Market', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                const Text('Your Campus Marketplace', style: TextStyle(color: Colors.grey)),
              ]),
            ),
            const SizedBox(height: 32),
            TextField(
              controller: _idController,
              decoration: const InputDecoration(labelText: 'Campus ID', hintText: 'UGR/1234/24', prefixIcon: Icon(Icons.badge_outlined)),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _passwordController,
              obscureText: _obscure,
              decoration: InputDecoration(
                labelText: 'Password',
                prefixIcon: const Icon(Icons.lock_outline),
                suffixIcon: IconButton(
                  icon: Icon(_obscure ? Icons.visibility_off : Icons.visibility),
                  onPressed: () => setState(() => _obscure = !_obscure),
                ),
              ),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _selectedCampusId,
              decoration: const InputDecoration(labelText: 'Campus', prefixIcon: Icon(Icons.location_on_outlined)),
              items: campusState.campuses
                  .map((c) => DropdownMenuItem(value: c.id, child: Text(c.name)))
                  .toList(),
              onChanged: (v) => setState(() => _selectedCampusId = v),
            ),
            if (auth.errorMessage != null) ...[
              const SizedBox(height: 12),
              Text(auth.errorMessage!, style: const TextStyle(color: Colors.red)),
            ],
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: auth.isLoading
                  ? null
                  : () async {
                      if (_selectedCampusId == null) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Please select your campus.')),
                        );
                        return;
                      }
                      await ref.read(authProvider.notifier).login(
                            campusId: _idController.text,
                            password: _passwordController.text,
                            selectedCampusId: _selectedCampusId!,
                          );
                    },
              child: auth.isLoading
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                  : const Text('Login'),
            ),
            const SizedBox(height: 8),
            const Text('Demo password: aau@123', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey, fontSize: 12)),
          ]),
        ),
      ),
    );
  }
}
