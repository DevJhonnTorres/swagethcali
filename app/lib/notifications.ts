/**
 * Notification Service
 * Handles email confirmations and WhatsApp notifications
 */

import { Resend } from 'resend';
import twilio from 'twilio';

// Only create Resend client if API key is provided
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface OrderData {
  orderId: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  shippingAddress?: string;
  items: Array<{
    product: {
      id: string;
      name: string;
      description: string;
      price: number;
      image: string;
      category: string;
    };
    quantity: number;
  }>;
  total: number;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  transactionHash?: string;
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(orderData: OrderData) {
  if (!resend || !process.env.RESEND_API_KEY) {
    console.log('📧 Email simulation (no API key configured):', orderData);
    return { success: true, id: 'simulated_email_id' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Ecomer Wiliwonka <onboarding@resend.dev>',
      to: orderData.customerEmail,
      subject: `Confirmación de Pedido #${orderData.orderId}`,
      html: generateOrderConfirmationEmail(orderData),
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      return { success: false, error };
    }

    console.log('✅ Order confirmation email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error };
  }
}

/**
 * Send fulfillment email to admin
 */
export async function sendFulfillmentEmail(orderData: OrderData) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ecomerwiliwonka.com';

  if (!resend || !process.env.RESEND_API_KEY) {
    console.log('📧 Fulfillment email simulation:', orderData);
    return { success: true, id: 'simulated_fulfillment_email_id' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Ecomer Wiliwonka <onboarding@resend.dev>',
      to: adminEmail,
      subject: `📦 Nueva Orden para Procesar #${orderData.orderId}`,
      html: generateFulfillmentEmail(orderData),
    });

    if (error) {
      console.error('❌ Error sending fulfillment email:', error);
      return { success: false, error };
    }

    console.log('✅ Fulfillment email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error sending fulfillment email:', error);
    return { success: false, error };
  }
}

/**
 * Send WhatsApp notification to distributor
 */
