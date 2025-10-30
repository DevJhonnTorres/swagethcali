# 🎯 Crea las Tablas Ahora (2 minutos)

## ✅ Conexión Exitosa con Supabase!

Tu proyecto ya está conectado. Solo falta crear las tablas.

## 📝 Pasos (SOLO HAZ ESTO):

### 1. Abre el SQL Editor
Ve a: **https://app.supabase.com/project/keslnkqnhpylfszsahls/sql**

### 2. Haz clic en "New Query"

### 3. Copia TODO esto y pégalo:

```sql
-- Create orders table
CREATE TABLE orders (
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
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id TEXT UNIQUE NOT NULL,
  order_id TEXT NOT NULL REFERENCES orders(order_id),
  amount TEXT NOT NULL,
  to_address TEXT NOT NULL,
  testnet BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  transaction_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_orders_order_id ON orders(order_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_payments_payment_id ON payments(payment_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth requirements)
-- For now, allow all operations (you can restrict later)
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all operations on payments" ON payments FOR ALL USING (true);
```

### 4. Haz clic en "Run" (botón verde)

### 5. Verifica
Ve a **Table Editor** (menú izquierdo) y deberías ver:
- ✅ `orders`
- ✅ `payments`

## 🚀 ¡Listo!

Después de crear las tablas, reinicia el servidor:

```bash
# Ctrl+C para detener
npm run dev
```

Y luego prueba:
1. Agrega productos al carrito
2. Ve a checkout
3. Haz clic en "Pagar con Base Pay"
4. Ve a Table Editor → orders para ver tu orden! 🎉

