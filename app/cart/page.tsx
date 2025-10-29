'use client';

import { useCart } from '@/app/contexts/CartContext';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { cart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center cyber-grid">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-cyber-blue/20 border border-cyber-blue/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-cyber-blue" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-cyber-blue mb-4">Tu carrito está vacío</h1>
          <p className="text-text-secondary mb-8">
            Agrega algunos productos increíbles de ETH Cali a tu carrito
          </p>
          <Link
            href="/catalog"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Explorar Catálogo</span>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/catalog"
            className="inline-flex items-center space-x-2 text-cyber-blue hover:text-cyber-purple mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Continuar comprando</span>
          </Link>
          <h1 className="text-4xl font-heading font-bold text-white glitch" data-text="Carrito de Compras">Carrito de Compras</h1>
          <p className="text-xl text-text-secondary">
            Revisa tus productos antes de proceder al pago
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-eth-gray/30 p-6">
              <h2 className="text-xl font-heading font-semibold text-cyber-blue mb-6">
                Productos ({cart.itemCount})
              </h2>
              
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary cart={cart} />
          </div>
        </div>
      </div>
    </div>
  );
}

