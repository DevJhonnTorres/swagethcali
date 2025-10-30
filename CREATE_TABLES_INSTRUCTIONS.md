# 📝 Crear Tablas en Supabase

## Sigue estos pasos en el Dashboard de Supabase:

### 1. Ir al SQL Editor
- En tu proyecto Supabase: https://keslnkqnphypylfzssahls.supabase.co
- Haz clic en **"SQL Editor"** en el menú izquierdo

### 2. Crear nueva query
- Haz clic en **"New Query"**

### 3. Copiar y ejecutar el SQL
Copia el siguiente código SQL y pégalo en el editor:

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

### 4. Ejecutar
- Haz clic en **"Run"** (botón verde en la esquina inferior derecha)

### 5. Verificar
- Ve a **"Table Editor"** en el menú izquierdo
- Deberías ver las tablas:
  - ✅ `orders`
  - ✅ `payments`

## ✅ ¡Listo!

Una vez creadas las tablas, tu e-commerce guardará todas las órdenes y pagos en Supabase automáticamente.

## 🚀 Después de crear las tablas:

1. Reinicia el servidor de desarrollo:
   ```bash
   # Ctrl+C para detener
   npm run dev
   ```

2. Prueba el flujo completo:
   - Agrega productos al carrito
   - Ve a checkout
   - Haz clic en "Pagar con Base Pay"
   - Verifica en Supabase que se creó el registro
