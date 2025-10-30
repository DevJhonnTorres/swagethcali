import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

/**
 * API Route to initiate Base Pay payment and create order
 * This would normally use the @base-org/account SDK
 * 
 * POST /api/base-pay/initiate
 * Body: { amount: string, to: string, customerId?: string, items: any[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, to, testnet, customerId, items, amountCop } = body;

    // Generate order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate payment ID
    const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Save order to Supabase (if configured)
    if (supabase) {
      try {
        const { error: orderError } = await supabase
          .from('orders')
          .insert({
            order_id: orderId,
            customer_id: customerId,
            amount_usd: parseFloat(amount),
            amount_cop: amountCop || 0,
            status: 'pending',
            items: items || [],
            payment_id: paymentId,
          });

        if (orderError) {
          console.warn('⚠️ Warning: Could not save order to Supabase:', orderError);
        }

        // Save payment to Supabase
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            payment_id: paymentId,
            order_id: orderId,
            amount: amount,
            to_address: to,
            testnet: testnet || false,
            status: 'pending',
          });

        if (paymentError) {
          console.warn('⚠️ Warning: Could not save payment to Supabase:', paymentError);
        }
      } catch (dbError) {
        console.warn('⚠️ Warning: Database not configured, continuing without persistence:', dbError);
      }
    } else {
      console.log('ℹ️ Supabase not configured, skipping database save');
    }

    console.log('📝 Order and payment created:', {
      orderId,
      paymentId,
      amount,
      to,
      customerId,
      itemCount: items?.length || 0,
      status: 'pending',
      timestamp: new Date().toISOString(),
    });

    // In production, this would call the Base Account SDK
    // For now, we'll return a simulated payment response
    const payment = {
      id: paymentId,
      orderId,
      status: 'pending',
      amount,
      to,
      testnet,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(payment, { status: 200 });
  } catch (error) {
    console.error('❌ Error initiating payment:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}

