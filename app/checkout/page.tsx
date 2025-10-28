'use client';

import { useState } from 'react';
import { useCart } from '@/app/contexts/CartContext';
import CartSummary from '@/components/cart/CartSummary';
// import { Transaction } from '@coinbase/onchainkit';
import { ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('crypto');

  const handleCryptoPayment = async () => {
    setIsProcessing(true);
    try {
      // Aquí implementarías la lógica de pago con crypto usando OnchainKit
      // Por ahora simulamos el proceso
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Limpiar carrito después del pago exitoso
      clearCart();
      
      // Redirigir a página de confirmación
      window.location.href = '/order-confirmation';
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">No hay productos en tu carrito</h1>
          <p className="text-secondary-600 mb-8">
            Agrega algunos productos antes de proceder al pago
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
            href="/cart"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al carrito</span>
          </Link>
          <h1 className="text-4xl font-bold text-secondary-900">Finalizar Compra</h1>
          <p className="text-xl text-secondary-600">
            Completa tu pedido de productos ETH Cali
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-secondary-200 p-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                Información de Pago
              </h2>

              {/* Payment Method Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-secondary-900 mb-4">
                  Método de Pago
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod('crypto')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      paymentMethod === 'crypto'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-secondary-200 hover:border-secondary-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Wallet className="w-6 h-6 text-primary-600" />
                      <div className="text-left">
                        <div className="font-medium text-secondary-900">Crypto</div>
                        <div className="text-sm text-secondary-600">ETH, USDC, USDT</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      paymentMethod === 'card'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-secondary-200 hover:border-secondary-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-6 h-6 text-primary-600" />
                      <div className="text-left">
                        <div className="font-medium text-secondary-900">Tarjeta</div>
                        <div className="text-sm text-secondary-600">Próximamente</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Crypto Payment */}
              {paymentMethod === 'crypto' && (
                <div className="space-y-6">
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <h4 className="font-medium text-primary-900 mb-2">
                      Pago con Criptomonedas
                    </h4>
                    <p className="text-sm text-primary-700 mb-4">
                      Conecta tu wallet y confirma la transacción para completar tu compra.
                      Aceptamos ETH, USDC y USDT en múltiples redes.
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-secondary-600">Redes soportadas:</span>
                        <span className="font-medium">Ethereum, Base, Polygon</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-600">Tokens aceptados:</span>
                        <span className="font-medium">ETH, USDC, USDT</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCryptoPayment}
                    disabled={isProcessing}
                    className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-400 text-white font-medium py-4 px-6 rounded-lg transition-colors"
                  >
                    {isProcessing ? 'Procesando...' : 'Simular Pago (Demo)'}
                  </button>
                </div>
              )}

              {/* Card Payment (Coming Soon) */}
              {paymentMethod === 'card' && (
                <div className="bg-secondary-100 border border-secondary-200 rounded-lg p-8 text-center">
                  <CreditCard className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">
                    Pago con Tarjeta
                  </h3>
                  <p className="text-secondary-600">
                    Esta opción estará disponible próximamente. 
                    Por ahora, utiliza el pago con criptomonedas.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CartSummary cart={cart} />
          </div>
        </div>
      </div>
    </div>
  );
}
