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
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-secondary-400" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">Tu carrito está vacío</h1>
          <p className="text-secondary-600 mb-8">
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
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/catalog"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Continuar comprando</span>
          </Link>
          <h1 className="text-4xl font-bold text-secondary-900">Carrito de Compras</h1>
          <p className="text-xl text-secondary-600">
            Revisa tus productos antes de proceder al pago
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-secondary-200 p-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">
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

