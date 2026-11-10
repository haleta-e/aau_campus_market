import { Laptop, Shirt, UtensilsCrossed, BookOpen, Sparkles, Home, PenTool, Layers } from 'lucide-react';

interface CategoryShowcaseProps {
  selectedCategory?: string;
  onSelectCategory: (category: string) => void;
}

export interface CategoryItem {
  id: string;
  name: string;
  countLabel: string;
  icon: typeof Laptop;
  image: string;
  color: string;
}

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'all',
    name: 'All Categories',
    countLabel: 'Everything',
    icon: Layers,
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=400&q=80',
    color: '#7c3aed',
  },
  {
    id: 'Electronics',
    name: 'Electronics',
    countLabel: 'Gadgets & Audio',
    icon: Laptop,
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80',
    color: '#3b82f6',
  },
  {
    id: 'Clothing',
    name: 'Clothing',
    countLabel: 'Fashion & Hoodies',
    icon: Shirt,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
    color: '#ec4899',
  },
  {
    id: 'Food',
    name: 'Food',
    countLabel: 'Snacks & Coffee',
    icon: UtensilsCrossed,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
    color: '#f59e0b',
  },
  {
    id: 'Books',
    name: 'Books',
    countLabel: 'Texts & Novels',
    icon: BookOpen,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    color: '#10b981',
  },
  {
    id: 'Beauty',
    name: 'Beauty',
    countLabel: 'Personal Care',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
    color: '#f43f5e',
  },
  {
    id: 'Home essentials',
    name: 'Home essentials',
    countLabel: 'Dorm & Living',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
    color: '#8b5cf6',
  },
  {
    id: 'Stationery',
    name: 'Stationery',
    countLabel: 'Pens & Notebooks',
    icon: PenTool,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=400&q=80',
    color: '#06b6d4',
  },
];

export function CategoryShowcase({ selectedCategory = '', onSelectCategory }: CategoryShowcaseProps) {
  const currentCategory = selectedCategory || '';

  return (
    <section className="categories-showcase-section" aria-label="Browse by Category">
      <div className="section-header-row">
        <div>
          <span className="section-badge">Department Directory</span>
          <h2 className="section-title">Explore Categories</h2>
        </div>
        <p className="section-subtitle">
          Find exactly what you need for class, dorm life, and study sessions
        </p>
      </div>

      <div className="category-cards-grid">
        {CATEGORIES_DATA.map((cat) => {
          const Icon = cat.icon;
          const isSelected =
            (cat.id === 'all' && (!currentCategory || currentCategory === '')) ||
            (Boolean(currentCategory) && currentCategory.toLowerCase() === cat.id.toLowerCase());

          return (
            <button
              key={cat.id}
              type="button"
              className={`category-showcase-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectCategory(cat.id === 'all' ? '' : cat.id)}
              aria-pressed={isSelected}
            >
              <div className="category-card-image-wrap">
                <img src={cat.image} alt={cat.name} className="category-bg-img" loading="lazy" />
                <div className="category-image-overlay" />
                <div className="category-icon-floating" style={{ backgroundColor: cat.color }}>
                  <Icon size={20} color="#ffffff" />
                </div>
              </div>
              <div className="category-card-info">
                <h3 className="category-title">{cat.name}</h3>
                <span className="category-count">{cat.countLabel}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
