# 🚀 Guía de Configuración Rápida

## Paso 1: Crear Proyecto en Supabase

1. **Ve a:** https://supabase.com
2. **Inicia sesión** o **crea una cuenta** (gratis)
3. **Crea un nuevo proyecto:**
   - Haz clic en "New Project"
   - Nombra tu proyecto (ej: "ecomer-wiliwonka")
   - Elige una región cercana
   - Establece una contraseña de base de datos
   - Espera ~2 minutos a que se cree

## Paso 2: Obtener Credenciales

1. **En el dashboard de Supabase**, ve a **Settings** → **API**
2. **Copia estos valores:**
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Paso 3: Configurar Variables de Entorno

Edita el archivo `.env.local` y reemplaza los placeholders:

```bash
# Base Network Configuration
NEXT_PUBLIC_TESTNET=true
NEXT_PUBLIC_RECIPIENT_ADDRESS=0x0000000000000000000000000000000000000000

# Supabase Configuration (REEMPLAZA ESTOS VALORES)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Paso 4: Crear las Tablas

1. **En Supabase Dashboard**, ve a **SQL Editor**
2. **Haz clic en "New Query"**
3. **Copia el contenido** del archivo `supabase-schema.sql`
4. **Pega en el editor** y haz clic en **"Run"**
5. **Verifica** que se hayan creado las tablas:
   - Ve a **Table Editor** y deberías ver `orders` y `payments`

## Paso 5: Reiniciar el Servidor

```bash
# Detén el servidor actual (Ctrl+C)
# Luego inicia de nuevo:
npm run dev
```

## Paso 6: Probar

1. **Abre:** http://localhost:3000
2. **Agrega productos** al carrito
3. **Ve a checkout** y haz clic en "Pagar con Base Pay"
4. **Verifica en Supabase:**
   - Ve a **Table Editor** → **orders**
   - Deberías ver tu orden registrada

## 🎉 ¡Listo!

Tu e-commerce ya está conectado a Supabase y guardando todas las órdenes y pagos.

## 📝 Notas Importantes

- **Testnet**: El proyecto está en modo testnet (`NEXT_PUBLIC_TESTNET=true`)
- **Base Pay**: Es una simulación (no pagos reales aún)
- **Datos**: Se guardan en tiempo real en Supabase
- **Dashboard**: Puedes ver todos los datos en Supabase Dashboard

## 🆘 Problemas Comunes

### Error: "Invalid API key"
- Verifica que copiaste correctamente la `anon public` key
- Asegúrate de que no hay espacios extra

### Error: "Failed to create order"
- Verifica que ejecutaste el SQL correctamente
- Revisa que las tablas existen en Table Editor

### No se guardan datos
- Verifica las variables de entorno con `npm run dev`
- Revisa la consola del navegador para ver errores

## 🔐 Seguridad (Producción)

Cuando vayas a producción:
1. Usa **Service Role Key** en el backend (no en el frontend)
2. Configura **Row Level Security (RLS)** apropiadamente
3. Agrega autenticación de usuarios
4. Cambia `NEXT_PUBLIC_TESTNET=false` para mainnet
