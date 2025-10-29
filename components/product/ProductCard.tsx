'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '@/app/types';
import { useCart } from '@/app/contexts/CartContext';
import { formatPrice, calculateDiscount } from '@/app/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add cyberpunk animation effect
    const button = e.currentTarget;
    button.classList.add('animate-pulse-glow');
    setTimeout(() => {
      button.classList.remove('animate-pulse-glow');
    }, 600);
    addToCart(product, 1);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div
      className="group relative bg-bg-card/80 backdrop-blur-sm rounded-lg border border-eth-gray/30 overflow-hidden hover:border-cyber-blue/50 hover:shadow-lg hover:shadow-cyber-blue/20 hover:-translate-y-2 transition-all duration-500 animate-bounce-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Sale Badge */}
          {product.isOnSale && (
            <div className="absolute top-3 left-3 bg-cyber-pink text-brand-black text-xs font-heading font-bold px-2 py-1 rounded animate-pulse-glow">
              VENTA
            </div>
          )}

          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`absolute top-3 right-3 p-2 rounded transition-all duration-300 hover:scale-110 ${
              isLiked
                ? 'bg-cyber-pink text-brand-black animate-bounce-in'
                : 'bg-bg-card/80 text-text-secondary hover:bg-cyber-blue hover:text-brand-black'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current animate-pulse' : ''}`} />
          </button>

          {/* Quick Actions */}
          <div
            className={`absolute inset-0 bg-brand-black/70 flex items-center justify-center space-x-2 transition-all duration-500 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <button className="bg-bg-card text-text-primary p-2 rounded hover:bg-cyber-blue hover:text-brand-black transition-all duration-300 hover:scale-110 animate-slide-in-left">
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-cyber-blue text-brand-black p-2 rounded hover:bg-cyber-pink transition-all duration-300 hover:scale-110 animate-slide-in-right"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-heading font-bold text-text-primary mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-sm text-text-secondary mb-3 line-clamp-2 font-body">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg font-heading font-bold text-cyber-blue">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-text-secondary line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-xs bg-cyber-pink text-brand-black px-2 py-1 rounded font-heading font-bold">
                  -{calculateDiscount(product.originalPrice, product.price)}%
                </span>
              </>
            )}
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-eth-gray/20 text-text-secondary px-2 py-1 rounded font-body"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Stock Status */}
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-body font-medium ${
                product.inStock ? 'text-cyber-blue' : 'text-cyber-pink'
              }`}
            >
              {product.inStock ? 'EN STOCK' : 'AGOTADO'}
            </span>
            
                {product.inStock && (
                  <button
                    onClick={handleAddToCart}
                    className="text-sm bg-cyber-blue text-brand-black px-3 py-1 rounded hover:bg-cyber-pink hover:scale-105 transition-all duration-300 font-heading font-bold animate-bounce-in"
                  >
                    AGREGAR
                  </button>
                )}
          </div>
        </div>
      </Link>
    </div>
  );
}
