# 🚀 Configuración de Wompi para Pagos con Tarjeta

## 📋 Requisitos Previos

1. **Cuenta en Wompi**: Regístrate en [comercios.wompi.co](https://comercios.wompi.co)
2. **Llaves de autenticación**: Obtén tu par de llaves (pública y privada) desde el panel de Wompi
3. **Webhook URL**: Configura el webhook en el panel de Wompi

---

## 🔑 Variables de Entorno

Agrega estas variables a tu archivo `.env.local` o en Vercel:

```env
# Wompi Configuration (PRODUCCIÓN)
WOMPI_PUBLIC_KEY=pub_prod_uJu3MAUpIWi1RCFTkbqfaUrnvseOojtL
WOMPI_PRIVATE_KEY=prv_prod_J57FOyzbwtGxV7QLUpCXhw4B3WqgUyru
WOMPI_ENV=production  # 'sandbox' o 'production'
WOMPI_WEBHOOK_SECRET=prod_events_r2IuTTqGktJQQIgZ8ooRY2bflJ0HwG5a
WOMPI_INTEGRITY_SECRET=prod_integrity_gqcWQ2O6UmUEoUZC8zVOEeFn42YdaG9F

# App URL (para redirects)
NEXT_PUBLIC_APP_URL=https://swagethcali.vercel.app
```

**⚠️ IMPORTANTE:** Estas son credenciales de **PRODUCCIÓN**. Asegúrate de:
- Cambiar `WOMPI_ENV=production` (no `sandbox`)
- Usar estas credenciales solo en producción
- No compartir estas llaves públicamente

### Obtener las Llaves

1. Ve a [comercios.wompi.co](https://comercios.wompi.co) e inicia sesión
2. En el panel, ve a **Configuración > Llaves de autenticación**
3. Copia:
   - **Llave pública** → `WOMPI_PUBLIC_KEY`
   - **Llave privada** → `WOMPI_PRIVATE_KEY`
   - **Ambiente**: Elige `sandbox` para pruebas o `production` para producción

### Configurar Webhook (URL de Eventos con n8n)

**✅ Configuración actual:** Usando n8n como intermediario

**URL de eventos en Wompi:** `https://ekinoxis.app.n8n.cloud/webhook/wompi-pago`

#### Configuración en Wompi (Ya está configurado)

1. ✅ La URL de eventos ya está configurada: `https://ekinoxis.app.n8n.cloud/webhook/wompi-pago`
2. ✅ El **Secreto de Eventos** es: `prod_events_r2IuTTqGktJQQIgZ8ooRY2bflJ0HwG5a`

#### Configuración en n8n (Workflow necesario)

Necesitas crear un workflow en n8n que:

1. **Reciba el webhook de Wompi** (ya configurado en `ekinoxis.app.n8n.cloud/webhook/wompi-pago`)
2. **Reenvíe los datos a tu aplicación** en `https://tu-dominio.vercel.app/api/wompi/webhook`

**Estructura del workflow n8n:**

```
Webhook (Trigger) 
  ↓
  Recibe: POST desde Wompi
  Headers: x-wompi-signature
  Body: { event, data }
  ↓
HTTP Request (Action)
  ↓
  Método: POST
  URL: https://tu-dominio.vercel.app/api/wompi/webhook
  Headers:
    - Content-Type: application/json
    - x-wompi-signature: {{ $json.headers['x-wompi-signature'] }}
  Body: {{ $json.body }}
```

**Pasos detallados en n8n:**

1. **Nodo Webhook:**
   - Método: POST
   - Path: `wompi-pago`
   - Response Mode: "Respond When Last Node Finishes"

2. **Nodo HTTP Request:**
   - Método: POST
   - URL: `https://tu-dominio.vercel.app/api/wompi/webhook`
   - Authentication: None
   - Headers:
     ```
     Content-Type: application/json
     x-wompi-signature: {{ $json.headers['x-wompi-signature'] || $json['x-wompi-signature'] }}
     ```
   - Body: `{{ $json.body }}` o `{{ $json }}` (depende de cómo n8n reciba los datos)

3. **Activar el workflow** para que esté escuchando

**Nota:** El webhook de Wompi debe enviar el header `x-wompi-signature` y el body completo sin modificaciones para que la validación funcione correctamente.

---

## 🔄 Flujo de Pago con Wompi

### 1. Usuario Selecciona Tarjeta
- El usuario elige "Tarjeta (Wompi)" en el checkout
- Ve información sobre el método de pago

### 2. Crear Link de Pago
- Frontend llama a `/api/wompi/create-payment-link`
- Se crea la orden en Supabase con estado `pending`
- Se genera un link de pago único en Wompi
- Se guarda el link en `payments.payment_link`

### 3. Redirección a Wompi
- El usuario es redirigido a `https://checkout.wompi.co/l/xxxxx`
- Completa el pago con tarjeta, PSE, Nequi, etc.
- Wompi procesa el pago

### 4. Confirmación vía Webhook
- Wompi envía webhook a `/api/wompi/webhook`
- Se valida la firma del webhook
- Se actualiza el estado de la orden a `completed`
- Se envía email de confirmación al cliente
- Se envía notificación WhatsApp al distribuidor

### 5. Redirección a Confirmación
- Wompi redirige a `/order-confirmation?orderId=xxx`
- Se muestra la confirmación de la orden

---

## 📊 Datos Guardados

### En la tabla `orders`:
```sql
payment_method: 'wompi'
customer_name: 'Juan Pérez'
customer_email: 'juan@example.com'
customer_phone: '+573001234567'
shipping_address: 'Calle 123 #45-67'
shipping_city: 'Cali'
shipping_country: 'Colombia'
amount_cop: 150000
status: 'completed'
transaction_hash: 'xxx-xxx-xxx'  # ID de transacción de Wompi
```

### En la tabla `payments`:
```sql
payment_method: 'wompi'
payment_link: 'https://checkout.wompi.co/l/xxxxx'
external_payment_id: 'ETHCALI_order_1234567890_abc123'
transaction_hash: 'xxx-xxx-xxx'  # ID de transacción de Wompi
status: 'completed'
```

---

## 🧪 Pruebas en Sandbox

### Tarjetas de Prueba

**Tarjeta Aprobada:**
- Número: `4242 4242 4242 4242`
- CVV: `123`
- Fecha: Cualquier fecha futura
- Nombre: Cualquiera

**Tarjeta Rechazada:**
- Número: `4000 0000 0000 0002`
- CVV: `123`
- Fecha: Cualquier fecha futura

**Tarjeta con 3D Secure:**
- Número: `4000 0027 6000 3184`
- CVV: `123`
- Fecha: Cualquier fecha futura

### Ver más tarjetas de prueba en:
- [Documentación de Wompi - Datos de Prueba](https://docs.wompi.co/docs/colombia/datos-de-prueba-en-sandbox/)

---

## 🔍 Monitoreo

### Ver Transacciones en Wompi
1. Ve al panel de Wompi
2. **Transacciones** → Ver todas las transacciones
3. **Webhooks** → Ver logs de webhooks enviados

### Ver en Base de Datos
```sql
-- Ver órdenes de Wompi
SELECT * FROM orders WHERE payment_method = 'wompi' ORDER BY created_at DESC;

-- Ver pagos de Wompi
SELECT * FROM payments WHERE payment_method = 'wompi' ORDER BY created_at DESC;
```

---

## ⚠️ Troubleshooting

### Error: "Failed to create payment link"
- Verifica que las llaves estén correctas
- Verifica que `WOMPI_ENV` sea `sandbox` o `production`
- Revisa los logs del servidor para más detalles

### Webhook no se recibe
- Verifica que la **URL de Eventos** esté configurada correctamente en Wompi
- Verifica que `WOMPI_WEBHOOK_SECRET` coincida con el secreto de eventos en Wompi
- Verifica que la URL sea accesible públicamente (no `localhost`)
- Revisa los logs de Vercel para ver si llegan las peticiones
- Verifica que la URL termine en `/api/wompi/webhook`

### La transacción no se actualiza
- Verifica que el webhook esté configurado correctamente
- Revisa los logs del webhook handler
- Verifica que la referencia coincida con `external_payment_id`

---

## 📚 Referencias

- [Documentación de Wompi](https://docs.wompi.co/docs/colombia/inicio-rapido/)
- [API de Links de Pago](https://docs.wompi.co/docs/colombia/links-de-pago/)
- [Webhooks](https://docs.wompi.co/docs/colombia/eventos/)
- [Datos de Prueba](https://docs.wompi.co/docs/colombia/datos-de-prueba-en-sandbox/)

---

## ✅ Checklist de Implementación

- [ ] Cuenta creada en comercios.wompi.co
- [ ] Llaves obtenidas (pública y privada)
- [ ] Variables de entorno configuradas
- [ ] Webhook configurado en Wompi
- [ ] Prueba de pago exitosa en sandbox
- [ ] Verificación de emails de confirmación
- [ ] Verificación de notificaciones WhatsApp
- [ ] Migración a producción (cambiar `WOMPI_ENV` a `production`)

