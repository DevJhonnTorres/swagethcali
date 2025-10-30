/**
 * Script para crear tablas en Supabase programáticamente
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('🚀 Creando tablas en Supabase...\n');

  // Create orders table using REST API
  console.log('1. Creando tabla orders...');
  const { data: ordersTable, error: ordersError } = await supabase.rpc('exec_sql', {
    query: `
      CREATE TABLE IF NOT EXISTS orders (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        order_id TEXT UNIQUE NOT NULL,
        customer_id TEXT,
        amount_usd DECIMAL(10,2) NOT NULL,
        amount_cop INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        items JSONB NOT NULL DEFAULT '[]',
        payment_id TEXT,
        transaction_hash TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP WITH TIME ZONE
      );
    `
  });

  if (ordersError) {
    console.log('⚠️ No se pudo crear automáticamente.');
    console.log('\n📋 Por favor, ejecuta manualmente el SQL en Supabase:\n');
    console.log('1. Ve a: https://app.supabase.com/project/keslnkqnhpylfszsahls');
    console.log('2. Ve a SQL Editor');
    console.log('3. Copia y pega el contenido de supabase-schema.sql');
    console.log('4. Ejecuta el SQL\n');
    return;
  }

  console.log('✅ Tablas creadas!\n');
}

// Try to create via REST API first
createTables().catch(() => {
  console.log('\n📝 Ejecuta manualmente el SQL:\n');
  console.log('1. https://app.supabase.com/project/keslnkqnhpylfszsahls/sql');
  console.log('2. New Query');
  console.log('3. Copia supabase-schema.sql');
  console.log('4. Run\n');
});

