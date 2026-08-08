import 'package:flutter/material.dart';
import '../models/discount_model.dart';

class DiscountBanner extends StatelessWidget {
  final DiscountModel discount;
  const DiscountBanner({super.key, required this.discount});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFF2E7D32), Color(0xFF66BB6A)]),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(children: [
        const Icon(Icons.local_offer, color: Colors.white),
        const SizedBox(width: 10),
        Expanded(
          child: Text('${discount.name} — ${discount.percentage.toInt()}% off',
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
        ),
      ]),
    );
  }
}