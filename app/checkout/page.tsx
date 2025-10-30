'use client';

import { useState } from 'react';
import { useCart } from '@/app/contexts/CartContext';
import { ArrowLeft, CreditCard, Wallet, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
// Base Pay SDK (real payments)
import { pay, getPaymentStatus } from '@base-org/account';
import { formatUSDCAmount } from '@/app/lib/base-pay';
import { formatPrice } from '@/app/lib/utils';

interface ContactInfo {
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('crypto');
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  });
  const [showPayment, setShowPayment] = useState(false);

  const handleBasePayPayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('Iniciando pago...');

    try {
      // Calculate total with shipping and tax
      const shipping = cart.total > 200000 ? 0 : 15000;
      const tax = cart.total * 0.19;
      const totalAmount = (cart.total + shipping + tax) / 100; // Convert from cents to dollars
      const formattedAmount = formatUSDCAmount(totalAmount);

      console.log('💳 Starting payment (Base Pay SDK):', { formattedAmount });

      // 1) Open Base Pay and request payment
      const payment = await pay({
        amount: formattedAmount,
        to: process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || '0x0000000000000000000000000000000000000000',
        testnet: process.env.NEXT_PUBLIC_TESTNET === 'true',
        payerInfo: {
          requests: [
            { type: 'email' },
            { type: 'phoneNumber', optional: true },
            { type: 'physicalAddress', optional: true },
          ],
        },
      });

      setPaymentStatus('Esperando confirmación en la red...');

      // 2) Poll until mined (testnet flag MUST match)
      const status = await getPaymentStatus({
        id: payment.id,
        testnet: process.env.NEXT_PUBLIC_TESTNET === 'true',
      });
      
      setPaymentStatus('¡Pago completado!');
      setTxHash(status.transactionHash || '');

      // Notify backend of payment confirmation (optional, keeps emails/DB)
      if (status.transactionHash) {
        try {
          // Calculate totals for order data
          const shipping = cart.total > 200000 ? 0 : 15000;
          const tax = cart.total * 0.19;
          const totalAmount = cart.total + shipping + tax;

          await fetch('/api/payments/confirm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId: payment.id, // using payment.id as order reference
              paymentId: payment.id,
              transactionHash: status.transactionHash,
              orderData: {
                customerEmail: contactInfo.email,
                customerName: contactInfo.name,
                customerPhone: contactInfo.phone,
                shippingAddress: `${contactInfo.address}, ${contactInfo.city}, ${contactInfo.country}`,
                items: cart.items,
                total: totalAmount,
              },
            }),
          });
          console.log('✅ Payment confirmed in backend');
        } catch (error) {
          console.error('⚠️ Failed to confirm payment in backend:', error);
          // Continue even if backend confirmation fails
        }
      }

      // Persist order locally to show details in confirmation page
      try {
        const subtotal = cart.total;
        const shippingCop = cart.total > 200000 ? 0 : 15000;
        const taxCop = Math.round(cart.total * 0.19);
        const totalCop = subtotal + shippingCop + taxCop;

        const lastOrder = {
          orderId: payment.orderId || `ETH-${Date.now().toString().slice(-6)}`,
          paymentId: payment.id,
          transactionHash: status.transactionHash,
          items: cart.items,
          totals: {
            subtotal,
            shipping: shippingCop,
            tax: taxCop,
            total: totalCop,
          },
          customer: {
            name: contactInfo.name,
            email: contactInfo.email,
            phone: contactInfo.phone,
            address: contactInfo.address,
            city: contactInfo.city,
            country: contactInfo.country,
          },
          method: 'USDC en Base (Base Pay)',
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem('lastOrder', JSON.stringify(lastOrder));
        }
      } catch (_) {}

      // Wait a moment before redirecting
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Clear cart and redirect
      clearCart();
      window.location.href = '/order-confirmation';
    } catch (error) {
      console.error('❌ Error processing payment:', error);
      setPaymentStatus('Error en el pago. Por favor, inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center relative">
        <div className="cyber-grid"></div>
        <div className="text-center max-w-md mx-auto px-4 relative z-10">
          <h1 className="text-3xl font-heading font-bold text-cyber-blue mb-4">No hay productos en tu carrito</h1>
          <p className="text-text-secondary mb-8">
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
    <div className="min-h-screen bg-brand-black relative">
      <div className="cyber-grid"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center space-x-2 text-cyber-blue hover:text-cyber-purple mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al carrito</span>
          </Link>
          <h1 className="text-4xl font-heading font-bold text-white glitch" data-text="Finalizar Compra">Finalizar Compra</h1>
          <p className="text-xl text-text-secondary">
            Completa tu pedido de productos ETH Cali
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Contact Information Form */}
            {!showPayment && (
              <div className="bg-bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-eth-gray/30 p-6 mb-6">
                <h2 className="text-xl font-heading font-semibold text-cyber-blue mb-6">
                  Información de Contacto y Envío
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={contactInfo.name}
                        onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                        className="w-full px-4 py-2 bg-bg-card/50 border border-eth-gray/30 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/20"
                        placeholder="Tu nombre"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        className="w-full px-4 py-2 bg-bg-card/50 border border-eth-gray/30 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/20"
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-bg-card/50 border border-eth-gray/30 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/20"
                      placeholder="+57 300 123 4567"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                      className="w-full px-4 py-2 bg-bg-card/50 border border-eth-gray/30 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/20"
                      placeholder="Calle 123 #45-67"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        value={contactInfo.city}
                        onChange={(e) => setContactInfo({ ...contactInfo, city: e.target.value })}
                        className="w-full px-4 py-2 bg-bg-card/50 border border-eth-gray/30 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/20"
                        placeholder="Cali"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        País *
                      </label>
                      <input
                        type="text"
                        value={contactInfo.country}
                        onChange={(e) => setContactInfo({ ...contactInfo, country: e.target.value })}
                        className="w-full px-4 py-2 bg-bg-card/50 border border-eth-gray/30 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/20"
                        placeholder="Colombia"
                        required
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (contactInfo.email && contactInfo.name && contactInfo.phone && contactInfo.address && contactInfo.city && contactInfo.country) {
                        setShowPayment(true);
                      }
                    }}
                    className="w-full btn-primary py-3 mt-6"
                  >
                    Continuar al Pago
                  </button>
                </div>
              </div>
            )}

            {/* Payment Method Selection */}
            {showPayment && (
              <div className="bg-bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-eth-gray/30 p-6 mb-6">
                <button
                  onClick={() => setShowPayment(false)}
                  className="text-cyber-blue hover:text-cyber-purple mb-4 inline-flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver a información de contacto</span>
                </button>

                <h2 className="text-xl font-heading font-semibold text-cyber-blue mb-6">
                  Información de Pago
                </h2>

                <div className="mb-6 p-4 bg-cyber-blue/10 border border-cyber-blue/30 rounded-lg">
                  <h3 className="font-medium text-white mb-2">Enviar a:</h3>
                  <p className="text-text-secondary">{contactInfo.name}</p>
                  <p className="text-text-secondary">{contactInfo.email}</p>
                  <p className="text-text-secondary">{contactInfo.address}, {contactInfo.city}, {contactInfo.country}</p>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-heading font-medium text-white mb-4">
                    Método de Pago
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setPaymentMethod('crypto')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        paymentMethod === 'crypto'
                          ? 'border-cyber-blue bg-cyber-blue/20 shadow-lg shadow-cyber-blue/20'
                          : 'border-eth-gray/30 hover:border-cyber-blue/50 bg-bg-card/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Wallet className={`w-6 h-6 ${paymentMethod === 'crypto' ? 'text-cyber-blue' : 'text-cyber-purple'}`} />
                        <div className="text-left">
                          <div className={`font-medium ${paymentMethod === 'crypto' ? 'text-white' : 'text-text-secondary'}`}>Base Pay</div>
                          <div className="text-sm text-text-secondary">USDC on Base</div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        paymentMethod === 'card'
                          ? 'border-cyber-blue bg-cyber-blue/20 shadow-lg shadow-cyber-blue/20'
                          : 'border-eth-gray/30 hover:border-cyber-blue/50 bg-bg-card/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-cyber-blue' : 'text-eth-gray'}`} />
                        <div className="text-left">
                          <div className={`font-medium ${paymentMethod === 'card' ? 'text-white' : 'text-text-secondary'}`}>Tarjeta</div>
                          <div className="text-sm text-text-secondary">Próximamente</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Crypto Payment */}
                {paymentMethod === 'crypto' && (
                  <div className="space-y-6">
                    <div className="bg-cyber-blue/10 border border-cyber-blue/30 rounded-lg p-6">
                      <h4 className="font-heading text-lg text-cyber-blue mb-3 flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        Base Pay - USDC
                      </h4>
                      <p className="text-text-secondary mb-4">
                        Pago con USDC en Base. Confirma en menos de 2 segundos. Sin tarjetas ni comisiones adicionales.
                      </p>
                      
                      <div className="space-y-2 text-sm bg-bg-card/50 p-4 rounded border border-eth-gray/20">
                        <div className="flex justify-between items-center">
                          <span className="text-text-secondary">Red:</span>
                          <span className="font-medium text-cyber-blue">Base Network</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-secondary">Token:</span>
                          <span className="font-medium text-cyber-blue">USDC</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-secondary">Tiempo:</span>
                          <span className="font-medium text-cyber-green">~2 segundos</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-secondary">Gas:</span>
                          <span className="font-medium text-cyber-green">Patrocinado</span>
                        </div>
                      </div>
                    </div>

                  {/* Base Pay Button with cyberpunk style */}
                  <button
                    onClick={handleBasePayPayment}
                    disabled={isProcessing}
                    className="w-full relative bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-purple hover:to-cyber-blue disabled:from-eth-gray disabled:to-eth-gray text-white font-heading uppercase py-4 px-6 rounded-lg transition-all duration-300 border border-cyber-blue/50 disabled:border-eth-gray/30 shadow-lg hover:shadow-cyber-blue/50"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{paymentStatus || 'Procesando...'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Wallet className="w-5 h-5" />
                        <span>Pagar con Base Pay</span>
                      </div>
                    )}
                  </button>

                  {/* Payment Status */}
                  {paymentStatus && (
                    <div className={`p-4 rounded-lg border ${
                      paymentStatus.includes('Error') 
                        ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                        : paymentStatus.includes('completado')
                        ? 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green'
                        : 'bg-cyber-blue/10 border-cyber-blue/30 text-cyber-blue'
                    }`}>
                      <div className="flex items-center gap-2">
                        {paymentStatus.includes('Error') ? (
                          <span className="text-red-400">✗</span>
                        ) : paymentStatus.includes('completado') ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        )}
                        <span className="font-medium">{paymentStatus}</span>
                      </div>
                      {txHash && (
                        <a
                          href={`https://basescan.org/tx/${txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-cyber-blue hover:text-cyber-purple mt-2 block"
                        >
                          Ver transacción en BaseScan →
                        </a>
                      )}
                    </div>
                  )}
                  </div>
                )}

              {/* Card Payment (Coming Soon) */}
                {paymentMethod === 'card' && (
                  <div className="bg-bg-card/30 border border-eth-gray/30 rounded-lg p-8 text-center">
                    <CreditCard className="w-12 h-12 text-eth-gray mx-auto mb-4" />
                    <h3 className="text-lg font-heading font-medium text-white mb-2">
                      Pago con Tarjeta
                    </h3>
                    <p className="text-text-secondary">
                      Esta opción estará disponible próximamente. 
                      Por ahora, utiliza el pago con Base Pay.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-eth-gray/30 p-6 sticky top-4">
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
                    {cart.total > 200000 ? (
                      <span className="text-cyber-green">Gratis</span>
                    ) : (
                      <span className="text-white">{formatPrice(15000)}</span>
                    )}
                  </span>
                </div>

                {/* Tax */}
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">IVA (19%)</span>
                  <span className="font-medium text-white">{formatPrice(cart.total * 0.19)}</span>
                </div>

                {/* Divider */}
                <div className="border-t border-eth-gray/30 my-3"></div>

                {/* Total */}
                <div className="flex justify-between text-xl font-heading font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-cyber-blue">{formatPrice(cart.total + (cart.total > 200000 ? 0 : 15000) + cart.total * 0.19)}</span>
                </div>
              </div>

              {/* Payment Methods Info */}
              <div className="text-center space-y-2">
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
          </div>
        </div>
      </div>
    </div>
  );
}
