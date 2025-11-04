import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import * as crypto from 'crypto';
import { sendOrderConfirmationEmail, sendFulfillmentEmail, sendWhatsAppNotification } from '@/app/lib/notifications';

/**
 * Wompi Webhook Handler
 * POST /api/wompi/webhook
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    // Verify webhook signature
    const signature = request.headers.get('x-wompi-signature') || '';
    const secret = process.env.WOMPI_WEBHOOK_SECRET!;
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Handle payment events
    if (event === 'transaction.updated' || event === 'payment.accepted') {
      const transaction = data.transaction || data;
      const reference = transaction.reference || transaction.id;

      console.log('✅ Wompi transaction completed:', {
        reference,
        status: transaction.status,
        amount: transaction.amount_in_cents,
      });

      // Find order by reference
      if (!supabase) {
        console.error('❌ Supabase not configured');
        return NextResponse.json(
          { error: 'Database not configured' },
          { status: 500 }
        );
      }

      const { data: payment } = await supabase
        .from('payments')
        .select('order_id')
        .eq('external_payment_id', reference)
        .single();

      if (payment && transaction.status === 'APPROVED') {
        const orderId = payment.order_id;

        // Update payment status
        await supabase
          .from('payments')
          .update({
            status: 'completed',
            transaction_hash: transaction.id,
            completed_at: new Date().toISOString(),
          })
          .eq('external_payment_id', reference);

        // Update order status
        const { data: orderData } = await supabase
          .from('orders')
          .update({
            status: 'completed',
            transaction_hash: transaction.id,
            completed_at: new Date().toISOString(),
          })
          .eq('order_id', orderId)
          .select()
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
              total: orderData.amount_usd * 100,
              subtotal: orderData.amount_usd * 100,
              shipping: 0,
              tax: 0,
              transactionHash: transaction.id,
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
              transactionHash: transaction.id,
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
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Error processing Wompi webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

