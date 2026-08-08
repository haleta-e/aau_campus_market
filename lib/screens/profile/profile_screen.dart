import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../providers/campus_provider.dart';
import '../../services/api_service.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider);
    final student = auth.student;
    final campuses = ref.watch(campusProvider).campuses;
    final campusName = campuses.where((c) => c.id == student?.campusId).map((c) => c.name).firstOrNull ?? '-';

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: student == null
          ? const Center(child: Text('Not logged in.'))
          : FutureBuilder<List<Map<String, dynamic>>>(
              future: ref.read(apiServiceProvider).getUsers(),
              builder: (context, snapshot) {
                final apiUser = snapshot.data?.where((u) => u['username'] == 'mor_2314').firstOrNull;
                return ListView(
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
                    if (apiUser != null) ...[
                      const Divider(height: 32),
                      const Text('Marketplace Account', style: TextStyle(fontWeight: FontWeight.bold)),
                      _infoTile('Username', apiUser['username']?.toString() ?? '-'),
                      _infoTile('Email', apiUser['email']?.toString() ?? '-'),
                      _infoTile('Address', '${apiUser['address']?['street'] ?? ''}, ${apiUser['address']?['city'] ?? ''}'),
                    ],
                    const SizedBox(height: 24),
                    ElevatedButton.icon(
                      onPressed: () => ref.read(authProvider.notifier).logout(),
                      icon: const Icon(Icons.logout),
                      label: const Text('Logout'),
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                    ),
                  ],
                );
              },
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