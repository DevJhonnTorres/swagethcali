# 🚀 Configuración de Wompi para Pagos con Tarjeta

## 📋 Requisitos Previos

1. **Cuenta en Wompi**: Regístrate en [comercios.wompi.co](https://comercios.wompi.co)
2. **Llaves de autenticación**: Obtén tu par de llaves (pública y privada) desde el panel de Wompi
3. **Webhook URL**: Configura el webhook en el panel de Wompi

---

## 🔑 Variables de Entorno

Agrega estas variables a tu archivo `.env.local` o en Vercel:

```env
# Wompi Configuration
WOMPI_PUBLIC_KEY=pub_test_g3MsCu25QxCwAqi5gmrfjGKtthaBuY2j
WOMPI_PRIVATE_KEY=prv_test_26EN80UN1Pq0Ytba9EDf6WUMQXgKYDMB
WOMPI_ENV=sandbox  # 'sandbox' o 'production'
WOMPI_WEBHOOK_SECRET=test_events_Hpx12dLsXzgpmEmLnfyv8ksJJI7QWINF
WOMPI_INTEGRITY_SECRET=test_integrity_RiVHFbr2pRsHmAec5JKtrpFiPgU7kHZ4

# App URL (para redirects)
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

**Nota:** Estos son los valores que tienes en tu panel de Wompi. Si cambias de ambiente (sandbox → production), deberás obtener las nuevas llaves desde el panel.

### Obtener las Llaves

1. Ve a [comercios.wompi.co](https://comercios.wompi.co) e inicia sesión
2. En el panel, ve a **Configuración > Llaves de autenticación**
3. Copia:
   - **Llave pública** → `WOMPI_PUBLIC_KEY`
   - **Llave privada** → `WOMPI_PRIVATE_KEY`
   - **Ambiente**: Elige `sandbox` para pruebas o `production` para producción

### Configurar Webhook (URL de Eventos)

**⚠️ IMPORTANTE:** Actualmente tienes configurada la URL: `https://ekinoxis.app.n8n.cloud/webhook/wompi-pago`

Para que funcione con tu aplicación, necesitas cambiarla:

1. En el panel de Wompi, ve a **Programadores > Seguimiento de transacciones**
2. En el campo **"URL de Eventos"**, cambia la URL actual por:
   ```
   https://tu-dominio.vercel.app/api/wompi/webhook
   ```
   (Reemplaza `tu-dominio.vercel.app` con tu dominio real de Vercel, ej: `swagethcali.vercel.app`)
3. Haz clic en **"Guardar"**
4. El **Secreto de Eventos** ya lo tienes: `test_events_Hpx12dLsXzgpmEmLnfyv8ksJJI7QWINF`
5. Wompi enviará automáticamente eventos cuando:
   - Se cree una transacción
   - Se actualice el estado de una transacción
   - Se apruebe un pago

**Nota:** Si prefieres usar n8n como intermediario, puedes configurar n8n para que reenvíe los eventos a tu endpoint `/api/wompi/webhook`, pero es más simple usar directamente la URL de tu aplicación.

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