export async function sendWhatsAppNotification(orderData: OrderData, distributorPhone: string) {
  const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.log('📱 WhatsApp simulation (no credentials configured):', orderData);
    console.log('📱 Would send to:', distributorPhone);
    return { success: true, id: 'simulated_whatsapp_id' };
  }

  try {
    const message = `🧊 Nueva Orden!\n\n` +
      `Orden: #${orderData.orderId}\n` +
      `Productos:\n${orderData.items.map(item => `• ${item.product.name} x${item.quantity}`).join('\n')}\n\n` +
      `Total: $${orderData.total.toLocaleString()} COP\n` +
      `Cliente: ${orderData.customerEmail}\n\n` +
      `📦 ¡Haz clic para ver detalles!`;

    const result = await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${distributorPhone}`,
      body: message,
    });

    console.log('✅ WhatsApp notification sent:', result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('❌ Error sending WhatsApp:', error);
    return { success: false, error };
  }
}

/**
 * Generate HTML email for order confirmation (customer)
 */
function generateOrderConfirmationEmail(orderData: OrderData): string {
  const subtotalUsd = ((orderData.subtotal || 0) / 100).toFixed(2);
  const shippingUsd = ((orderData.shipping || 0) / 100).toFixed(2);
  const taxUsd = ((orderData.tax || 0) / 100).toFixed(2);
  const totalUsd = (orderData.total / 100).toFixed(2);
  
  const baseScanUrl = orderData.transactionHash 
    ? `https://sepolia.basescan.org/tx/${orderData.transactionHash}`
    : '#';

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Orbitron:wght@400;500;700;900&display=swap');
    body { 
      font-family: 'Space Mono', monospace; 
      background: #0c0c11; 
      color: #fff; 
      padding: 20px; 
      line-height: 1.6;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: rgba(20, 20, 20, 0.95); 
      border-radius: 12px; 
      overflow: hidden; 
      border: 2px solid #2d25ff;
      box-shadow: 0 0 20px rgba(45, 37, 255, 0.3);
    }
    .header { 
      background: linear-gradient(135deg, #2d25ff, #6e68ff); 
      padding: 40px 30px; 
      text-align: center; 
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px);
      pointer-events: none;
    }
    .header h1 {
      font-family: 'Orbitron', sans-serif;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-size: 28px;
      margin: 0;
      position: relative;
      z-index: 1;
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
    .content { padding: 30px; }
    .order-number { 
      background: rgba(45, 37, 255, 0.1); 
      border: 2px solid #2d25ff; 
      padding: 20px; 
      border-radius: 8px; 
      text-align: center; 
      margin-bottom: 20px;
      box-shadow: 0 0 15px rgba(45, 37, 255, 0.2);
    }
    .order-number strong {
      font-family: 'Orbitron', sans-serif;
      font-size: 20px;
      color: #2d25ff;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .info-section { 
      background: rgba(30, 30, 30, 0.5); 
      padding: 20px; 
      border-radius: 8px; 
      margin-bottom: 20px; 
      border: 1px solid rgba(45, 37, 255, 0.3);
      backdrop-filter: blur(10px);
    }
    .info-section h3 {
      font-family: 'Orbitron', sans-serif;
      color: #64b5f6;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 15px 0;
    }
    .product-list { margin: 20px 0; }
    .product-item { 
      display: flex; 
      align-items: center; 
      padding: 20px; 
      background: rgba(20, 20, 20, 0.8); 
      border-radius: 8px; 
      margin-bottom: 15px; 
      border: 1px solid rgba(45, 37, 255, 0.3);
      transition: all 0.3s ease;
    }
    .product-item:hover {
      border-color: #2d25ff;
      box-shadow: 0 0 15px rgba(45, 37, 255, 0.2);
    }
    .product-image { 
      width: 80px; 
      height: 80px; 
      object-fit: cover; 
      border-radius: 6px; 
      margin-right: 15px;
      border: 2px solid #2d25ff;
    }
    .product-details { flex: 1; }
    .product-name { 
      font-size: 16px; 
      font-weight: 700; 
      margin-bottom: 5px; 
      color: #fff;
    }
    .product-category { 
      font-size: 12px; 
      color: #8a92b2; 
      margin-bottom: 5px; 
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .product-price { 
      font-size: 14px; 
      color: #2d25ff; 
      font-weight: 700;
    }
    .total-section { 
      background: rgba(20, 20, 20, 0.8); 
      padding: 25px; 
      border-radius: 8px; 
      border: 2px solid rgba(45, 37, 255, 0.3);
    }
    .total-section h3 {
      font-family: 'Orbitron', sans-serif;
      color: #64b5f6;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 15px 0;
    }
    .total-row { 
      display: flex; 
      justify-content: space-between; 
      padding: 10px 0; 
      font-family: 'Space Mono', monospace;
    }
    .total-row.final { 
      border-top: 2px solid #2d25ff; 
      margin-top: 15px; 
      padding-top: 20px; 
      font-size: 28px; 
      font-weight: 700; 
      color: #2d25ff;
      font-family: 'Orbitron', sans-serif;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .transaction-link { 
      display: inline-block; 
      background: linear-gradient(135deg, #2d25ff, #6e68ff); 
      color: white; 
      padding: 12px 24px; 
      border-radius: 8px; 
      text-decoration: none; 
      margin-top: 15px; 
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(45, 37, 255, 0.3);
    }
    .transaction-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(45, 37, 255, 0.5);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧊 ¡Orden Confirmada!</h1>
    </div>
    <div class="content">
      <p>Hola <strong>${orderData.customerName || 'Cliente'}</strong>,</p>
      <p>Tu orden ha sido confirmada y está siendo procesada. Gracias por tu compra en Ecomer Wiliwonka! 🎉</p>
      
      <div class="order-number">
        <strong>🆔 Orden #${orderData.orderId}</strong>
      </div>

      <div class="info-section">
        <h3 style="margin-top: 0; margin-bottom: 15px;">📍 Información de Envío:</h3>
        ${orderData.shippingAddress ? `<p><strong>Dirección:</strong><br>${orderData.shippingAddress}</p>` : ''}
        ${orderData.customerPhone ? `<p><strong>Teléfono:</strong> ${orderData.customerPhone}</p>` : ''}
        <p><strong>Email:</strong> ${orderData.customerEmail}</p>
      </div>

      <h3>📦 Productos:</h3>
      <div class="product-list">
        ${orderData.items.map(item => {
          const itemPrice = (item.product.price / 100).toFixed(2);
          return `
          <div class="product-item">
            <img src="${item.product.image}" class="product-image" alt="${item.product.name}" />
            <div class="product-details">
              <div class="product-name">${item.product.name}</div>
              <div class="product-category">${item.product.category}</div>
              <div>Cantidad: <strong>${item.quantity}</strong></div>
              <div class="product-price">$${itemPrice} USD c/u</div>
            </div>
          </div>
        `}).join('')}
      </div>

      <div class="total-section">
        <h3 style="margin-top: 0; margin-bottom: 15px;">💰 Resumen de Pago:</h3>
        <div class="total-row">
          <span>Subtotal:</span>
          <span>$${subtotalUsd} USD</span>
        </div>
        <div class="total-row">
          <span>Envío:</span>
          <span>$${shippingUsd} USD</span>
        </div>
        <div class="total-row">
          <span>Impuestos:</span>
          <span>$${taxUsd} USD</span>
        </div>
        <div class="total-row final">
          <span>Total:</span>
          <span>$${totalUsd} USD</span>
        </div>
      </div>

      ${orderData.transactionHash ? `
      <p style="margin-top: 20px; text-align: center;">
        <a href="${baseScanUrl}" class="transaction-link" target="_blank">
          🔗 Ver Transacción en BaseScan
        </a>
      </p>
      ` : ''}

      <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #00d4ff50; text-align: center;">
        Te notificaremos cuando tu pedido esté en camino. 🚀<br>
        <small style="color: #888;">¿Preguntas? Escríbenos a info@ecomerwiliwonka.com</small>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate HTML email for fulfillment (admin/distributor)
 */
function generateFulfillmentEmail(orderData: OrderData): string {
  const subtotalUsd = ((orderData.subtotal || 0) / 100).toFixed(2);
  const shippingUsd = ((orderData.shipping || 0) / 100).toFixed(2);
  const taxUsd = ((orderData.tax || 0) / 100).toFixed(2);
  const totalUsd = (orderData.total / 100).toFixed(2);

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Orbitron:wght@400;500;700;900&display=swap');
    body { 
      font-family: 'Space Mono', monospace; 
      background: #0c0c11; 
      color: #fff; 
      padding: 20px; 
      line-height: 1.6;
    }
    .container { 
      max-width: 700px; 
      margin: 0 auto; 
      background: rgba(20, 20, 20, 0.95); 
      border-radius: 12px; 
      overflow: hidden; 
      border: 2px solid #2d25ff;
      box-shadow: 0 0 20px rgba(45, 37, 255, 0.3);
    }
    .header { 
      background: linear-gradient(135deg, #2d25ff, #6e68ff); 
      padding: 40px 30px; 
      text-align: center; 
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px);
      pointer-events: none;
    }
    .header h1 {
      font-family: 'Orbitron', sans-serif;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-size: 28px;
      margin: 0;
      position: relative;
      z-index: 1;
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
    .content { padding: 30px; }
    .urgency { 
      background: rgba(45, 37, 255, 0.1); 
      border: 2px solid #2d25ff; 
      padding: 20px; 
      border-radius: 8px; 
      margin: 20px 0; 
      text-align: center;
      box-shadow: 0 0 15px rgba(45, 37, 255, 0.2);
    }
    .urgency h2 {
      font-family: 'Orbitron', sans-serif;
      color: #2d25ff;
      margin: 0;
      font-size: 20px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .order-info { 
      background: rgba(45, 37, 255, 0.1); 
      border: 2px solid #2d25ff; 
      padding: 20px; 
      border-radius: 8px; 
      margin-bottom: 20px;
      box-shadow: 0 0 15px rgba(45, 37, 255, 0.2);
    }
    .order-info h2 {
      font-family: 'Orbitron', sans-serif;
      font-size: 22px;
      color: #2d25ff;
      margin: 0 0 15px 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .section-title { 
      font-family: 'Orbitron', sans-serif;
      color: #64b5f6; 
      font-size: 18px; 
      margin-top: 25px; 
      margin-bottom: 15px; 
      border-bottom: 2px solid #64b5f6; 
      padding-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .info-row { 
      display: flex; 
      justify-content: space-between; 
      padding: 10px 0; 
      border-bottom: 1px solid rgba(138, 146, 178, 0.3);
      font-family: 'Space Mono', monospace;
    }
    .info-row:last-child { border-bottom: none; }
    .product-list { margin: 20px 0; }
    .product-item { 
      padding: 20px; 
      background: rgba(20, 20, 20, 0.8); 
      border-radius: 8px; 
      margin-bottom: 15px; 
      border: 2px solid rgba(45, 37, 255, 0.3);
      transition: all 0.3s ease;
    }
    .product-item:hover {
      border-color: #2d25ff;
      box-shadow: 0 0 15px rgba(45, 37, 255, 0.2);
    }
    .product-header { display: flex; align-items: start; margin-bottom: 15px; }
    .product-image { 
      width: 80px; 
      height: 80px; 
      object-fit: cover; 
      border-radius: 6px; 
      margin-right: 15px;
      border: 2px solid #2d25ff;
    }
    .product-details { flex: 1; }
    .product-name { 
      font-family: 'Orbitron', sans-serif;
      font-size: 18px; 
      font-weight: 700; 
      color: #2d25ff; 
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .product-id { 
      font-size: 12px; 
      color: #8a92b2; 
      margin-bottom: 10px;
      font-family: 'Space Mono', monospace;
    }
    .product-description { 
      font-size: 14px; 
      color: #b0b0b0; 
      margin-bottom: 15px; 
      line-height: 1.5;
      font-family: 'Space Mono', monospace;
    }
    .product-specs { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 10px; 
      margin-top: 15px; 
    }
    .spec-item { 
      padding: 15px; 
      background: rgba(12, 12, 17, 0.8); 
      border-radius: 6px; 
      border: 1px solid rgba(45, 37, 255, 0.3);
    }
    .spec-label { 
      font-size: 11px; 
      color: #8a92b2; 
      margin-bottom: 5px;
      text-transform: uppercase;
      font-family: 'Orbitron', sans-serif;
      letter-spacing: 1px;
    }
    .spec-value { 
      font-size: 14px; 
      font-weight: 700; 
      color: #fff;
      font-family: 'Space Mono', monospace;
    }
    .urgency { background: rgba(45, 37, 255, 0.1); border: 2px solid #2d25ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛠️ NUEVA ORDEN PARA FABRICAR</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">Detalles completos de la orden</p>
    </div>
    <div class="content">
      <div class="urgency">
        <h2 style="margin: 0; color: #ff006e;">⚠️ PROCESAR URGENTEMENTE</h2>
      </div>

      <div class="order-info">
        <h2 style="margin-top: 0;">🆔 Orden #${orderData.orderId}</h2>
        ${orderData.transactionHash ? `<p><strong>Tx Hash:</strong> ${orderData.transactionHash}</p>` : ''}
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-CO')}</p>
      </div>

      <h3 class="section-title">👤 DATOS DEL CLIENTE</h3>
      <div style="background: #252525; padding: 15px; border-radius: 8px; border: 1px solid #ff006e50;">
        <div class="info-row">
          <span><strong>Nombre:</strong></span>
          <span>${orderData.customerName || 'No especificado'}</span>
        </div>
        <div class="info-row">
          <span><strong>Email:</strong></span>
          <span>${orderData.customerEmail}</span>
        </div>
        ${orderData.customerPhone ? `
        <div class="info-row">
          <span><strong>Teléfono:</strong></span>
          <span>${orderData.customerPhone}</span>
        </div>
        ` : ''}
        ${orderData.shippingAddress ? `
        <div class="info-row">
          <span><strong>Dirección de Envío:</strong></span>
          <span style="text-align: right; max-width: 300px;">${orderData.shippingAddress}</span>
        </div>
        ` : ''}
      </div>

      <h3 class="section-title">📦 PRODUCTOS A FABRICAR</h3>
      <div class="product-list">
        ${orderData.items.map(item => {
          const itemPrice = (item.product.price / 100).toFixed(2);
          const totalItemPrice = (item.product.price * item.quantity / 100).toFixed(2);
          return `
          <div class="product-item">
            <div class="product-header">
              <img src="${item.product.image}" class="product-image" alt="${item.product.name}" />
              <div class="product-details">
                <div class="product-name">${item.product.name}</div>
                <div class="product-id">ID: ${item.product.id}</div>
              </div>
            </div>
            <div class="product-description">${item.product.description}</div>
            <div class="product-specs">
              <div class="spec-item">
                <div class="spec-label">Cantidad a Fabricar</div>
                <div class="spec-value" style="color: #ff006e; font-size: 20px;">${item.quantity} unidades</div>
              </div>
              <div class="spec-item">
                <div class="spec-label">Categoría</div>
                <div class="spec-value">${item.product.category}</div>
              </div>
              <div class="spec-item">
                <div class="spec-label">Precio Unitario</div>
                <div class="spec-value">$${itemPrice} USD</div>
              </div>
              <div class="spec-item">
                <div class="spec-label">Subtotal</div>
                <div class="spec-value" style="color: #00d4ff;">$${totalItemPrice} USD</div>
              </div>
            </div>
          </div>
        `}).join('')}
      </div>

      <h3 class="section-title">💰 RESUMEN FINANCIERO</h3>
      <div style="background: rgba(20, 20, 20, 0.8); padding: 25px; border-radius: 8px; border: 2px solid rgba(255, 0, 255, 0.3);">
        <div class="info-row">
          <span>Subtotal:</span>
          <span>$${subtotalUsd} USD</span>
        </div>
        <div class="info-row">
          <span>Envío:</span>
          <span>$${shippingUsd} USD</span>
        </div>
        <div class="info-row">
          <span>Impuestos:</span>
          <span>$${taxUsd} USD</span>
        </div>
        <div class="info-row" style="border-top: 2px solid #2d25ff; margin-top: 15px; padding-top: 20px; font-size: 28px; font-weight: 700; color: #2d25ff; font-family: 'Orbitron', sans-serif; text-transform: uppercase; letter-spacing: 2px;">
          <span>TOTAL:</span>
          <span>$${totalUsd} USD</span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px; padding: 20px; background: rgba(45, 37, 255, 0.05); border-radius: 8px; border: 2px solid rgba(45, 37, 255, 0.3);">
        <p style="margin: 0; font-family: 'Orbitron', sans-serif; text-transform: uppercase; letter-spacing: 1px; font-size: 14px; color: #64b5f6;">
          <strong>⚠️ ACCIÓN REQUERIDA:</strong>
        </p>
        <p style="margin: 10px 0 0 0; font-size: 14px; color: #b0b0b0;">
          Por favor, verifica el inventario y procede con la fabricación de los productos solicitados.<br>
          Notifica al cliente una vez que el pedido esté listo para envío.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

