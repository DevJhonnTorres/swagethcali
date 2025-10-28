'use client';

import { Cart } from '@/app/types';
import { formatPrice } from '@/app/lib/utils';
import Link from 'next/link';

interface CartSummaryProps {
  cart: Cart;
}

export default function CartSummary({ cart }: CartSummaryProps) {
  const shipping = cart.total > 200000 ? 0 : 15000; // Free shipping over $200k COP
  const tax = cart.total * 0.19; // 19% IVA
  const total = cart.total + shipping + tax;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-secondary-200 p-6">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">
        Resumen del Pedido
      </h3>

      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between">
          <span className="text-secondary-600">Subtotal</span>
          <span className="font-medium">{formatPrice(cart.total)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between">
          <span className="text-secondary-600">Envío</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">Gratis</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between">
          <span className="text-secondary-600">IVA (19%)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        {/* Free shipping notice */}
        {shipping > 0 && (
          <div className="text-sm text-secondary-500 bg-secondary-50 p-3 rounded-lg">
            Agrega {formatPrice(200000 - cart.total)} más para envío gratis
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-secondary-200"></div>

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary-600">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <Link
        href="/checkout"
        className="w-full mt-6 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-center block"
      >
        Proceder al Pago
      </Link>

      {/* Payment Methods */}
      <div className="mt-4 text-center">
        <p className="text-sm text-secondary-500 mb-2">Métodos de pago</p>
        <div className="flex justify-center space-x-2">
          <div className="bg-secondary-100 px-3 py-1 rounded text-xs font-medium">
            ETH
          </div>
          <div className="bg-secondary-100 px-3 py-1 rounded text-xs font-medium">
            USDC
          </div>
          <div className="bg-secondary-100 px-3 py-1 rounded text-xs font-medium">
            USDT
          </div>
        </div>
      </div>
    </div>
  );
}
