# Configuración de Supabase

## 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota la URL del proyecto y la API key

## 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Base Pay Configuration
NEXT_PUBLIC_RECIPIENT_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_TESTNET=true
```

## 3. Crear las tablas

Ejecuta el SQL del archivo `supabase-schema.sql` en el SQL Editor de Supabase:

1. Ve a tu proyecto en Supabase
2. Abre el SQL Editor
3. Copia y pega el contenido de `supabase-schema.sql`
4. Ejecuta el script

## 4. Verificar la configuración

Las tablas creadas serán:
- `orders`: Para almacenar las órdenes
- `payments`: Para almacenar los pagos

## 5. Estructura de datos

### Tabla `orders`
- `id`: UUID único
- `order_id`: ID de la orden (string único)
- `customer_id`: ID del cliente (opcional)
- `amount_usd`: Monto en USD
- `amount_cop`: Monto en COP
- `status`: Estado de la orden (pending, completed, failed, expired)
- `items`: Items de la orden (JSONB)
- `payment_id`: ID del pago asociado
- `transaction_hash`: Hash de la transacción
- `created_at`, `updated_at`, `completed_at`: Timestamps

### Tabla `payments`
- `id`: UUID único
- `payment_id`: ID del pago (string único)
- `order_id`: ID de la orden (foreign key)
- `amount`: Monto del pago
- `to_address`: Dirección de destino
- `testnet`: Si es testnet o mainnet
- `status`: Estado del pago (pending, completed, failed)
- `transaction_hash`: Hash de la transacción
- `created_at`, `updated_at`, `completed_at`: Timestamps

## 6. Testing

Una vez configurado, puedes probar el flujo completo:
1. Agregar items al carrito
2. Ir a checkout
3. Hacer clic en "Pagar con Base Pay"
4. Verificar en Supabase que se crearon los registros
