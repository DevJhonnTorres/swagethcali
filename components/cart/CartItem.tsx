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
    <div className="flex items-center space-x-4 p-4 bg-bg-card/50 rounded-lg border border-eth-gray/20 hover:border-cyber-blue/30 transition-all">
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-eth-gray/20">
        <Image
          src={variant?.image || product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-semibold text-white truncate">
          {product.name}
        </h3>
        {variant && (
          <p className="text-sm text-text-secondary">Variante: {variant.name}</p>
        )}
        <p className="text-lg font-heading font-bold text-cyber-blue">
          {formatPrice(price)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          className="p-2 rounded-lg hover:bg-cyber-blue/20 border border-eth-gray/30 hover:border-cyber-blue transition-colors"
          disabled={quantity <= 1}
        >
          <Minus className="w-4 h-4 text-cyber-blue" />
        </button>
        
        <span className="w-8 text-center font-heading font-medium text-white">{quantity}</span>
        
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          className="p-2 rounded-lg hover:bg-cyber-blue/20 border border-eth-gray/30 hover:border-cyber-blue transition-colors"
        >
          <Plus className="w-4 h-4 text-cyber-blue" />
        </button>
      </div>

      {/* Total Price */}
      <div className="text-right">
        <p className="font-heading font-bold text-cyber-blue">
          {formatPrice(price * quantity)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeFromCart(item.id)}
        className="p-2 text-cyber-pink hover:bg-cyber-pink/20 rounded-lg transition-colors border border-cyber-pink/30"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

