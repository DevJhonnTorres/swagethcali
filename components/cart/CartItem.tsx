'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/app/types';
import { useCart } from '@/app/contexts/CartContext';
import { formatPrice } from '@/app/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity, variant } = item;
  const price = variant?.price || product.price;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-secondary-200">
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={variant?.image || product.image}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-secondary-900 truncate">
          {product.name}
        </h3>
        {variant && (
          <p className="text-sm text-secondary-600">Variante: {variant.name}</p>
        )}
        <p className="text-lg font-bold text-primary-600">
          {formatPrice(price)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          className="p-1 rounded-full hover:bg-secondary-100 transition-colors"
          disabled={quantity <= 1}
        >
          <Minus className="w-4 h-4 text-secondary-600" />
        </button>
        
        <span className="w-8 text-center font-medium">{quantity}</span>
        
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          className="p-1 rounded-full hover:bg-secondary-100 transition-colors"
        >
          <Plus className="w-4 h-4 text-secondary-600" />
        </button>
      </div>

      {/* Total Price */}
      <div className="text-right">
        <p className="font-bold text-secondary-900">
          {formatPrice(price * quantity)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeFromCart(item.id)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
