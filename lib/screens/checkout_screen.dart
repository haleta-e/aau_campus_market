import 'package:flutter/material.dart';

class CheckoutScreen extends StatelessWidget {
  const CheckoutScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Dorm Checkout')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const TextField(decoration: InputDecoration(labelText: 'Dorm Block Number (e.g. Block 42)')),
            const TextField(decoration: InputDecoration(labelText: 'Dorm Room Number (e.g. Room 304)')),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Order Confirmed 🎉'),
                    content: const Text('Your campus runner has been dispatched with Telebirr payment option.'),
                    actions: [TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('OK'))],
                  ),
                );
              },
              child: const Text('Confirm Order via Telebirr'),
            ),
          ],
        ),
      ),
    );
  }
}
