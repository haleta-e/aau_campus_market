import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../providers/campus_provider.dart';

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
  void dispose() {
    _idController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authProvider);
    final campusState = ref.watch(campusProvider);

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            const SizedBox(height: 20),
            // Logo + title
            Column(children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF2E7D32).withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.storefront, size: 56, color: Color(0xFF2E7D32)),
              ),
              const SizedBox(height: 12),
              const Text(
                'AAU Campus Market',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              const Text(
                'Login with your AAU account',
                style: TextStyle(color: Colors.grey, fontSize: 14),
              ),
            ]),
            const SizedBox(height: 36),

            // Email or Campus ID field
            TextField(
              controller: _idController,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                labelText: 'Email or Campus ID',
                hintText: 'buyer01@aau.edu.et  or  UGR/1234/24',
                prefixIcon: Icon(Icons.badge_outlined),
              ),
            ),
            const SizedBox(height: 16),

            // Password
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

            // Campus dropdown
            DropdownButtonFormField<String>(
              value: _selectedCampusId,
              decoration: const InputDecoration(
                labelText: 'Campus',
                prefixIcon: Icon(Icons.location_on_outlined),
              ),
              items: campusState.campuses
                  .map((c) => DropdownMenuItem(value: c.id, child: Text(c.name)))
                  .toList(),
              onChanged: (v) => setState(() => _selectedCampusId = v),
            ),

            // Error
            if (auth.errorMessage != null) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.red.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  auth.errorMessage!,
                  style: const TextStyle(color: Colors.red, fontSize: 13),
                ),
              ),
            ],
            const SizedBox(height: 24),

            // Login button
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
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  : const Text('Login', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 24),

            // Demo credentials hint card
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.grey.withValues(alpha: 0.07),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.grey.withValues(alpha: 0.2)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'Demo Accounts (AAU Backend)',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                  SizedBox(height: 8),
                  _DemoRow(label: 'Admin', email: 'admin@aau.edu.et', password: 'Admin@123456'),
                  _DemoRow(label: 'Seller', email: 'seller01@aau.edu.et', password: 'Seller@123456'),
                  _DemoRow(label: 'Buyer', email: 'buyer01@aau.edu.et', password: 'Buyer@123456'),
                  Divider(height: 16),
                  Text(
                    'Local Demo (Campus ID)',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Any Campus ID from students.json + password: aau@123',
                    style: TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ],
              ),
            ),
          ]),
        ),
      ),
    );
  }
}

class _DemoRow extends StatelessWidget {
  final String label;
  final String email;
  final String password;

  const _DemoRow({required this.label, required this.email, required this.password});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(children: [
        SizedBox(
          width: 48,
          child: Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.grey)),
        ),
        Expanded(
          child: Text(
            '$email  /  $password',
            style: const TextStyle(fontSize: 11, color: Colors.grey),
          ),
        ),
      ]),
    );
  }
}
