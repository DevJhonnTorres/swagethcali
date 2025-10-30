'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Tag, Truck, Shield, Check } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/app/lib/constants';
import { useCart } from '@/app/contexts/CartContext';
import { formatPrice } from '@/app/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);

  const product = SAMPLE_PRODUCTS.find(p => p.id === params.id);

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading text-white mb-4">Producto no encontrado</h1>
          <Link href="/catalog" className="btn-primary">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, 1);
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-brand-black relative">
      <div className="cyber-grid"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/catalog"
            className="inline-flex items-center space-x-2 text-cyber-blue hover:text-cyber-purple mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al catálogo</span>
          </Link>
        </div>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-eth-gray/30 p-6">
              <div className="aspect-square relative overflow-hidden rounded-lg">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index
                        ? 'border-cyber-blue shadow-lg shadow-cyber-blue/20'
                        : 'border-eth-gray/30 hover:border-cyber-blue/50'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - Vista ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Sale Badge */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-cyber-blue/20 border border-cyber-blue/30 rounded-full text-sm text-cyber-blue">
                {product.category}
              </span>
              {product.isOnSale && (
                <span className="px-3 py-1 bg-cyber-pink/20 border border-cyber-pink/30 rounded-full text-sm text-cyber-pink animate-pulse-glow">
                  EN OFERTA
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-heading font-bold text-white glitch" data-text={product.name}>
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-lg text-text-secondary font-body leading-relaxed">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-bg-card/50 border border-eth-gray/30 rounded-lg text-sm text-cyber-purple"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              {product.isOnSale && product.originalPrice && (
                <div className="text-lg text-text-secondary line-through">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
              <div className="text-4xl font-heading font-bold text-cyber-blue">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Stock Status */}
            <div className={`flex items-center space-x-2 ${product.inStock ? 'text-cyber-green' : 'text-red-400'}`}>
              <Check className={`w-5 h-5 ${product.inStock ? 'text-cyber-green' : 'text-red-400'}`} />
              <span className="font-medium">
                {product.inStock ? 'En stock - Disponible' : 'Agotado'}
              </span>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-purple hover:to-cyber-blue disabled:from-eth-gray disabled:to-eth-gray text-white font-heading uppercase py-4 px-6 rounded-lg transition-all duration-300 border border-cyber-blue/50 disabled:border-eth-gray/30 shadow-lg hover:shadow-cyber-blue/50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{product.inStock ? 'Agregar al Carrito' : 'Producto Agotado'}</span>
            </button>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-eth-gray/30">
              <div className="flex items-start space-x-3">
                <div className="bg-cyber-blue/20 p-2 rounded-lg">
                  <Truck className="w-5 h-5 text-cyber-blue" />
                </div>
                <div>
                  <div className="font-medium text-white">Envío Gratis</div>
                  <div className="text-sm text-text-secondary">En compras +$200k</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-cyber-purple/20 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-cyber-purple" />
                </div>
                <div>
                  <div className="font-medium text-white">Garantía</div>
                  <div className="text-sm text-text-secondary">30 días</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-cyber-pink/20 p-2 rounded-lg">
                  <Tag className="w-5 h-5 text-cyber-pink" />
                </div>
                <div>
                  <div className="font-medium text-white">Calidad</div>
                  <div className="text-sm text-text-secondary">Premium</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-eth-gray/30 p-8">
          <h2 className="text-2xl font-heading font-bold text-cyber-blue mb-6">Características del Producto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-text-secondary">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Categoría</h3>
              <p>{product.category}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Disponibilidad</h3>
              <p>{product.inStock ? 'Disponible' : 'Agotado'}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Precio Original</h3>
              <p>{product.originalPrice ? formatPrice(product.originalPrice) : 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Precio Actual</h3>
              <p className="text-cyber-blue font-bold">{formatPrice(product.price)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

