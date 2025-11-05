'use client';

import { useState } from 'react';
import { useCart } from '@/app/contexts/CartContext';
import { ArrowLeft, CreditCard, Wallet, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
// Base Pay SDK (real payments)
import { pay } from '@base-org/account';
import { formatUSDCAmount, getPaymentStatus, pollPaymentStatus } from '@/app/lib/base-pay';
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
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'wompi'>('crypto');
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
      // Calculate totals in USD (cart.total is already in cents)
      // For testing: force all to sum exactly $1.00 total
      const totalUsd = 1.00;
      const formattedAmount = formatUSDCAmount(totalUsd);

      console.log('💳 Starting payment (Base Pay SDK):', { totalUsd, formattedAmount });

      // Create order FIRST before payment
      let orderId: string;
      let paymentId: string;
      
      try {
        const shippingCents = cart.total > 200000 ? 0 : 15000;
        const taxCents = Math.round(cart.total * 0.19);
        const totalAmountCents = cart.total + shippingCents + taxCents;
        const amountCop = Math.round(totalUsd * 4200);

        const initiateResponse = await fetch('/api/base-pay/initiate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: totalUsd.toString(),
            to: process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || '0x0000000000000000000000000000000000000000',
            testnet: process.env.NEXT_PUBLIC_TESTNET === 'true',
            items: cart.items,
            amountCop: amountCop,
            customerInfo: {
              name: contactInfo.name,
              email: contactInfo.email,
              phone: contactInfo.phone,
              address: contactInfo.address,
              city: contactInfo.city,
              country: contactInfo.country,
            },
          }),
        });

        if (initiateResponse.ok) {
          const initiateData = await initiateResponse.json();
          orderId = initiateData.orderId;
          paymentId = initiateData.paymentId;
          console.log('✅ Order created:', { orderId, paymentId });
        } else {
          throw new Error('Failed to create order');
        }
      } catch (orderError) {
        console.error('❌ Error creating order:', orderError);
        // Generate fallback IDs
        orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.warn('⚠️ Using fallback order/payment IDs');
      }

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

      console.log('📊 Payment object:', JSON.stringify(payment, null, 2));
      console.log('📊 Payment properties:', Object.keys(payment));
      
      setPaymentStatus('Esperando confirmación en la blockchain...');
      
      // Wait for payment to be confirmed and get the real transaction hash
      const isTestnet = process.env.NEXT_PUBLIC_TESTNET === 'true';
      
      console.log('🔍 Polling payment status for hash:', payment.id);
      
      // Poll payment status multiple times to get the real transaction hash
      let txHash: string | null = null;
      let attempts = 0;
      const maxAttempts = 30;
      const pollInterval = 2000; // 2 seconds
      
      while (attempts < maxAttempts && !txHash) {
        try {
          const paymentStatus = await getPaymentStatus(payment.id, isTestnet);
          
          console.log(`📊 Attempt ${attempts + 1} - Payment status:`, JSON.stringify(paymentStatus, null, 2));
          
          // Check if we have a valid transaction hash
          if (paymentStatus.transactionHash && 
              paymentStatus.transactionHash.length === 66 && 
              paymentStatus.transactionHash.startsWith('0x')) {
            txHash = paymentStatus.transactionHash;
            console.log('✅ Found valid transaction hash:', txHash);
            break;
          }
          
          // Also check payment object properties directly
          const paymentAny = payment as any;
          const possibleHash = paymentAny.transactionHash 
            || paymentAny.txHash 
            || paymentAny.hash
            || paymentAny.transaction?.hash;
            
          if (possibleHash && 
              typeof possibleHash === 'string' &&
              possibleHash.length === 66 && 
              possibleHash.startsWith('0x')) {
            txHash = possibleHash;
            console.log('✅ Found transaction hash in payment object:', txHash);
            break;
          }
          
          // If status is completed but no hash yet, wait a bit more
          if (paymentStatus.status === 'completed') {
            console.log('⏳ Payment completed but hash not available yet, waiting...');
            await new Promise(resolve => setTimeout(resolve, pollInterval));
            attempts++;
            continue;
          }
          
          // If failed, break
          if (paymentStatus.status === 'failed') {
            throw new Error('Payment failed');
          }
          
        } catch (statusError: any) {
          console.warn(`⚠️ Attempt ${attempts + 1} - Error getting payment status:`, statusError.message);
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, pollInterval));
        }
      }
      
      // If we still don't have a hash, try to use payment.id as fallback
      // but only if it looks like a valid transaction hash
      if (!txHash) {
        if (payment.id && 
            payment.id.length === 66 && 
            payment.id.startsWith('0x')) {
          txHash = payment.id;
          console.log('⚠️ Using payment.id as transaction hash (may not be valid):', txHash);
        } else {
          console.error('❌ Could not get valid transaction hash after', maxAttempts, 'attempts');
          throw new Error('No se pudo obtener el hash de la transacción. Por favor, verifica en tu wallet.');
        }
      }

      setPaymentStatus('¡Pago completado!');
      setTxHash(txHash);

      console.log('✅ Payment completed:', { 
        txHash: txHash, 
        hashLength: txHash.length,
        paymentId: payment.id,
        isValidHash: txHash.length === 66 && txHash.startsWith('0x'),
        basescanUrl: `https://${isTestnet ? 'sepolia.' : ''}basescan.org/tx/${txHash}`
      });

      // Notify backend of payment confirmation (optional, keeps emails/DB)
      try {
        // Calculate totals in cents for order data
        const shippingCents = cart.total > 200000 ? 0 : 15000;
        const taxCents = Math.round(cart.total * 0.19);
        const totalAmountCents = cart.total + shippingCents + taxCents;

        await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: orderId, // Use the orderId we created before payment
            paymentId: paymentId, // Use the paymentId we created before payment
            transactionHash: txHash,
            orderData: {
              customerEmail: contactInfo.email,
              customerName: contactInfo.name,
              customerPhone: contactInfo.phone,
              shippingAddress: `${contactInfo.address}, ${contactInfo.city}, ${contactInfo.country}`,
              items: cart.items,
              total: totalAmountCents,
              subtotal: cart.total,
              shipping: shippingCents,
              tax: taxCents,
            },
          }),
        });
        console.log('✅ Payment confirmed in backend');
      } catch (error) {
        console.error('⚠️ Failed to confirm payment in backend:', error);
        // Continue even if backend confirmation fails
      }

      // Persist order locally to show details in confirmation page
      try {
        // Totals are in cents for consistency with cart
        const subtotalCents = cart.total;
        const shippingCents = subtotalCents > 20000 ? 0 : 1500; // Free over $200
        const taxCents = Math.round(cart.total * 0.19);
        const totalCents = subtotalCents + shippingCents + taxCents;

        // Validate txHash before saving
        if (!txHash || txHash.length !== 66 || !txHash.startsWith('0x')) {
          console.error('❌ Invalid transaction hash format:', txHash);
          throw new Error('Hash de transacción inválido');
        }

        const lastOrder = {
          orderId: orderId,
          paymentId: paymentId,
          transactionHash: txHash, // Ensure we're saving the validated hash
          items: cart.items,
          totals: {
            subtotal: subtotalCents,
            shipping: shippingCents,
            tax: taxCents,
            total: totalCents,
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
        
        console.log('💾 Saving order to localStorage:', {
          orderId,
          transactionHash: txHash,
          hashLength: txHash.length,
          isValid: txHash.length === 66 && txHash.startsWith('0x')
        });
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('lastOrder', JSON.stringify(lastOrder));
        }
      } catch (saveError) {
        console.error('❌ Error saving order:', saveError);
      }

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

  const handleWompiPayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('Creando link de pago...');

    try {
      // Calculate totals
      const shippingCents = cart.total > 200000 ? 0 : 15000;
      const taxCents = Math.round(cart.total * 0.19);
      const totalAmountCents = cart.total + shippingCents + taxCents;
      const totalUsd = totalAmountCents / 100;
      const amountCop = Math.round(totalUsd * 4200);

      console.log('💳 Creating Wompi payment link:', { 
        totalUsd, 
        amountCop,
        items: cart.items.length 
      });

      // Create payment link via API
      const response = await fetch('/api/wompi/create-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalUsd,
          currency: 'COP',
          items: cart.items,
          customerInfo: {
            name: contactInfo.name,
            email: contactInfo.email,
            phone: contactInfo.phone,
            address: contactInfo.address,
            city: contactInfo.city,
            country: contactInfo.country,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment link');
      }

      const data = await response.json();
      const { paymentLink, orderId, paymentId } = data;

      console.log('✅ Payment link created:', { paymentLink, orderId, paymentId });

      // Save order locally for confirmation page
      try {
        const subtotalCents = cart.total;
        const shippingCents = subtotalCents > 20000 ? 0 : 1500;
        const taxCents = Math.round(cart.total * 0.19);
        const totalCents = subtotalCents + shippingCents + taxCents;

        const lastOrder = {
          orderId: orderId,
          paymentId: paymentId,
          transactionHash: null, // Will be updated via webhook
          items: cart.items,
          totals: {
            subtotal: subtotalCents,
            shipping: shippingCents,
            tax: taxCents,
            total: totalCents,
          },
          customer: {
            name: contactInfo.name,
            email: contactInfo.email,
            phone: contactInfo.phone,
            address: contactInfo.address,
            city: contactInfo.city,
            country: contactInfo.country,
          },
          method: 'Tarjeta (Wompi)',
        };
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('lastOrder', JSON.stringify(lastOrder));
        }
      } catch (saveError) {
        console.error('❌ Error saving order:', saveError);
      }

      setPaymentStatus('Redirigiendo a Wompi...');

      // Redirect to Wompi payment page
      window.location.href = paymentLink;
    } catch (error) {
      console.error('❌ Error processing Wompi payment:', error);
      setPaymentStatus(`Error: ${error instanceof Error ? error.message : 'Error al crear el link de pago'}`);
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
                      onClick={() => setPaymentMethod('wompi')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        paymentMethod === 'wompi'
                          ? 'border-cyber-blue bg-cyber-blue/20 shadow-lg shadow-cyber-blue/20'
                          : 'border-eth-gray/30 hover:border-cyber-blue/50 bg-bg-card/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <CreditCard className={`w-6 h-6 ${paymentMethod === 'wompi' ? 'text-cyber-blue' : 'text-eth-gray'}`} />
                        <div className="text-left">
                          <div className={`font-medium ${paymentMethod === 'wompi' ? 'text-white' : 'text-text-secondary'}`}>Tarjeta (Wompi)</div>
                          <div className="text-sm text-text-secondary">Pago en COP</div>
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

              {/* Wompi Payment */}
                {paymentMethod === 'wompi' && (
                  <div className="space-y-6">
                    <div className="bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg p-6">
                      <h4 className="font-heading text-lg text-cyber-purple mb-3 flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Wompi - Tarjeta de Crédito/Débito
                      </h4>
                      <p className="text-text-secondary mb-4">
                        Pago seguro con tarjeta de crédito o débito en pesos colombianos (COP). 
                        Aceptamos todas las tarjetas principales.
                      </p>
                      
                      <div className="space-y-2 text-sm bg-bg-card/50 p-4 rounded border border-eth-gray/20">
                        <div className="flex justify-between items-center">
                          <span className="text-text-secondary">Moneda:</span>
                          <span className="font-medium text-cyber-purple">COP (Pesos)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-secondary">Métodos:</span>
                          <span className="font-medium text-cyber-purple">Tarjeta, PSE, Nequi</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-secondary">Seguridad:</span>
                          <span className="font-medium text-cyber-green">PCI DSS</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-secondary">Tiempo:</span>
                          <span className="font-medium text-cyber-green">Inmediato</span>
                        </div>
                      </div>
                    </div>

                    {/* Wompi Payment Button */}
                    <button
                      onClick={handleWompiPayment}
                      disabled={isProcessing}
                      className="w-full relative bg-gradient-to-r from-cyber-purple to-cyber-blue hover:from-cyber-blue hover:to-cyber-purple disabled:from-eth-gray disabled:to-eth-gray text-white font-heading uppercase py-4 px-6 rounded-lg transition-all duration-300 border border-cyber-purple/50 disabled:border-eth-gray/30 shadow-lg hover:shadow-cyber-purple/50"
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>{paymentStatus || 'Creando link de pago...'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <CreditCard className="w-5 h-5" />
                          <span>Pagar con Tarjeta (Wompi)</span>
                        </div>
                      )}
                    </button>

                    {/* Payment Status */}
                    {paymentStatus && (
                      <div className={`p-4 rounded-lg border ${
                        paymentStatus.includes('Error') 
                          ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                          : paymentStatus.includes('Redirigiendo')
                          ? 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green'
                          : 'bg-cyber-purple/10 border-cyber-purple/30 text-cyber-purple'
                      }`}>
                        <div className="flex items-center gap-2">
                          {paymentStatus.includes('Error') ? (
                            <span className="text-red-400">✗</span>
                          ) : paymentStatus.includes('Redirigiendo') ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          )}
                          <span className="font-medium">{paymentStatus}</span>
                        </div>
                      </div>
                    )}
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
                    {(cart.total / 100) > 200 ? (
                      <span className="text-cyber-green">Gratis</span>
                    ) : (
                      <span className="text-white">{formatPrice(1500)}</span>
                    )}
                  </span>
                </div>

                {/* Tax */}
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Tax</span>
                  <span className="font-medium text-white">{formatPrice(Math.round(cart.total * 0.19))}</span>
                </div>

                {/* Divider */}
                <div className="border-t border-eth-gray/30 my-3"></div>

                {/* Total */}
                <div className="flex justify-between text-xl font-heading font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-cyber-blue">{formatPrice(cart.total + ((cart.total / 100) > 200 ? 0 : 1500) + Math.round(cart.total * 0.19))}</span>
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
