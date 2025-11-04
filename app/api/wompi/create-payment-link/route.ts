import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import * as crypto from 'crypto';

/**
 * Create Wompi Payment Link
 * POST /api/wompi/create-payment-link
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'COP', items, customerInfo } = body;

    // Generate order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Convert USD to COP (approximate)
    const amountCop = Math.round(amount * 4200);
    const amountUsd = amount;

    // Save order to Supabase first
    if (supabase) {
      try {
        const { error: orderError } = await supabase
          .from('orders')
          .insert({
            order_id: orderId,
            customer_id: null,
            amount_usd: amountUsd,
            amount_cop: amountCop,
            status: 'pending',
            items: items || [],
            payment_id: paymentId,
            payment_method: 'wompi',
            customer_name: customerInfo?.name,
            customer_email: customerInfo?.email,
            customer_phone: customerInfo?.phone,
            shipping_address: customerInfo?.address,
            shipping_city: customerInfo?.city,
            shipping_country: customerInfo?.country,
          });

        if (orderError) {
          console.warn('⚠️ Warning: Could not save order to Supabase:', orderError);
        }

        // Create Wompi payment link
        const wompiPublicKey = process.env.WOMPI_PUBLIC_KEY!;
        const wompiPrivateKey = process.env.WOMPI_PRIVATE_KEY!;
        const wompiEnv = process.env.WOMPI_ENV || 'sandbox'; // sandbox or production
        const wompiUrl = wompiEnv === 'production' 
          ? 'https://production.wompi.co/v1' 
          : 'https://sandbox.wompi.co/v1';

        // Create payment reference
        const reference = `ETHCALI_${orderId}`;

        // Create integrity signature
        const integrityString = `${wompiPublicKey}~${wompiPrivateKey}~${reference}~${amountCop}~COP`;
        const integrity = crypto.createHash('sha256').update(integrityString).digest('hex');

        // Create payment link request
        const paymentLinkData = {
          name: `Orden ETH Cali Swag #${orderId}`,
          description: `${items?.length || 0} producto(s)`,
          singleUse: true,
          collectShipping: false,
          expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          currency: 'COP',
          amountInCents: amountCop,
          redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order-confirmation?orderId=${orderId}`,
          reference,
          integrity,
        };

        // Call Wompi API to create payment link
        const wompiResponse = await fetch(`${wompiUrl}/payment_links`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${wompiPrivateKey}`,
          },
          body: JSON.stringify(paymentLinkData),
        });

        if (!wompiResponse.ok) {
          const errorData = await wompiResponse.json();
          throw new Error(`Wompi API error: ${JSON.stringify(errorData)}`);
        }

        const wompiData = await wompiResponse.json();
        const paymentLink = wompiData.data?.permalink || wompiData.permalink;

        // Save payment to Supabase
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            payment_id: paymentId,
            order_id: orderId,
            amount: amountCop.toString(),
            to_address: '', // Wompi doesn't use addresses
            testnet: wompiEnv === 'sandbox',
            status: 'pending',
            payment_method: 'wompi',
            payment_link: paymentLink,
            external_payment_id: reference,
          });

        if (paymentError) {
          console.warn('⚠️ Warning: Could not save payment to Supabase:', paymentError);
        }

        return NextResponse.json({
          paymentLink,
          orderId,
          paymentId,
          reference,
        });
      } catch (dbError) {
        console.error('❌ Database/Wompi error:', dbError);
        return NextResponse.json(
          { error: 'Failed to create payment link', details: dbError instanceof Error ? dbError.message : 'Unknown error' },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Error creating Wompi payment link:', error);
    return NextResponse.json(
      { error: 'Failed to create payment link', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

