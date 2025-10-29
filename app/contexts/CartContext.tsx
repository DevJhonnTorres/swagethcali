'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Cart, CartItem, Product } from '@/app/types';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number, variant?: any) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; variant?: any } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

function cartReducer(state: Cart, action: CartAction): Cart {
  let newItems: CartItem[] = [];

  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, variant } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product.id === product.id && item.variant?.id === variant?.id
      );

      if (existingItem) {
        newItems = state.items.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${variant?.id || 'default'}-${Date.now()}`,
          product,
          quantity,
          variant,
        };
        newItems = [...state.items, newItem];
      }
      break;
    }

    case 'REMOVE_ITEM': {
      newItems = state.items.filter((item) => item.id !== action.payload.itemId);
      break;
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      if (quantity <= 0) {
        newItems = state.items.filter((item) => item.id !== itemId);
      } else {
        newItems = state.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );
      }
      break;
    }

    case 'CLEAR_CART': {
      newItems = [];
      break;
    }

    default:
      return state;
  }

  // Calculate totals
  const { total, itemCount } = calculateCartTotals(newItems);

  return {
    items: newItems,
    total,
    itemCount,
  };
}

function calculateCartTotals(items: CartItem[]): { total: number; itemCount: number } {
  const total = items.reduce((sum, item) => {
    const price = item.variant?.price || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { total, itemCount };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  const addToCart = (product: Product, quantity = 1, variant?: any) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity, variant },
    });
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

