# 🔧 Configurar Variables de Entorno en Vercel

## Pasos para Configurar Resend

### 1. Ve al Dashboard de Vercel
https://vercel.com/dashboard

### 2. Selecciona tu proyecto "swagethcali"

### 3. Ve a Settings → Environment Variables

### 4. Agrega estas variables:

#### Variable 1: Resend API Key
```
Name: RESEND_API_KEY
Value: re_7gzsMKHp_6adKS8L7LPTaca8cf6S5sqzC
Environment: Production, Preview, Development
```

#### Variable 2: Admin Email
```
Name: ADMIN_EMAIL
Value: torres.castro.alex@gmail.com
Environment: Production, Preview, Development
```

#### Variable 3: Supabase URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://keslnkqnhpylfszsahls.supabase.co
Environment: Production, Preview, Development
```

#### Variable 4: Supabase Key
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: sb_publishable_u6DjwBPaJ4YdEqq8I9wIxQ_wjwkVjp4
Environment: Production, Preview, Development
```

#### Variable 5: Base Network (Opcional)
```
Name: NEXT_PUBLIC_TESTNET
Value: true
Environment: Production, Preview, Development
```

#### Variable 6: Recipient Address (Opcional)
```
Name: NEXT_PUBLIC_RECIPIENT_ADDRESS
Value: 0x0000000000000000000000000000000000000000
Environment: Production, Preview, Development
```

### 5. After adding all variables, go to Deployments

### 6. Click on the three dots (...) next to the latest deployment

### 7. Click "Redeploy"

### ✅ ¡Listo!

Después de esto, tu aplicación funcionará con:
- ✅ Emails configurados
- ✅ Supabase conectado
- ✅ Notificaciones funcionando

## 📧 Email de Prueba

Una vez configurado, puedes probar haciendo una compra y verificarás que te llega un email a:
**torres.castro.alex@gmail.com**

