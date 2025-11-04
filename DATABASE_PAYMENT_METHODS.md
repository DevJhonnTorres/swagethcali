# 📊 Estructura de Base de Datos - Métodos de Pago

## 🗄️ Tabla `orders`

Esta tabla almacena **todas las órdenes** independientemente del método de pago.

### Campos comunes a todos los métodos:

```sql
- id: UUID (PK)
- order_id: TEXT (único) - ID de la orden
- customer_id: TEXT - ID del cliente (opcional)
- amount_usd: DECIMAL(10,2) - Monto en USD
- amount_cop: INTEGER - Monto en COP
- status: TEXT - Estado (pending, completed, failed, expired)
- items: JSONB - Array de productos con sus tallas
- payment_id: TEXT - ID del pago asociado
- transaction_hash: TEXT - Hash de la transacción
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- completed_at: TIMESTAMP
```

### Campos específicos por método de pago:

```sql
- payment_method: TEXT - 'base_pay' | 'stripe' | 'wompi'
- customer_name: TEXT - Nombre del cliente
- customer_email: TEXT - Email del cliente
- customer_phone: TEXT - Teléfono del cliente
- shipping_address: TEXT - Dirección de envío
- shipping_city: TEXT - Ciudad de envío
- shipping_country: TEXT - País de envío
```

---

## 💳 Tabla `payments`

Esta tabla almacena **todos los pagos** con información específica del método.

### Campos comunes:

```sql
- id: UUID (PK)
- payment_id: TEXT (único) - ID del pago
- order_id: TEXT (FK) - Referencia a orders.order_id
- amount: TEXT - Monto del pago
- to_address: TEXT - Dirección de destino (solo Base Pay)
- testnet: BOOLEAN - Si es testnet/mainnet
- status: TEXT - Estado (pending, completed, failed)
- transaction_hash: TEXT - Hash/ID de la transacción
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- completed_at: TIMESTAMP
```

### Campos específicos por método:

```sql
- payment_method: TEXT - 'base_pay' | 'stripe' | 'wompi'
- payment_link: TEXT - URL de pago (Stripe/Wompi)
- external_payment_id: TEXT - ID externo del método
  - Base Pay: transaction hash
  - Stripe: payment_intent_id
  - Wompi: transaction reference
```

---

## 📍 Dónde se guardan los datos según el método

### 🔵 Base Pay (USDC)

**Datos de envío:**
- Se guardan en `orders`:
  - `customer_name`
  - `customer_email`
  - `customer_phone`
  - `shipping_address`
  - `shipping_city`
  - `shipping_country`

**Datos de pago:**
- `payments.to_address`: Dirección de wallet de destino
- `payments.transaction_hash`: Hash de la transacción en Base
- `payments.external_payment_id`: Mismo que transaction_hash
- `payments.payment_link`: NULL (no aplica)

**Link de pago:**
- No hay link, se usa el SDK directamente en el frontend
- La transacción se ejecuta en la wallet del usuario

---

### 💳 Stripe (USD)

**Datos de envío:**
- Se guardan en `orders`:
  - `customer_name`
  - `customer_email`
  - `customer_phone`
  - `shipping_address`
  - `shipping_city`
  - `shipping_country`

**Datos de pago:**
- `payments.to_address`: "" (vacío, Stripe no usa addresses)
- `payments.transaction_hash`: Payment Intent ID
- `payments.external_payment_id`: Payment Intent ID (ej: `pi_1234567890`)
- `payments.payment_link`: NULL (se usa Payment Intent)

**Link de pago:**
- No hay link directo, se usa Stripe Elements en el frontend
- El cliente paga directamente en el checkout
- La confirmación llega vía webhook

---

### 🇨🇴 Wompi (COP)

**Datos de envío:**
- Se guardan en `orders`:
  - `customer_name`
  - `customer_email`
  - `customer_phone`
  - `shipping_address`
  - `shipping_city`
  - `shipping_country`

**Datos de pago:**
- `payments.to_address`: "" (vacío)
- `payments.transaction_hash`: Transaction ID de Wompi
- `payments.external_payment_id`: Reference (ej: `ETHCALI_order_1234567890_abc123`)
- `payments.payment_link`: URL completa del link de pago (ej: `https://checkout.wompi.co/l/xyz123`)

**Link de pago:**
- Se genera en `/api/wompi/create-payment-link`
- Se guarda en `payments.payment_link`
- El cliente es redirigido a este link para pagar
- La confirmación llega vía webhook

---

## 🔄 Flujo de Datos por Método

### Base Pay Flow:

```
1. Frontend: Usuario completa formulario de envío
2. Frontend: Llama pay() del SDK de Base Pay
3. Base Pay: Usuario confirma en wallet
4. Frontend: Recibe transaction hash
5. Frontend: POST /api/payments/confirm
   - Guarda datos de envío en orders
   - Guarda transaction hash en payments
   - Actualiza status a 'completed'
6. Backend: Envía emails y notificaciones
```

### Stripe Flow:

```
1. Frontend: Usuario completa formulario de envío
2. Frontend: POST /api/stripe/create-payment-intent
   - Guarda orden en Supabase (pending)
   - Crea Payment Intent en Stripe
   - Retorna client_secret
3. Frontend: Usuario completa pago con Stripe Elements
4. Stripe: Procesa pago
5. Stripe Webhook: POST /api/stripe/webhook
   - Actualiza payment.status a 'completed'
   - Actualiza order.status a 'completed'
   - Guarda transaction_hash = payment_intent_id
   - Envía emails y notificaciones
```

### Wompi Flow:

```
1. Frontend: Usuario completa formulario de envío
2. Frontend: POST /api/wompi/create-payment-link
   - Guarda orden en Supabase (pending)
   - Crea link de pago en Wompi
   - Retorna payment_link
3. Frontend: Redirige usuario a payment_link
4. Usuario: Completa pago en Wompi
5. Wompi: Redirige a /order-confirmation?orderId=xxx
6. Wompi Webhook: POST /api/wompi/webhook
   - Actualiza payment.status a 'completed'
   - Actualiza order.status a 'completed'
   - Guarda transaction_hash = transaction.id
   - Envía emails y notificaciones
```

---

## 📝 Ejemplo de Datos Guardados

### Base Pay Order:

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

### Stripe Order:

```json
{
  "order_id": "order_1761780456789_xyz123",
  "payment_method": "stripe",
  "amount_usd": "50.00",
  "amount_cop": 210000,
  "status": "completed",
  "customer_name": "María García",
  "customer_email": "maria@example.com",
  "customer_phone": "+573009876543",
  "shipping_address": "Av 5N #20-30",
  "shipping_city": "Bogotá",
  "shipping_country": "Colombia",
  "items": "[{...}]",
  "transaction_hash": "pi_1234567890abcdef"
}
```

### Wompi Order:

```json
{
  "order_id": "order_1761780567890_abc456",
  "payment_method": "wompi",
  "amount_usd": "25.00",
  "amount_cop": 105000,
  "status": "completed",
  "customer_name": "Carlos López",
  "customer_email": "carlos@example.com",
  "customer_phone": "+573001112233",
  "shipping_address": "Carrera 10 #5-10",
  "shipping_city": "Medellín",
  "shipping_country": "Colombia",
  "items": "[{...}]",
  "transaction_hash": "1234567890"
}
```

---

## 🚀 Próximos Pasos

1. Ejecutar migración SQL en Supabase
2. Configurar variables de entorno (Stripe, Wompi)
3. Actualizar checkout para manejar los 3 métodos
4. Configurar webhooks en Stripe y Wompi
5. Probar cada método de pago

