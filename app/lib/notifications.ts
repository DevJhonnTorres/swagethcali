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
  items: Array<{
    product: {
      name: string;
      image: string;
    };
    quantity: number;
  }>;
  total: number;
  shipping?: string;
  address?: string;
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
    .product-list { margin: 20px 0; }
    .product-item { display: flex; align-items: center; padding: 15px; background: #252525; border-radius: 8px; margin-bottom: 10px; border: 1px solid #00d4ff50; }
    .product-image { width: 60px; height: 60px; object-fit: cover; border-radius: 6px; margin-right: 15px; }
    .total { font-size: 24px; font-weight: bold; color: #00d4ff; text-align: center; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧊 ¡Orden Confirmada!</h1>
    </div>
    <div class="content">
      <p>Hola ${orderData.customerName || 'Cliente'},</p>
      <p>Tu orden ha sido confirmada y está siendo procesada.</p>
      
      <div class="order-number">
        <strong>Orden #${orderData.orderId}</strong>
      </div>

      <h3>📦 Productos:</h3>
      <div class="product-list">
        ${orderData.items.map(item => `
          <div class="product-item">
            <img src="${item.product.image}" class="product-image" alt="${item.product.name}" />
            <div>
              <strong>${item.product.name}</strong>
              <div>Cantidad: ${item.quantity}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="total">
        Total: $${orderData.total.toLocaleString()} COP
      </div>

      <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #00d4ff50;">
        Te notificaremos cuando tu pedido esté en camino. 🚀
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
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 12px; overflow: hidden; border: 2px solid #ff006e; }
    .header { background: linear-gradient(135deg, #ff006e, #9d4edd); padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .order-info { background: #ff006e20; border: 1px solid #ff006e; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .product-list { margin: 20px 0; }
    .product-item { padding: 15px; background: #252525; border-radius: 8px; margin-bottom: 10px; border: 1px solid #ff006e50; }
    .action-btn { display: inline-block; background: #ff006e; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Nueva Orden para Procesar</h1>
    </div>
    <div class="content">
      <div class="order-info">
        <h2>Orden #${orderData.orderId}</h2>
        <p><strong>Cliente:</strong> ${orderData.customerEmail}</p>
        <p><strong>Total:</strong> $${orderData.total.toLocaleString()} COP</p>
      </div>

      <h3>📋 Productos:</h3>
      <div class="product-list">
        ${orderData.items.map(item => `
          <div class="product-item">
            <strong>${item.product.name}</strong> - Cantidad: <strong>${item.quantity}</strong>
          </div>
        `).join('')}
      </div>

      <p style="margin-top: 30px;">Por favor, procesa esta orden lo antes posible.</p>
      
      <a href="https://app.supabase.com/project/keslnkqnhpylfszsahls/editor" class="action-btn">
        Ver Orden en Dashboard
      </a>
    </div>
  </div>
</body>
</html>
  `;
}

