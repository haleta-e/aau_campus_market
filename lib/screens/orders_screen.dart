import 'package:flutter/material.dart';

class OrdersScreen extends StatelessWidget {
  const OrdersScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Dorm Deliveries & Orders')),
      body: const Center(child: Text('Active Orders & Delivery History')),
    );
  }
}