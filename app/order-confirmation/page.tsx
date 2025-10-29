'use client';

import Link from 'next/link';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">
          ¡Pedido Confirmado!
        </h1>
        <p className="text-xl text-secondary-600 mb-8">
          Gracias por tu compra. Tu pedido ha sido procesado exitosamente y 
          recibirás un email de confirmación pronto.
        </p>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-lg border border-secondary-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">
            Detalles del Pedido
          </h2>
          
          <div className="space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-secondary-600">Número de pedido:</span>
              <span className="font-medium">#ETH-{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Fecha:</span>
              <span className="font-medium">{new Date().toLocaleDateString('es-CO')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Método de pago:</span>
              <span className="font-medium">Criptomonedas</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Estado:</span>
              <span className="font-medium text-green-600">Confirmado</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">
            Próximos Pasos
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Package className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium text-primary-900">Preparación</div>
                <div className="text-sm text-primary-700">
                  Tu pedido será preparado en las próximas 24 horas
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Truck className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium text-primary-900">Envío</div>
                <div className="text-sm text-primary-700">
                  Recibirás un email con el número de seguimiento
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/catalog"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Continuar Comprando</span>
            <Package className="w-5 h-5" />
          </Link>
          
          <Link
            href="/"
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Volver al Inicio</span>
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-sm text-secondary-500">
          <p>
            ¿Tienes preguntas? Contáctanos en{' '}
            <a href="mailto:info@ethcali.org" className="text-primary-600 hover:text-primary-700">
              info@ethcali.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

