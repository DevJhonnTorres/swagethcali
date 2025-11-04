# 📝 Guía Rápida: Ejecutar Migración SQL en Supabase

## 🚀 Pasos (2 minutos)

### 1. Abre Supabase Dashboard
- Ve a: https://app.supabase.com
- Inicia sesión
- Selecciona tu proyecto

### 2. Ve al SQL Editor
- En el menú izquierdo, haz clic en **"SQL Editor"** (ícono de base de datos con `</>`)

### 3. Crea Nueva Query
- Haz clic en **"New Query"** o el botón **"+"**

### 4. Copia y Pega el SQL
Copia TODO este código y pégalo en el editor:

```sql
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
```

### 5. Ejecuta la Query
- Haz clic en **"Run"** (botón verde) o presiona:
  - Mac: `Cmd + Enter`
  - Windows/Linux: `Ctrl + Enter`

### 6. Verifica el Éxito
- Deberías ver: ✅ "Success. No rows returned" o similar
- Si hay errores, aparecerán en rojo

---

## ✅ Verificación

### Opción 1: Ver en Table Editor
1. Ve a **"Table Editor"** en el menú izquierdo
2. Abre la tabla **`orders`**
3. Verifica que aparezcan las nuevas columnas:
   - ✅ `payment_method`
   - ✅ `shipping_address`, `shipping_city`, `shipping_country`
   - ✅ `customer_name`, `customer_email`, `customer_phone`
4. Abre la tabla **`payments`**
5. Verifica que aparezcan:
   - ✅ `payment_method`
   - ✅ `payment_link`
   - ✅ `external_payment_id`

### Opción 2: Query de Verificación
Ejecuta esto en el SQL Editor:

```sql
-- Verificar columnas en orders
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('payment_method', 'shipping_address', 'customer_name');

-- Verificar columnas en payments
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'payments' 
AND column_name IN ('payment_method', 'payment_link', 'external_payment_id');
```

---

## 🆘 Si hay Errores

### Error: "column already exists"
- ✅ **Está bien** - Significa que ya ejecutaste la migración antes
- Los `IF NOT EXISTS` evitan errores por duplicados

### Error: "table does not exist"
- ⚠️ Primero crea las tablas ejecutando `supabase-schema.sql`

### Error: "permission denied"
- ⚠️ Verifica que estés usando la cuenta correcta del proyecto
- Usa el SQL Editor, no necesitas permisos especiales

---

## 📸 Screenshot de Referencia

El SQL Editor se ve así:
```
┌─────────────────────────────────────┐
│ SQL Editor                    [New] │
├─────────────────────────────────────┤
│                                     │
│  [Aquí pegas el SQL]                │
│                                     │
│                                     │
├─────────────────────────────────────┤
│                          [Run] [▶] │
└─────────────────────────────────────┘
```

---

## ✅ ¡Listo!

Una vez ejecutado, tu base de datos estará lista para los 3 métodos de pago:
- ✅ Base Pay
- ✅ Stripe  
- ✅ Wompi

Ahora puedes configurar las variables de entorno y probar los pagos.

