import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { sendOrderConfirmationEmail, sendFulfillmentEmail, sendWhatsAppNotification } from '@/app/lib/notifications';

/**
 * API Route to confirm payment status
 * This endpoint is called by the frontend after receiving the transaction ID
 * 
 * POST /api/payments/confirm
 * Body: { orderId: string, paymentId: string, transactionHash: string, orderData: any }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentId, transactionHash, orderData } = body;

    // Update payment status in Supabase (if configured)
    if (supabase) {
      try {
        const { error: paymentError } = await supabase
          .from('payments')
          .update({
            status: 'completed',
            transaction_hash: transactionHash,
            completed_at: new Date().toISOString(),
          })
          .eq('payment_id', paymentId);

        if (paymentError) {
          console.warn('⚠️ Warning: Could not update payment in Supabase:', paymentError);
        }

        // Update order status in Supabase
        const { error: orderError } = await supabase
          .from('orders')
          .update({
            status: 'completed',
            transaction_hash: transactionHash,
            completed_at: new Date().toISOString(),
          })
          .eq('order_id', orderId);

        if (orderError) {
          console.warn('⚠️ Warning: Could not update order in Supabase:', orderError);
        }
      } catch (dbError) {
        console.warn('⚠️ Warning: Database not available, continuing without persistence:', dbError);
      }
    } else {
      console.log('ℹ️ Supabase not configured, skipping database update');
    }

    console.log('✅ Payment and order confirmed:', {
      orderId,
      paymentId,
      transactionHash,
      status: 'completed',
      timestamp: new Date().toISOString(),
    });

    // Send notifications
    if (orderData) {
      try {
        console.log('📧 Sending notifications...');
        
        // Send confirmation email to customer
        const emailResult = await sendOrderConfirmationEmail({
          orderId,
          customerEmail: orderData.customerEmail || 'customer@example.com',
          customerName: orderData.customerName,
          items: orderData.items || [],
          total: orderData.total || 0,
        });
        
        console.log('📧 Email sent:', emailResult.success);

        // Send fulfillment email to admin
        const fulfillmentResult = await sendFulfillmentEmail({
          orderId,
          customerEmail: orderData.customerEmail || 'customer@example.com',
          customerName: orderData.customerName,
          items: orderData.items || [],
          total: orderData.total || 0,
        });
        
        console.log('📧 Fulfillment email sent:', fulfillmentResult.success);

        // Send WhatsApp to distributor
        const distributorPhone = process.env.DISTRIBUTOR_WHATSAPP || '+573001234567';
        const whatsappResult = await sendWhatsAppNotification(
          {
            orderId,
            customerEmail: orderData.customerEmail || 'customer@example.com',
            customerName: orderData.customerName,
            items: orderData.items || [],
            total: orderData.total || 0,
          },
          distributorPhone
        );
        
        console.log('📱 WhatsApp sent:', whatsappResult.success);

      } catch (error) {
        console.error('⚠️ Error sending notifications:', error);
        // Continue even if notifications fail
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      status: 'completed',
      transactionHash,
    }, { status: 200 });
  } catch (error) {
    console.error('❌ Error confirming payment:', error);
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}

