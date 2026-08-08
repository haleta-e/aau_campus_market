import 'package:flutter/material.dart';
import '../models/cart_item_model.dart';
import '../utils/formatters.dart';

class CartItemCard extends StatelessWidget {
  final CartItemModel item;
  final VoidCallback onIncrease;
  final VoidCallback onDecrease;
  final VoidCallback onRemove;

  const CartItemCard({
    super.key, required this.item, required this.onIncrease, required this.onDecrease, required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Row(children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: SizedBox(
              width: 60, height: 60,
              child: item.source.name == 'api'
                  ? Image.network(item.image, fit: BoxFit.contain)
                  : Image.asset(item.image, fit: BoxFit.contain),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(item.name, style: const TextStyle(fontWeight: FontWeight.w600), maxLines: 1, overflow: TextOverflow.ellipsis),
              Text(Formatters.currency(item.price)),
              Row(children: [
                IconButton(icon: const Icon(Icons.remove_circle_outline), onPressed: onDecrease),
                Text('${item.quantity}'),
                IconButton(icon: const Icon(Icons.add_circle_outline), onPressed: onIncrease),
                const Spacer(),
                IconButton(icon: const Icon(Icons.delete_outline, color: Colors.red), onPressed: onRemove),
              ]),
            ]),
          ),
        ]),
      ),
    );
  }
}