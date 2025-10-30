/**
 * Script para crear las tablas en Supabase
 * Ejecuta: node create-tables.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Falta NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('🚀 Creando tablas en Supabase...\n');

  // SQL to create tables
  const sql = `
    -- Create orders table
    CREATE TABLE IF NOT EXISTS orders (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      order_id TEXT UNIQUE NOT NULL,
      customer_id TEXT,
      amount_usd DECIMAL(10,2) NOT NULL,
      amount_cop INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'expired')),
      items JSONB NOT NULL DEFAULT '[]',
      payment_id TEXT,
      transaction_hash TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      completed_at TIMESTAMP WITH TIME ZONE
    );

    -- Create payments table
    CREATE TABLE IF NOT EXISTS payments (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      payment_id TEXT UNIQUE NOT NULL,
      order_id TEXT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
      amount TEXT NOT NULL,
      to_address TEXT NOT NULL,
      testnet BOOLEAN DEFAULT false,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
      transaction_hash TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      completed_at TIMESTAMP WITH TIME ZONE
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
    CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON payments(payment_id);
    CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
    CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

    -- Create function to update updated_at
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $func$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;

    -- Create triggers
    DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
    CREATE TRIGGER update_orders_updated_at 
      BEFORE UPDATE ON orders
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
    CREATE TRIGGER update_payments_updated_at 
      BEFORE UPDATE ON payments
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();

    -- Enable RLS
    ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
    ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

    -- Create policies
    DROP POLICY IF EXISTS "Allow all operations on orders" ON orders;
    CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow all operations on payments" ON payments;
    CREATE POLICY "Allow all operations on payments" ON payments FOR ALL USING (true) WITH CHECK (true);
  `;

  try {
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // If exec_sql doesn't exist, try to execute via REST API
      console.log('ℹ️ Intentando método alternativo...\n');
      
      // We'll need to use the raw Postgres API or SQL editor
      console.log('📋 Por favor, copia este SQL y ejecútalo en el SQL Editor de Supabase:\n');
      console.log(sql);
      return;
    }

    console.log('✅ ¡Tablas creadas exitosamente!\n');
    
    // Verify tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (!tablesError && tables) {
      console.log('📊 Tablas disponibles:');
      tables.forEach(table => {
        console.log(`   ✓ ${table.table_name}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTables();

