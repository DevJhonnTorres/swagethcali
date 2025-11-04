import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/app/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

/**
 * Create Stripe Payment Intent
 * POST /api/stripe/create-payment-intent
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'usd', metadata, items, customerInfo } = body;

    // Generate order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate amounts in cents
    const amountInCents = Math.round(amount * 100);
    const amountCop = Math.round(amount * 4200); // Approximate USD to COP conversion

    // Save order to Supabase first
    if (supabase) {
      try {
        const { error: orderError } = await supabase
          .from('orders')
          .insert({
            order_id: orderId,
            customer_id: null,
            amount_usd: amount,
            amount_cop: amountCop,
            status: 'pending',
            items: items || [],
            payment_id: paymentId,
            payment_method: 'stripe',
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

        // Create payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency,
          metadata: {
            orderId,
            paymentId,
            ...metadata,
          },
          automatic_payment_methods: {
            enabled: true,
          },
        });

        // Save payment to Supabase
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            payment_id: paymentId,
            order_id: orderId,
            amount: amount.toString(),
            to_address: '', // Stripe doesn't use addresses
            testnet: false,
            status: 'pending',
            payment_method: 'stripe',
            payment_link: paymentIntent.latest_charge || null,
            external_payment_id: paymentIntent.id,
          });

        if (paymentError) {
          console.warn('⚠️ Warning: Could not save payment to Supabase:', paymentError);
        }

        return NextResponse.json({
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          orderId,
          paymentId,
        });
      } catch (dbError) {
        console.error('❌ Database error:', dbError);
        return NextResponse.json(
          { error: 'Failed to create payment intent' },
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
    console.error('❌ Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

