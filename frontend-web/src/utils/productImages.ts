import { Product } from '../types/product';

/**
 * High-resolution, real-world product photography for student campus marketplace items.
 * Curated from Unsplash CDN with optimized sizing, format, and crop parameters.
 */
const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  electronics:
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80',
  stationery:
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80',
  books:
    'https://images.unsplash.com/photo-1532012164546-f432f2e37b73?auto=format&fit=crop&w=700&q=80',
  clothing:
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=700&q=80',
  food:
    'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=700&q=80',
  accessories:
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80',
  sanitary:
    'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=700&q=80',
};

const SPECIFIC_PRODUCT_KEYWORDS: Array<{ keywords: string[]; url: string }> = [
  {
    keywords: ['calculator', 'fx-991', 'fx991', 'scientific'],
    url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=700&q=80',
  },
  {
    keywords: ['flash drive', 'usb', 'sandisk', 'thumb drive'],
    url: 'https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&w=700&q=80',
  },
  {
    keywords: ['mouse', 'wireless mouse', 'bluetooth mouse'],
    url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=700&q=80',
  },
  {
    keywords: ['notebook', 'grid', 'hardcover', 'exercise book', 'ruled'],
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80',
  },
  {
    keywords: ['pen', 'pens', 'ballpoint', 'bic', 'pencil'],
    url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=700&q=80',
  },
  {
    keywords: ['hoodie', 'sweater', 'fleece', 'jacket', 't-shirt', 'shirt'],
    url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=700&q=80',
  },
  {
    keywords: ['coffee', 'sidama', 'beans', 'espresso', 'roast'],
    url: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=700&q=80',
  },
  {
    keywords: ['sanitizer', 'soap', 'laundry', 'hygiene', 'detergent'],
    url: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=700&q=80',
  },
  {
    keywords: ['backpack', 'bag', 'satchel'],
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80',
  },
  {
    keywords: ['textbook', 'book', 'guide', 'manual', 'lecture'],
    url: 'https://images.unsplash.com/photo-1532012164546-f432f2e37b73?auto=format&fit=crop&w=700&q=80',
  },
];

const GENERAL_FALLBACK =
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=700&q=80';

/**
 * Returns a high-quality real photograph URL matching the product's name or category.
 */
export function getProductImageUrl(product: Pick<Product, 'name' | 'category'>): string {
  const nameLower = (product.name || '').toLowerCase();
  const catLower = (product.category || '').toLowerCase();

  // 1. Try finding a specific product keyword match
  for (const item of SPECIFIC_PRODUCT_KEYWORDS) {
    if (item.keywords.some((k) => nameLower.includes(k))) {
      return item.url;
    }
  }

  // 2. Try finding a category match
  for (const [catKey, url] of Object.entries(CATEGORY_DEFAULT_IMAGES)) {
    if (catLower.includes(catKey)) {
      return url;
    }
  }

  return GENERAL_FALLBACK;
}
