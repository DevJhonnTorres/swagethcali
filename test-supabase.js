/**
 * Script para verificar conexión con Supabase
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Verificando configuración...\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NO CONFIGURADA\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Falta configuración en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n🧪 Probando conexión...\n');
    
    // Try to list tables
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .limit(1);

    if (error && error.message.includes('relation') || error.message.includes('does not exist')) {
      console.log('✅ Conectado a Supabase');
      console.log('ℹ️ Las tablas aún no existen - necesitas crearlas\n');
      console.log('Por favor, ejecuta el SQL del archivo supabase-schema.sql en el SQL Editor de Supabase\n');
      return;
    }

    if (error) {
      console.error('❌ Error de conexión:', error.message);
      return;
    }

    console.log('✅ ¡Conexión exitosa!');
    console.log('✅ Tablas encontradas\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection();

