# 🔄 Configuración de n8n para Webhooks de Wompi

## 📋 Resumen

Este documento explica cómo configurar n8n para recibir webhooks de Wompi y reenviarlos a tu aplicación Next.js.

**Flujo:**
```
Wompi → n8n (ekinoxis.app.n8n.cloud/webhook/wompi-pago) → Tu App (/api/wompi/webhook)
```

---

## 🎯 Configuración del Workflow en n8n

### Paso 1: Crear el Webhook Trigger

1. En n8n, crea un nuevo workflow
2. Agrega un nodo **Webhook**
3. Configura:
   - **HTTP Method**: `POST`
   - **Path**: `wompi-pago` (o el path que tengas configurado)
   - **Response Mode**: "Respond When Last Node Finishes"
   - **Response Code**: `200`

### Paso 2: Configurar el HTTP Request para Reenviar

1. Agrega un nodo **HTTP Request** después del Webhook
2. Configura:
   - **Method**: `POST`
   - **URL**: `https://tu-dominio.vercel.app/api/wompi/webhook`
     - Reemplaza con tu dominio real (ej: `swagethcali.vercel.app`)
   - **Authentication**: None
   - **Headers**:
     ```
     Content-Type: application/json
     x-wompi-signature: {{ $json.headers['x-wompi-signature'] }}
     ```
   - **Body Type**: JSON
   - **Body**: 
     ```json
     {
       "event": "{{ $json.body.event }}",
       "data": {{ $json.body.data }}
     }
     ```
     O si n8n recibe los datos directamente:
     ```json
     {{ $json }}
     ```

### Paso 3: Manejar el Header x-wompi-signature

El header `x-wompi-signature` es crítico para la validación. Puedes obtenerlo de dos formas:

**Opción A: Si n8n lo recibe en headers:**
```
{{ $json.headers['x-wompi-signature'] }}
```

**Opción B: Si n8n lo recibe como parte del body:**
```
{{ $json['x-wompi-signature'] }}
```

**Opción C: Si necesitas extraerlo del webhook original:**
Agrega un nodo **Function** antes del HTTP Request para extraer el header:

```javascript
// En el nodo Function
const headers = $input.item.json.headers || {};
const body = $input.item.json.body || $input.item.json;

return {
  json: {
    body: body,
    signature: headers['x-wompi-signature'] || headers['X-Wompi-Signature']
  }
};
```

Luego en HTTP Request, usa:
```
x-wompi-signature: {{ $json.signature }}
```

### Paso 4: Activar el Workflow

1. Haz clic en **"Activate"** en el workflow
2. Asegúrate de que el webhook esté activo y escuchando
3. Verifica que la URL del webhook sea: `https://ekinoxis.app.n8n.cloud/webhook/wompi-pago`

---

## 🧪 Pruebas

### Probar el Webhook

1. **Desde Wompi:**
   - Realiza una transacción de prueba
   - Verifica en los logs de n8n que llegó el webhook

2. **En n8n:**
   - Ve a la ejecución del workflow
   - Verifica que el webhook recibió los datos correctamente
   - Verifica que el HTTP Request se ejecutó sin errores

3. **En tu aplicación:**
   - Revisa los logs de Vercel para ver si llegó el webhook
   - Verifica que la orden se actualizó correctamente

### Ejemplo de Payload que Wompi envía:

```json
{
  "event": "transaction.updated",
  "data": {
    "transaction": {
      "id": "xxx-xxx-xxx",
      "status": "APPROVED",
      "reference": "ETHCALI_order_1234567890_abc123",
      "amount_in_cents": 150000,
      "currency": "COP"
    }
  }
}
```

---

## 🔍 Debugging

### Si el webhook no llega a tu app:

1. **Verifica en n8n:**
   - ¿El webhook se está ejecutando?
   - ¿El HTTP Request tiene errores?
   - ¿La URL es correcta?

2. **Verifica los headers:**
   - El header `x-wompi-signature` debe estar presente
   - El body debe ser el mismo que recibió n8n

3. **Verifica en Vercel:**
   - Revisa los logs del endpoint `/api/wompi/webhook`
   - Verifica si hay errores de validación de firma

### Errores comunes:

**Error: "Invalid signature"**
- El header `x-wompi-signature` no se está reenviando correctamente
- El body se está modificando antes de reenviarlo

**Error: "Failed to process webhook"**
- El formato del body no coincide con lo que espera el endpoint
- Falta el campo `event` o `data`

---

## 🔐 Seguridad

### Validación de la Firma

El endpoint `/api/wompi/webhook` valida la firma usando:
- `WOMPI_WEBHOOK_SECRET`: `test_events_Hpx12dLsXzgpmEmLnfyv8ksJJI7QWINF`
- Header: `x-wompi-signature`

**Importante:** No modifiques el body ni los headers antes de reenviar, o la validación fallará.

---

## 📚 Referencias

- [Documentación de n8n Webhooks](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [Documentación de n8n HTTP Request](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)
- [Documentación de Wompi Webhooks](https://docs.wompi.co/docs/colombia/eventos/)

