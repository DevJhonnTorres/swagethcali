-- Migration: Add payment methods and shipping data
-- Run this in Supabase SQL Editor

-- Add payment_method to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('base_pay', 'stripe', 'wompi'));

-- Add shipping information to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_address TEXT,
ADD COLUMN IF NOT EXISTS shipping_city TEXT,
ADD COLUMN IF NOT EXISTS shipping_country TEXT,
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Add payment_method to payments table
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('base_pay', 'stripe', 'wompi'));

-- Add payment_link for Stripe/Wompi
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS payment_link TEXT;

-- Add external_payment_id for Stripe Payment Intent ID or Wompi Transaction ID
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS external_payment_id TEXT;

-- Create index for payment_method
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);
CREATE INDEX IF NOT EXISTS idx_payments_payment_method ON payments(payment_method);
CREATE INDEX IF NOT EXISTS idx_payments_external_payment_id ON payments(external_payment_id);

-- Update existing records to have base_pay as default
UPDATE orders SET payment_method = 'base_pay' WHERE payment_method IS NULL;
UPDATE payments SET payment_method = 'base_pay' WHERE payment_method IS NULL;

