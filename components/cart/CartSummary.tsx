'use client';

import { Cart } from '@/app/types';
import { formatPrice } from '@/app/lib/utils';
import Link from 'next/link';
import { Wallet } from 'lucide-react';

interface CartSummaryProps {
  cart: Cart;
}

export default function CartSummary({ cart }: CartSummaryProps) {
  const shipping = cart.total > 200000 ? 0 : 15000; // Free shipping over $200k COP
  const tax = cart.total * 0.19; // 19% IVA
  const total = cart.total + shipping + tax;

  return (
    <div className="bg-bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-eth-gray/30 p-6">
      <h3 className="text-lg font-heading font-semibold text-cyber-blue mb-4">
        Resumen del Pedido
      </h3>

      <div className="space-y-3 mb-6">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Subtotal</span>
          <span className="font-medium text-white">{formatPrice(cart.total)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Envío</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-cyber-green">Gratis</span>
            ) : (
              <span className="text-white">{formatPrice(shipping)}</span>
            )}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">IVA (19%)</span>
          <span className="font-medium text-white">{formatPrice(tax)}</span>
        </div>

        {/* Free shipping notice */}
        {shipping > 0 && (
          <div className="text-sm text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/30 p-3 rounded-lg">
            Agrega {formatPrice(200000 - cart.total)} más para envío gratis
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-eth-gray/30 my-3"></div>

        {/* Total */}
        <div className="flex justify-between text-xl font-heading font-bold">
          <span className="text-white">Total</span>
          <span className="text-cyber-blue">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Base Pay Button */}
      <Link
        href="/checkout"
        className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-purple hover:to-cyber-blue text-white font-heading uppercase py-4 px-6 rounded-lg transition-all duration-300 border border-cyber-blue/50 shadow-lg hover:shadow-cyber-blue/50 flex items-center justify-center gap-2"
      >
        <Wallet className="w-5 h-5" />
        <span>Pagar con Base Pay</span>
      </Link>

      {/* Payment Methods */}
      <div className="mt-4 text-center space-y-2">
        <p className="text-sm text-text-secondary">Paga con USDC en Base</p>
        <div className="flex justify-center space-x-2">
          <div className="bg-cyber-blue/20 border border-cyber-blue/30 px-3 py-1 rounded text-xs font-medium text-cyber-blue">
            Base Network
          </div>
          <div className="bg-cyber-purple/20 border border-cyber-purple/30 px-3 py-1 rounded text-xs font-medium text-cyber-purple">
            USDC
          </div>
        </div>
        <p className="text-xs text-cyber-green pt-1">~2 segundos • Gas gratis</p>
      </div>
    </div>
  );
}

