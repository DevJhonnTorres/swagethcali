'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Package, Truck, Home, Wallet } from 'lucide-react';
import { formatPrice } from '@/app/lib/utils';

type StoredOrder = {
  orderId: string;
  paymentId?: string;
  transactionHash?: string;
  items: Array<{ 
    id: string; 
    quantity: number; 
    product: { name: string; price: number };
    variant?: { size?: string; name?: string };
  }>;
  totals: { subtotal: number; shipping: number; tax: number; total: number };
  customer?: { name?: string; email?: string; phone?: string; address?: string; city?: string; country?: string };
  method?: string;
};

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('lastOrder') : null;
      if (raw) {
        setOrder(JSON.parse(raw));
      }
    } catch (_) {}
  }, []);

  const fallbackId = useMemo(() => `ETH-${Date.now().toString().slice(-6)}`, []);

  return (
    <div className="min-h-screen bg-brand-black relative">
      <div className="cyber-grid-static"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 text-center">
        {/* Animated Success Icon */}
        <div className="mx-auto mb-6 flex items-center justify-center">
          <div className="check-animate-pop">
            <svg width="110" height="110" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="52" stroke="#22c55e" strokeWidth="6" className="check-animate-circle" />
              <path d="M38 63 L54 78 L85 44" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="check-animate-mark" />
            </svg>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white glitch mb-2" data-text="¡PEDIDO CONFIRMADO!">
          ¡PEDIDO CONFIRMADO!
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto mb-8">
          Gracias por tu compra. Tu pedido ha sido procesado exitosamente y recibirás un email de confirmación pronto.
        </p>

        {/* Order Details Card */}
        <div className="bg-bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-eth-gray/30 p-6 mb-8 text-left">
          <h2 className="text-lg font-heading font-semibold text-cyber-blue mb-4">DETALLES DEL PEDIDO</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Info */}
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-text-secondary">Número de pedido:</span><span className="text-white font-medium">#{order?.orderId || fallbackId}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Fecha:</span><span className="text-white font-medium">{new Date().toLocaleDateString('es-CO')}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Método de pago:</span><span className="text-white font-medium">{order?.method || 'USDC en Base (Base Pay)'}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Estado:</span><span className="text-cyber-green font-medium">Confirmado</span></div>
              {order?.transactionHash && (
                <div className="flex justify-between items-start gap-4">
                  <span className="text-text-secondary whitespace-nowrap">Tx Hash:</span>
                  <div className="flex flex-col items-end flex-1 min-w-0">
                    <a 
                      href={`https://${process.env.NEXT_PUBLIC_TESTNET === 'true' ? 'sepolia.' : ''}basescan.org/tx/${order.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyber-blue hover:text-cyber-purple font-mono text-xs hover:underline break-all text-right block w-full"
                      title={`Ver en BaseScan: ${order.transactionHash}`}
                    >
                      {order.transactionHash}
                    </a>
                    <div className="flex items-center gap-2 mt-1">
                      {order.transactionHash.length === 66 ? (
                        <>
                          <span className="text-xs text-cyber-green">✓ Hash válido</span>
                          <span className="text-xs text-text-secondary">({order.transactionHash.length} chars)</span>
                        </>
                      ) : (
                        <span className="text-xs text-red-400">⚠️ Hash incompleto ({order.transactionHash.length} chars)</span>
                      )}
                    </div>
                    <span className="text-xs text-text-secondary mt-1">
                      <a 
                        href={`https://${process.env.NEXT_PUBLIC_TESTNET === 'true' ? 'sepolia.' : ''}basescan.org/tx/${order.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyber-blue hover:text-cyber-purple underline"
                      >
                        Ver en BaseScan →
                      </a>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-text-secondary">Subtotal</span><span className="text-white">{formatPrice(order?.totals?.subtotal ?? 0)}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Envío</span><span className="text-white">{formatPrice(order?.totals?.shipping ?? 0)}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Impuestos</span><span className="text-white">{formatPrice(order?.totals?.tax ?? 0)}</span></div>
              <div className="border-t border-eth-gray/30 pt-2 flex justify-between"><span className="text-text-secondary">Total</span><span className="text-cyber-blue font-heading font-semibold">{formatPrice(order?.totals?.total ?? 0)}</span></div>
            </div>
          </div>

          {/* Items */}
          {order?.items?.length ? (
            <div className="mt-6">
              <h3 className="text-sm font-heading text-text-secondary mb-2">Productos</h3>
              <div className="divide-y divide-eth-gray/30">
                {order.items.map((it) => (
                  <div key={it.id} className="py-2 flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-white">{it.quantity}x {it.product.name}</span>
                      {it.variant?.size && (
                        <span className="text-cyber-blue ml-2 text-sm">(Talla: {it.variant.size})</span>
                      )}
                    </div>
                    <span className="text-text-secondary">{formatPrice(it.product.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Customer */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><div className="text-xs text-text-secondary">Cliente</div><div className="text-white">{order?.customer?.name || 'N/A'}</div></div>
            <div><div className="text-xs text-text-secondary">Email</div><div className="text-white">{order?.customer?.email || 'N/A'}</div></div>
            <div><div className="text-xs text-text-secondary">Envío</div><div className="text-white truncate" title={`${order?.customer?.address || ''} ${order?.customer?.city || ''} ${order?.customer?.country || ''}`}>{order?.customer?.address || 'N/A'}</div></div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-bg-card/60 backdrop-blur-sm border border-eth-gray/30 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-heading font-semibold text-cyber-blue mb-4">PRÓXIMOS PASOS</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Package className="w-5 h-5 text-cyber-blue mt-1" />
              <div className="text-left">
                <div className="font-medium text-white">Preparación</div>
                <div className="text-sm text-text-secondary">Tu pedido será preparado en las próximas 24 horas</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Truck className="w-5 h-5 text-cyber-purple mt-1" />
              <div className="text-left">
                <div className="font-medium text-white">Envío</div>
                <div className="text-sm text-text-secondary">Recibirás un email con el número de seguimiento</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/catalog" className="btn-primary inline-flex items-center space-x-2">
            <span>Seguir Comprando</span>
            <Package className="w-5 h-5" />
          </Link>
          <Link href="/" className="btn-secondary inline-flex items-center space-x-2">
            <Home className="w-5 h-5" />
            <span>Volver al Inicio</span>
          </Link>
          <a href="#" className="btn-secondary inline-flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>Ver pago</span>
          </a>
        </div>

        <div className="mt-8 text-sm text-text-secondary">
          ¿Dudas? Escríbenos a <a href="mailto:info@ethcali.org" className="text-cyber-blue hover:text-cyber-purple">info@ethcali.org</a>
        </div>
      </div>
    </div>
  );
}

