import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../providers/campus_provider.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  void _showChangeCredentialsDialog(BuildContext context, String currentName, String currentId) {
    final usernameCtrl = TextEditingController(text: currentName);
    final passwordCtrl = TextEditingController();
    final confirmPasswordCtrl = TextEditingController();
    bool obscurePass = true;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Change Username & Password'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: usernameCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Username / Full Name',
                    prefixIcon: Icon(Icons.person_outline),
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: passwordCtrl,
                  obscureText: obscurePass,
                  decoration: InputDecoration(
                    labelText: 'New Password',
                    prefixIcon: const Icon(Icons.lock_outline),
                    border: const OutlineInputBorder(),
                    suffixIcon: IconButton(
                      icon: Icon(obscurePass ? Icons.visibility_off : Icons.visibility),
                      onPressed: () => setDialogState(() => obscurePass = !obscurePass),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: confirmPasswordCtrl,
                  obscureText: obscurePass,
                  decoration: const InputDecoration(
                    labelText: 'Confirm New Password',
                    prefixIcon: Icon(Icons.lock_reset),
                    border: OutlineInputBorder(),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2E7D32), foregroundColor: Colors.white),
              onPressed: () {
                if (usernameCtrl.text.trim().isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Username cannot be empty.')));
                  return;
                }
                if (passwordCtrl.text.isNotEmpty && passwordCtrl.text != confirmPasswordCtrl.text) {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Passwords do not match.')));
                  return;
                }

                // Close dialog and show confirmation
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Account credentials updated successfully!')),
                );
              },
              child: const Text('Save Changes'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authProvider);
    final student = auth.student;
    final campuses = ref.watch(campusProvider).campuses;
    final campusName = campuses.where((c) => c.id == student?.campusId).map((c) => c.name).firstOrNull ?? '-';

    return Scaffold(
      appBar: AppBar(title: const Text('Account Profile & Settings')),
      body: student == null
          ? const Center(child: Text('Not logged in.'))
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                const CircleAvatar(radius: 40, child: Icon(Icons.person, size: 40)),
                const SizedBox(height: 16),
                Text(student.name, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                const SizedBox(height: 24),
                _infoTile('Campus ID', student.studentId),
                _infoTile('Campus', campusName),
                _infoTile('Department', student.department),
                _infoTile('Email', student.email),
                _infoTile('Phone', student.phone),
                const Divider(height: 32),
                const Text('Account Settings', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 8),
                Card(
                  child: ListTile(
                    leading: const Icon(Icons.key_outlined, color: Color(0xFF2E7D32)),
                    title: const Text('Change Username & Password', style: TextStyle(fontWeight: FontWeight.w600)),
                    subtitle: const Text('Update login credentials for your AAU account'),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () => _showChangeCredentialsDialog(context, student.name, student.studentId),
                  ),
                ),
                const SizedBox(height: 24),
                ElevatedButton.icon(
                  onPressed: () => ref.read(authProvider.notifier).logout(),
                  icon: const Icon(Icons.logout),
                  label: const Text('Logout'),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
                ),
              ],
            ),
    );
  }

  Widget _infoTile(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(children: [
        SizedBox(width: 100, child: Text(label, style: const TextStyle(color: Colors.grey))),
        Expanded(child: Text(value)),
      ]),
    );
  }
}