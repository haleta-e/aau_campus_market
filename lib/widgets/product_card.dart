import 'package:flutter/material.dart';
import '../models/product_model.dart';
import '../utils/formatters.dart';

class ProductCard extends StatelessWidget {
  final ProductModel product;
  final double displayPrice;
  final VoidCallback onTap;

  const ProductCard({super.key, required this.product, required this.displayPrice, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final hasDiscount = displayPrice < product.price;
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Expanded(
            child: Container(
              width: double.infinity,
              color: Colors.grey.shade100,
              child: product.isFromApi
                  ? Image.network(product.image, fit: BoxFit.contain, errorBuilder: (_, __, ___) => const Icon(Icons.image_not_supported))
                  : Image.asset(product.image, fit: BoxFit.contain, errorBuilder: (_, __, ___) => const Icon(Icons.image_not_supported)),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(product.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w600)),
              const SizedBox(height: 4),
              Row(children: [
                Text(Formatters.currency(displayPrice), style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF2E7D32))),
                if (hasDiscount) ...[
                  const SizedBox(width: 6),
                  Text(Formatters.currency(product.price),
                      style: const TextStyle(decoration: TextDecoration.lineThrough, fontSize: 11, color: Colors.grey)),
                ],
              ]),
              if (!product.isInStock)
                const Text('Out of stock', style: TextStyle(color: Colors.red, fontSize: 11)),
            ]),
          ),
        ]),
      ),
    );
  }
}