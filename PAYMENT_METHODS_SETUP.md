# 🚀 Configuración de Métodos de Pago

## 📋 Resumen

Tu e-commerce ahora soporta **3 métodos de pago**:

1. **Base Pay** - USDC en Base (crypto)
2. **Stripe** - Tarjetas en USD
3. **Wompi** - Tarjetas/PSE/Nequi en COP

---

## 🗄️ Base de Datos

### Paso 1: Ejecutar Migración SQL

Ve a tu **Supabase Dashboard** → **SQL Editor** y ejecuta el contenido de:
```
supabase-migration-payment-methods.sql
```

Esto agregará:
- `payment_method` a `orders` y `payments`
- Campos de envío (`shipping_address`, `shipping_city`, `shipping_country`)
- Campos de cliente (`customer_name`, `customer_email`, `customer_phone`)
- `payment_link` y `external_payment_id` para Stripe/Wompi

---

## 🔧 Configuración de Variables de Entorno

### 1. Base Pay (Ya configurado)

```bash
NEXT_PUBLIC_RECIPIENT_ADDRESS=0x39a13ccd07ebb9bd6d68bb2849453e8c713d816e
NEXT_PUBLIC_TESTNET=true
```

### 2. Stripe

1. Ve a: https://stripe.com
2. Crea una cuenta y obtén tus API keys
3. Configura webhook en Stripe Dashboard:
   - URL: `https://tu-dominio.com/api/stripe/webhook`
   - Eventos: `payment_intent.succeeded`
   - Copia el `webhook_secret`

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Wompi

1. Ve a: https://wompi.co
2. Crea una cuenta de comercio
3. Obtén tus llaves (Public Key y Private Key)
4. Configura webhook en Wompi Dashboard:
   - URL: `https://tu-dominio.com/api/wompi/webhook`
   - Eventos: `transaction.updated`, `payment.accepted`

```bash
WOMPI_PUBLIC_KEY=pub_test_...
WOMPI_PRIVATE_KEY=prv_test_...
WOMPI_WEBHOOK_SECRET=tu_secret_de_webhook
WOMPI_ENV=sandbox  # o 'production' para producción
```

### 4. App URL (para redirects)

```bash
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
# O para desarrollo:
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📍 Dónde se Guardan los Datos

### Datos de Envío

**Todos los métodos guardan en `orders`:**

```sql
- customer_name: TEXT
- customer_email: TEXT
- customer_phone: TEXT
- shipping_address: TEXT
- shipping_city: TEXT
- shipping_country: TEXT
```

### Datos de Pago

**Tabla `payments`:**

| Campo | Base Pay | Stripe | Wompi |
|-------|----------|-------|-------|
| `payment_method` | `'base_pay'` | `'stripe'` | `'wompi'` |
| `to_address` | Wallet address | `""` | `""` |
| `transaction_hash` | Tx hash | Payment Intent ID | Transaction ID |
| `external_payment_id` | Tx hash | Payment Intent ID | Reference |
| `payment_link` | `NULL` | `NULL` | URL completa |

---

## 🔗 Links de Pago

### Base Pay
- **No hay link** - Se usa el SDK directamente en el frontend
- El usuario confirma en su wallet

### Stripe
- **No hay link** - Se usa Stripe Elements en el checkout
- El usuario paga directamente en la página

### Wompi
- **Se genera link** en `/api/wompi/create-payment-link`
- El link se guarda en `payments.payment_link`
- Formato: `https://checkout.wompi.co/l/xyz123`
- El usuario es redirigido a este link para pagar

---

## 🔄 Flujos de Pago

### 1. Base Pay Flow

```
Usuario → Selecciona Base Pay → Confirma en wallet → 
Frontend recibe tx hash → POST /api/payments/confirm → 
Guarda en BD → Envía emails
```

### 2. Stripe Flow

```
Usuario → Selecciona Stripe → Completa tarjeta → 
POST /api/stripe/create-payment-intent → 
Usuario paga → Stripe webhook → 
POST /api/stripe/webhook → Actualiza BD → Envía emails
```

### 3. Wompi Flow

```
Usuario → Selecciona Wompi → POST /api/wompi/create-payment-link → 
Redirige a payment_link → Usuario paga en Wompi → 
Wompi webhook → POST /api/wompi/webhook → 
Actualiza BD → Envía emails
```

---

## 📊 Estructura de Datos en BD

### Ejemplo de `orders`:

```json
{
  "order_id": "order_1234567890_abc123",
  "payment_method": "stripe",
  "amount_usd": "50.00",
  "amount_cop": 210000,
  "status": "completed",
  "customer_name": "Juan Pérez",
  "customer_email": "juan@example.com",
  "customer_phone": "+573001234567",
  "shipping_address": "Calle 123 #45-67",
  "shipping_city": "Cali",
  "shipping_country": "Colombia",
  "items": "[{...}]",
  "transaction_hash": "pi_1234567890"
}
```

### Ejemplo de `payments`:

```json
{
  "payment_id": "payment_1234567890_xyz789",
  "order_id": "order_1234567890_abc123",
  "payment_method": "stripe",
  "amount": "50.00",
  "to_address": "",
  "status": "completed",
  "transaction_hash": "pi_1234567890",
  "external_payment_id": "pi_1234567890",
  "payment_link": null
}
```

---

## ✅ Checklist de Configuración

- [ ] Ejecutar migración SQL en Supabase
- [ ] Configurar variables de entorno de Stripe
- [ ] Configurar variables de entorno de Wompi
- [ ] Configurar webhook de Stripe en Stripe Dashboard
- [ ] Configurar webhook de Wompi en Wompi Dashboard
- [ ] Agregar `NEXT_PUBLIC_APP_URL` a variables de entorno
- [ ] Instalar dependencias: `npm install stripe`
- [ ] Probar cada método de pago

---

## 📚 Documentación Adicional

- Ver `DATABASE_PAYMENT_METHODS.md` para detalles técnicos
- Ver `supabase-migration-payment-methods.sql` para el SQL de migración
- Ver rutas API en `app/api/stripe/` y `app/api/wompi/`

---

## 🆘 Troubleshooting

### Stripe webhook no funciona:
- Verifica `STRIPE_WEBHOOK_SECRET`
- Asegúrate de que la URL del webhook sea accesible públicamente
- Usa Stripe CLI para probar localmente: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### Wompi link no se genera:
- Verifica que `WOMPI_PUBLIC_KEY` y `WOMPI_PRIVATE_KEY` sean correctas
- Verifica que `WOMPI_ENV` sea `sandbox` o `production`
- Revisa los logs del servidor para ver el error específico

### Datos de envío no se guardan:
- Verifica que la migración SQL se ejecutó correctamente
- Revisa que los campos existan en la tabla `orders`
- Verifica que el frontend esté enviando los datos correctamente

