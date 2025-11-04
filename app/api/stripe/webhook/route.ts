import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/app/lib/supabase';
import { sendOrderConfirmationEmail, sendFulfillmentEmail, sendWhatsAppNotification } from '@/app/lib/notifications';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

/**
 * Stripe Webhook Handler
 * POST /api/stripe/webhook
 */
export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature')!;
  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;
    const paymentId = paymentIntent.metadata.paymentId;

    console.log('✅ Payment Intent succeeded:', {
      paymentIntentId: paymentIntent.id,
      orderId,
      paymentId,
    });

    // Update payment status in Supabase
    if (supabase) {
      try {
        const { error: paymentError } = await supabase
          .from('payments')
          .update({
            status: 'completed',
            transaction_hash: paymentIntent.id,
            completed_at: new Date().toISOString(),
          })
          .eq('external_payment_id', paymentIntent.id);

        if (paymentError) {
          console.error('❌ Error updating payment:', paymentError);
        }

        // Update order status
        const { error: orderError } = await supabase
          .from('orders')
          .update({
            status: 'completed',
            transaction_hash: paymentIntent.id,
            completed_at: new Date().toISOString(),
          })
          .eq('order_id', orderId);

        if (orderError) {
          console.error('❌ Error updating order:', orderError);
        }

        // Get order data for notifications
        const { data: orderData } = await supabase
          .from('orders')
          .select('*')
          .eq('order_id', orderId)
          .single();

        if (orderData) {
          // Send notifications
          try {
            await sendOrderConfirmationEmail({
              orderId,
              customerEmail: orderData.customer_email || '',
              customerName: orderData.customer_name,
              customerPhone: orderData.customer_phone,
              shippingAddress: `${orderData.shipping_address}, ${orderData.shipping_city}, ${orderData.shipping_country}`,
              items: orderData.items || [],
              total: orderData.amount_usd * 100, // Convert to cents
              subtotal: orderData.amount_usd * 100,
              shipping: 0,
              tax: 0,
              transactionHash: paymentIntent.id,
            });

            await sendFulfillmentEmail({
              orderId,
              customerEmail: orderData.customer_email || '',
              customerName: orderData.customer_name,
              customerPhone: orderData.customer_phone,
              shippingAddress: `${orderData.shipping_address}, ${orderData.shipping_city}, ${orderData.shipping_country}`,
              items: orderData.items || [],
              total: orderData.amount_usd * 100,
              subtotal: orderData.amount_usd * 100,
              shipping: 0,
              tax: 0,
              transactionHash: paymentIntent.id,
            });

            const distributorPhone = process.env.DISTRIBUTOR_WHATSAPP || '+573001234567';
            await sendWhatsAppNotification(
              {
                orderId,
                customerEmail: orderData.customer_email || '',
                customerName: orderData.customer_name,
                items: orderData.items || [],
                total: orderData.amount_usd * 100,
              },
              distributorPhone
            );
          } catch (notifError) {
            console.error('⚠️ Error sending notifications:', notifError);
          }
        }
      } catch (dbError) {
        console.error('❌ Database error:', dbError);
      }
    }
  }

  return NextResponse.json({ received: true });
}

