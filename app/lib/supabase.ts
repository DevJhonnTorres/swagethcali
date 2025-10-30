import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only create Supabase client if both URL and key are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types
export interface Order {
  id: string;
  order_id: string;
  customer_id?: string;
  amount_usd: number;
  amount_cop: number;
  status: 'pending' | 'completed' | 'failed' | 'expired';
  items: any[];
  created_at: string;
  updated_at: string;
  payment_id?: string;
  transaction_hash?: string;
  completed_at?: string;
}

export interface Payment {
  id: string;
  payment_id: string;
  order_id: string;
  amount: string;
  to_address: string;
  testnet: boolean;
  status: 'pending' | 'completed' | 'failed';
  transaction_hash?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}
