# ETH Cali Merch - Ecommerce Web3

Una tienda online completa inspirada en el diseño de ETH Cali, construida con Next.js, OnchainKit y pagos con criptomonedas.

## 🚀 Características

- **Diseño Moderno**: Inspirado en el ecosistema ETH Cali con gradientes y colores vibrantes
- **Pagos Web3**: Integración completa con OnchainKit para pagos con ETH, USDC, USDT
- **Responsive**: Diseño completamente responsive para todos los dispositivos
- **Carrito de Compras**: Funcionalidad completa de carrito con persistencia
- **Múltiples Redes**: Soporte para Ethereum, Base, Polygon y más
- **TypeScript**: Código completamente tipado para mejor mantenimiento

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Lucide React Icons
- **State Management**: React Context API
- **Web3**: Próximamente (OnchainKit, RainbowKit, Wagmi)

## 📦 Instalación

1. **Clona el repositorio**
   ```bash
   git clone <repository-url>
   cd ethcali-merch
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno (Opcional)**
   ```bash
   cp .env.example .env.local
   ```
   
   Por ahora no necesitas configurar variables de entorno ya que las funcionalidades Web3 están deshabilitadas.

4. **Ejecuta el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador**
   Visita [http://localhost:3000](http://localhost:3000)

## 🔧 Configuración

### Web3 (Próximamente)
- Las funcionalidades Web3 se implementarán en futuras versiones
- Por ahora el proyecto se enfoca en el diseño y funcionalidad básica del ecommerce

## 📱 Páginas

- **Inicio** (`/`): Hero section con productos destacados
- **Catálogo** (`/catalog`): Lista completa de productos con filtros
- **Carrito** (`/cart`): Gestión de productos en el carrito
- **Checkout** (`/checkout`): Proceso de pago con crypto
- **Contacto** (`/contact`): Formulario de contacto y información

## 🎨 Personalización

### Colores
Los colores se pueden personalizar en `tailwind.config.js`:
```javascript
colors: {
  primary: { /* colores primarios */ },
  secondary: { /* colores secundarios */ },
  accent: { /* colores de acento */ }
}
```

### Productos
Los productos se definen en `app/lib/constants.ts`:
```typescript
export const SAMPLE_PRODUCTS: Product[] = [
  // tus productos aquí
];
```

## 🔐 Pagos (Próximamente)

El sistema de pagos Web3 se implementará próximamente con:

- **Redes**: Ethereum, Base, Polygon, Optimism
- **Tokens**: ETH, USDC, USDT
- **Wallets**: MetaMask, WalletConnect, Coinbase Wallet
- **Por ahora**: Simulación de pagos para demostración

## 📦 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Otras plataformas
```bash
npm run build
npm start
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [ETH Cali](https://ethcali.org) por la inspiración y el ecosistema
- [OnchainKit](https://onchainkit.xyz) por las herramientas Web3
- [Next.js](https://nextjs.org) por el framework
- [Tailwind CSS](https://tailwindcss.com) por el sistema de diseño

## 📞 Contacto

- **Website**: [ethcali.org](https://ethcali.org)
- **Email**: info@ethcali.org
- **Twitter**: [@ethcali](https://twitter.com/ethcali)
- **Discord**: [ETH Cali Community](https://discord.gg/ethcali)

---

**El Jardín Infinito del Pacífico Colombiano** 🌴
