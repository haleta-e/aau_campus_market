import 'package:flutter/material.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 2), () {
      Navigator.pushReplacementNamed(context, '/home');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1E293B),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.amber[800],
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.school, size: 64, color: Colors.white),
            ),
            const SizedBox(height: 24),
            const Text(
              'AAU CAMPUS MARKETPLACE',
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              '4 Kilo • 5 Kilo • Sidist Kilo • Mexico • Ledeta • Sefer Selam',
              style: TextStyle(color: Colors.amber, fontSize: 11),
            ),
            const SizedBox(height: 40),
            const CircularProgressIndicator(color: Colors.amber),
          ],
        ),
      ),
    );
  }
}