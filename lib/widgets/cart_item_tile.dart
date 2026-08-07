import 'package:flutter/material.dart';
import '../models/cart_item.dart';

class CartItemTile extends StatelessWidget {
  final CartItem item;
  final VoidCallback onRemove;

  const CartItemTile({
    Key? key,
    required this.item,
    required this.onRemove,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Image.network(item.product.image, width: 40, height: 40, fit: BoxFit.cover),
      title: Text(item.product.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
      subtitle: Text('${item.totalETB.toStringAsFixed(0)} ETB'),
      trailing: IconButton(icon: const Icon(Icons.delete_outline, color: Colors.red), onPressed: onRemove),
    );
  }
}