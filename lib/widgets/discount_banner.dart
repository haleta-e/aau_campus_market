import 'package:flutter/material.dart';

class HolidayBanner extends StatelessWidget {
  const HolidayBanner({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFF0F172A), Color(0xFF78350F)]),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(color: Colors.amber, borderRadius: BorderRadius.circular(10)),
            child: const Text('⚡ AAU ACADEMIC DISCOUNT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 8),
          const Text('Semester Final Exams Prep Discount 🎉', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 4),
          const Text('15% OFF Stationeries & Dorm Snacks with promo code HOLIDAY15', style: TextStyle(color: Colors.amber, fontSize: 12)),
        ],
      ),
    );
  }
}
