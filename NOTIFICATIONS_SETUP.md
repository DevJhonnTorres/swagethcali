# 📧 Configuración de Notificaciones

## 🎯 Sistema de Notificaciones Implementado

Después de cada pago, se envían automáticamente:

1. ✅ **Email de confirmación al cliente** (con detalles de la orden)
2. ✅ **Email al admin/distribuidor** (para procesar la orden)
3. ✅ **WhatsApp al distribuidor** (notificación instantánea)

## 📋 Configuración Requerida

### 1. Resend (Email) - Gratis hasta 3,000 emails/mes

1. Ve a: https://resend.com
2. Crea una cuenta
3. Verifica tu dominio (o usa el dominio de prueba de Resend)
4. Copia tu API Key
5. Agrega a `.env.local`:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ADMIN_EMAIL=tu-email@tudominio.com
   ```

### 2. Twilio (WhatsApp) - Precio: ~$0.005 por mensaje

1. Ve a: https://twilio.com
2. Crea una cuenta
3. Obtén tus credenciales:
   - Account SID
   - Auth Token
4. Solicita número de WhatsApp (sandbox gratuito por tiempo limitado)
5. Agrega a `.env.local`:
   ```bash
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   DISTRIBUTOR_WHATSAPP=+57300xxxxxxx  # Tu número
   ```

## 🧪 Modo de Prueba (Sin Configurar)

Si **NO** configuras las credenciales, el sistema funcionará en **modo simulación**:
- Los emails se muestran en la consola
- Los WhatsApp se muestran en la consola
- ¡Todo funciona para pruebas!

## 📧 Templates de Email

### Email al Cliente
```
✅ Orden Confirmada
   - Número de orden
   - Lista de productos con imágenes
   - Total pagado
   - Estado: En proceso
```

### Email al Admin/Distribuidor
```
📦 Nueva Orden para Procesar
   - Número de orden
   - Cliente y email
   - Lista de productos
   - Total
   - Botón para ver en dashboard
```

### WhatsApp al Distribuidor
```
🧊 Nueva Orden!

Orden: #order_123456
Productos:
• SPECIAL 4:20 2.0 BLACK x1
• ...

Total: $150,000 COP
Cliente: customer@example.com

📦 ¡Haz clic para ver detalles!
```

## 🚀 Cómo Funciona

```
Usuario completa pago
    ↓
Flujo de Base Pay
    ↓
Pago confirmado
    ↓
Envío automático:
    • Email cliente ✅
    • Email admin ✅
    • WhatsApp distribuidor ✅
```

## 💰 Costos Aproximados

- **Resend**: $0 (free tier: 3,000 emails/mes)
- **Twilio WhatsApp**: ~$0.005 por mensaje
- **Total por orden**: ~$0.01 USD

## 🔧 Personalización

Edita `app/lib/notifications.ts` para:
- Cambiar templates de email
- Modificar mensajes de WhatsApp
- Agregar más destinatarios
- Personalizar contenido

## 📝 Testing

Para probar sin configurar servicios:

```bash
# El sistema detectará que no hay credenciales
# y mostrará los mensajes en la consola
npm run dev
```

Luego haz una prueba de pago y revisa la consola del servidor.

## ✅ Estado Actual

- ✅ Código de notificaciones implementado
- ✅ Templates de email creados
- ✅ WhatsApp configurado
- ⏳ Falta configurar credenciales (opcional)

¡Todo funciona en modo simulación hasta que configures las credenciales!

