# ✅ Sistema de Métodos de Pago Implementado

## 🎯 Lo que se ha creado

### 1. **Migración de Base de Datos** ✅
- Archivo: `supabase-migration-payment-methods.sql`
- Agrega campos para métodos de pago y datos de envío
- **EJECUTAR PRIMERO** en Supabase SQL Editor

### 2. **Rutas API para Stripe** ✅
- `/api/stripe/create-payment-intent` - Crea Payment Intent y guarda orden
- `/api/stripe/webhook` - Recibe confirmaciones de Stripe

### 3. **Rutas API para Wompi** ✅
- `/api/wompi/create-payment-link` - Genera link de pago y guarda orden
- `/api/wompi/webhook` - Recibe confirmaciones de Wompi

### 4. **Actualización de Base Pay** ✅
- Ahora guarda datos de envío desde el inicio
- Actualizado `/api/base-pay/initiate` para aceptar `customerInfo`

### 5. **Actualización de Confirmación** ✅
- `/api/payments/confirm` ahora guarda datos de envío al confirmar

---

## 📍 Dónde se guardan los datos

### **Datos de Envío** (Todos los métodos)

Se guardan en la tabla `orders`:

```sql
customer_name       TEXT
customer_email      TEXT
customer_phone      TEXT
shipping_address    TEXT
shipping_city       TEXT
shipping_country    TEXT
```

### **Datos de Pago** (Por método)

#### Base Pay (USDC):
```sql
payment_method: 'base_pay'
to_address: Wallet address (ej: 0x39a13ccd07ebb9bd6d68bb2849453e8c713d816e)
transaction_hash: Tx hash de Base
external_payment_id: Mismo que transaction_hash
payment_link: NULL
```

#### Stripe (USD):
```sql
payment_method: 'stripe'
to_address: "" (vacío)
transaction_hash: Payment Intent ID (ej: pi_1234567890)
external_payment_id: Payment Intent ID
payment_link: NULL
```

#### Wompi (COP):
```sql
payment_method: 'wompi'
to_address: "" (vacío)
transaction_hash: Transaction ID de Wompi
external_payment_id: Reference (ej: ETHCALI_order_1234567890_abc123)
payment_link: URL completa (ej: https://checkout.wompi.co/l/xyz123)
```

---

## 🔗 Links de Pago

### Base Pay
- ❌ **No hay link** - Se usa SDK directamente en frontend

### Stripe
- ❌ **No hay link** - Se usa Stripe Elements en checkout

### Wompi
- ✅ **Sí hay link** - Se genera en `/api/wompi/create-payment-link`
- Se guarda en `payments.payment_link`
- Usuario es redirigido a este link para pagar

---

## 🚀 Próximos Pasos

### 1. Ejecutar Migración SQL
```sql
-- Ve a Supabase Dashboard → SQL Editor
-- Copia y ejecuta: supabase-migration-payment-methods.sql
```

### 2. Configurar Variables de Entorno

Agrega estas variables a `.env.local` y Vercel:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Wompi
WOMPI_PUBLIC_KEY=pub_test_...
WOMPI_PRIVATE_KEY=prv_test_...
WOMPI_WEBHOOK_SECRET=tu_secret
WOMPI_ENV=sandbox

# App URL
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

### 3. Configurar Webhooks

**Stripe:**
1. Ve a Stripe Dashboard → Webhooks
2. Agrega endpoint: `https://tu-dominio.com/api/stripe/webhook`
3. Selecciona evento: `payment_intent.succeeded`
4. Copia el `webhook_secret`

**Wompi:**
1. Ve a Wompi Dashboard → Webhooks
2. Agrega endpoint: `https://tu-dominio.com/api/wompi/webhook`
3. Selecciona eventos: `transaction.updated`, `payment.accepted`

### 4. Instalar Dependencias

```bash
npm install stripe
```

### 5. Actualizar Checkout (Pendiente)

El checkout actual solo tiene Base Pay implementado. Falta:
- Agregar opción de Stripe
- Agregar opción de Wompi
- Implementar formularios de pago para cada método

---

## 📊 Ejemplo de Datos en BD

### Orden con Base Pay:

```json
{
  "order_id": "order_1761780325228_rhnzgr9pq",
  "payment_method": "base_pay",
  "amount_usd": "19.35",
  "amount_cop": 150000,
  "status": "completed",
  "customer_name": "Juan Pérez",
  "customer_email": "juan@example.com",
  "customer_phone": "+573001234567",
  "shipping_address": "Calle 123 #45-67",
  "shipping_city": "Cali",
  "shipping_country": "Colombia",
  "items": "[{...}]",
  "transaction_hash": "0x53351ef6238c9..."
}
```

### Pago con Base Pay:

```json
{
  "payment_id": "payment_1761780325228_xs9aaw1lv",
  "order_id": "order_1761780325228_rhnzgr9pq",
  "payment_method": "base_pay",
  "amount": "19.35",
  "to_address": "0x39a13ccd07ebb9bd6d68bb2849453e8c713d816e",
  "status": "completed",
  "transaction_hash": "0x53351ef6238c9...",
  "external_payment_id": "0x53351ef6238c9...",
  "payment_link": null
}
```

---

## 📚 Documentación

- `DATABASE_PAYMENT_METHODS.md` - Detalles técnicos de la BD
- `PAYMENT_METHODS_SETUP.md` - Guía de configuración completa
- `supabase-migration-payment-methods.sql` - SQL de migración

---

## ⚠️ Importante

1. **Ejecuta la migración SQL primero** antes de usar los nuevos métodos
2. **Configura las variables de entorno** antes de probar Stripe/Wompi
3. **Configura los webhooks** para que los pagos se confirmen automáticamente
4. **El checkout aún necesita actualizarse** para mostrar los 3 métodos

---

¿Necesitas ayuda con algún paso específico?

