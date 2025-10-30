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
    body { font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 12px; overflow: hidden; border: 2px solid #00d4ff; }
    .header { background: linear-gradient(135deg, #00d4ff, #9d4edd); padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .order-number { background: #00d4ff20; border: 1px solid #00d4ff; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
    .info-section { background: #252525; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #00d4ff50; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333; }
    .info-row:last-child { border-bottom: none; }
    .product-list { margin: 20px 0; }
    .product-item { display: flex; align-items: center; padding: 15px; background: #252525; border-radius: 8px; margin-bottom: 10px; border: 1px solid #00d4ff50; }
    .product-image { width: 80px; height: 80px; object-fit: cover; border-radius: 6px; margin-right: 15px; }
    .product-details { flex: 1; }
    .product-name { font-size: 16px; font-weight: bold; margin-bottom: 5px; }
    .product-category { font-size: 12px; color: #888; margin-bottom: 5px; }
    .product-price { font-size: 14px; color: #00d4ff; }
    .total-section { background: #252525; padding: 20px; border-radius: 8px; border: 1px solid #00d4ff50; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .total-row.final { border-top: 2px solid #00d4ff; margin-top: 10px; padding-top: 15px; font-size: 24px; font-weight: bold; color: #00d4ff; }
    .transaction-link { display: inline-block; background: #00d4ff; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; margin-top: 15px; }
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
    body { font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; padding: 20px; }
    .container { max-width: 700px; margin: 0 auto; background: #1a1a1a; border-radius: 12px; overflow: hidden; border: 2px solid #ff006e; }
    .header { background: linear-gradient(135deg, #ff006e, #9d4edd); padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .order-info { background: #ff006e20; border: 1px solid #ff006e; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .section-title { color: #ff006e; font-size: 18px; margin-top: 25px; margin-bottom: 15px; border-bottom: 2px solid #ff006e; padding-bottom: 8px; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333; }
    .info-row:last-child { border-bottom: none; }
    .product-list { margin: 20px 0; }
    .product-item { padding: 20px; background: #252525; border-radius: 8px; margin-bottom: 15px; border: 2px solid #ff006e50; }
    .product-header { display: flex; align-items: start; margin-bottom: 15px; }
    .product-image { width: 80px; height: 80px; object-fit: cover; border-radius: 6px; margin-right: 15px; }
    .product-details { flex: 1; }
    .product-name { font-size: 18px; font-weight: bold; color: #ff006e; margin-bottom: 5px; }
    .product-id { font-size: 12px; color: #888; margin-bottom: 10px; }
    .product-description { font-size: 14px; color: #ccc; margin-bottom: 15px; line-height: 1.5; }
    .product-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px; }
    .spec-item { padding: 10px; background: #1a1a1a; border-radius: 6px; border: 1px solid #333; }
    .spec-label { font-size: 11px; color: #888; margin-bottom: 5px; }
    .spec-value { font-size: 14px; font-weight: bold; color: #fff; }
    .action-btn { display: inline-block; background: #ff006e; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; margin-top: 20px; font-weight: bold; }
    .urgency { background: #ff006e20; border: 2px solid #ff006e; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
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
      <div style="background: #252525; padding: 20px; border-radius: 8px; border: 1px solid #ff006e50;">
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
        <div class="info-row" style="border-top: 2px solid #ff006e; margin-top: 10px; padding-top: 15px; font-size: 24px; font-weight: bold; color: #ff006e;">
          <span>TOTAL:</span>
          <span>$${totalUsd} USD</span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://app.supabase.com/project/keslnkqnhpylfszsahls/editor" class="action-btn">
          📊 Ver en Dashboard de Supabase
        </a>
      </div>

      <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #ff006e50; text-align: center;">
        <strong>⚠️ ACCIÓN REQUERIDA:</strong><br>
        Por favor, verifica el inventario y procede con la fabricación de los productos solicitados.<br>
        Notifica al cliente una vez que el pedido esté listo para envío.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

