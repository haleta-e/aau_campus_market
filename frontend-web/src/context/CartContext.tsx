import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Product } from '../types/product';
import { CartItem, CartContextType } from '../types/cart';

export const CART_STORAGE_KEY = 'aau_campus_market_cart';

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  initialItems?: CartItem[];
}

export function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Validate structure of each item to protect against malformed or outdated local data
    const validItems: CartItem[] = [];
    for (const item of parsed) {
      if (
        item &&
        typeof item === 'object' &&
        item.product &&
        typeof item.product.id === 'string' &&
        typeof item.product.name === 'string' &&
        typeof item.product.price === 'string' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0
      ) {
        validItems.push({
          product: item.product,
          quantity: Math.floor(item.quantity),
        });
      }
    }
    return validItems;
  } catch (err) {
    console.warn('Failed to parse cart from localStorage. Resetting cart to empty.', err);
    return [];
  }
}

export function CartProvider({ children, initialItems }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(() => {
    return initialItems ?? loadCartFromStorage();
  });

  // Sync to browser storage on every change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn('Failed to persist cart to localStorage', err);
    }
  }, [items]);

  const addToCart = (product: Product, quantity: number) => {
    if (product.stock_quantity <= 0) {
      return {
        success: false,
        message: 'This product is out of stock and cannot be added to the cart.',
      };
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return {
        success: false,
        message: 'Please enter a valid positive integer quantity.',
      };
    }

    const existingItem = items.find((item) => item.product.id === product.id);
    const currentQty = existingItem ? existingItem.quantity : 0;
    const newQty = currentQty + quantity;

    if (newQty > product.stock_quantity) {
      return {
        success: false,
        message: `Cannot add ${quantity} more. Stock limit is ${product.stock_quantity}${
          currentQty > 0 ? ` (you already have ${currentQty} in cart)` : ''
        }.`,
      };
    }

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [...prevItems, { product, quantity }];
      }
    });

    return {
      success: true,
      message: `Added ${quantity} unit(s) of "${product.name}" to cart.`,
    };
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    const targetItem = items.find((item) => item.product.id === productId);
    let cappedMessage: string | undefined;
    let finalQty = Math.floor(quantity);

    if (targetItem && finalQty > targetItem.product.stock_quantity) {
      finalQty = targetItem.product.stock_quantity;
      cappedMessage = `Quantity adjusted to maximum available stock (${targetItem.product.stock_quantity}).`;
    }

    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.product.id === productId) {
          return { ...item, quantity: finalQty };
        }
        return item;
      });
    });

    return {
      success: true,
      message: cappedMessage,
    };
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const priceNum = parseFloat(item.product.price);
      return isNaN(priceNum) ? sum : sum + priceNum * item.quantity;
    }, 0);
  }, [items]);

  const formattedSubtotal = useMemo(() => {
    return `${subtotal.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ETB`;
  }, [subtotal]);

  const value: CartContextType = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
    formattedSubtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
