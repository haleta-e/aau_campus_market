import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AAU Student Profile')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: const [
            CircleAvatar(radius: 40, child: Icon(Icons.person, size: 40)),
            SizedBox(height: 12),
            Text('Verified AAU Student', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            Text('4 Kilo Science Campus', style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}
