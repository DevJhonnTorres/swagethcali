import { Product } from '@/app/types';

// Chains configuration - Temporalmente deshabilitado
// export const CHAINS = [...];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Gorra Privacy is Freedom',
    description: 'Gorra blanca de béisbol con logo de Ethereum en colores pastel. Diseño exclusivo ETH Cali con mensaje "Privacy is Freedom" en la parte posterior.',
    price: 100, // $1.00 USD for testing
    originalPrice: 200,
    image: '/images/gorra-blanca-privacy-freedom.png',
    images: ['/images/gorra-blanca-privacy-freedom.png'],
    category: 'Accesorios',
    inStock: true,
    isOnSale: true,
    tags: ['gorra', 'ethereum', 'blanco'],
    variants: [
      { id: 'size-s', name: 'Talla S', size: 'S', price: 100, image: '/images/gorra-blanca-privacy-freedom.png', inStock: true },
      { id: 'size-m', name: 'Talla M', size: 'M', price: 100, image: '/images/gorra-blanca-privacy-freedom.png', inStock: true },
      { id: 'size-l', name: 'Talla L', size: 'L', price: 100, image: '/images/gorra-blanca-privacy-freedom.png', inStock: true },
      { id: 'size-xl', name: 'Talla XL', size: 'XL', price: 100, image: '/images/gorra-blanca-privacy-freedom.png', inStock: true },
    ],
  },
  {
    id: '2',
    name: 'Gorra Privacy is Normal',
    description: 'Gorra negra de béisbol con logo de Ethereum holográfico. Diseño exclusivo con mensaje "Privacy is Normal" en la parte posterior.',
    price: 100, // $1.00 USD for testing
    originalPrice: 200,
    image: '/images/gorra-negra-privacy-normal.png',
    images: ['/images/gorra-negra-privacy-normal.png'],
    category: 'Accesorios',
    inStock: true,
    isOnSale: true,
    tags: ['gorra', 'ethereum', 'negro', 'holográfico'],
    variants: [
      { id: 'size-s', name: 'Talla S', size: 'S', price: 100, image: '/images/gorra-negra-privacy-normal.png', inStock: true },
      { id: 'size-m', name: 'Talla M', size: 'M', price: 100, image: '/images/gorra-negra-privacy-normal.png', inStock: true },
      { id: 'size-l', name: 'Talla L', size: 'L', price: 100, image: '/images/gorra-negra-privacy-normal.png', inStock: true },
      { id: 'size-xl', name: 'Talla XL', size: 'XL', price: 100, image: '/images/gorra-negra-privacy-normal.png', inStock: true },
    ],
  },
  {
    id: '3',
    name: 'Hoodie Privacy Magic',
    description: 'Sudadera crema con diseño místico de Ethereum. Front con emblema ETH-CO L.G.L.T. Back con ilustración de hands holding crystal.',
    price: 100, // $1.00 USD for testing
    image: '/images/hoodie-crema-privacy-magic.png',
    images: ['/images/hoodie-crema-privacy-magic.png'],
    category: 'Ropa',
    inStock: true,
    isOnSale: false,
    tags: ['hoodie', 'crema', 'místico', 'privacy'],
    variants: [
      { id: 'size-xs', name: 'Talla XS', size: 'XS', price: 100, image: '/images/hoodie-crema-privacy-magic.png', inStock: true },
      { id: 'size-s', name: 'Talla S', size: 'S', price: 100, image: '/images/hoodie-crema-privacy-magic.png', inStock: true },
      { id: 'size-m', name: 'Talla M', size: 'M', price: 100, image: '/images/hoodie-crema-privacy-magic.png', inStock: true },
      { id: 'size-l', name: 'Talla L', size: 'L', price: 100, image: '/images/hoodie-crema-privacy-magic.png', inStock: true },
      { id: 'size-xl', name: 'Talla XL', size: 'XL', price: 100, image: '/images/hoodie-crema-privacy-magic.png', inStock: true },
      { id: 'size-xxl', name: 'Talla XXL', size: 'XXL', price: 100, image: '/images/hoodie-crema-privacy-magic.png', inStock: true },
    ],
  },
  {
    id: '4',
    name: 'Hoodie ETH Cali Original',
    description: 'Sudadera negra con logo ETH CO CALI en la manga. Front con hands holding crystal. Back con diseño tribal de 5 figuras alrededor del crystal de Ethereum.',
    price: 100, // $1.00 USD for testing
    image: '/images/hoodie-negra-eth-cali.png',
    images: ['/images/hoodie-negra-eth-cali.png', '/images/hoodie-negra-back.png'],
    category: 'Ropa',
    inStock: true,
    isOnSale: false,
    tags: ['hoodie', 'negro', 'tribal', 'exclusivo'],
    variants: [
      { id: 'size-xs', name: 'Talla XS', size: 'XS', price: 100, image: '/images/hoodie-negra-eth-cali.png', inStock: true },
      { id: 'size-s', name: 'Talla S', size: 'S', price: 100, image: '/images/hoodie-negra-eth-cali.png', inStock: true },
      { id: 'size-m', name: 'Talla M', size: 'M', price: 100, image: '/images/hoodie-negra-eth-cali.png', inStock: true },
      { id: 'size-l', name: 'Talla L', size: 'L', price: 100, image: '/images/hoodie-negra-eth-cali.png', inStock: true },
      { id: 'size-xl', name: 'Talla XL', size: 'XL', price: 100, image: '/images/hoodie-negra-eth-cali.png', inStock: true },
      { id: 'size-xxl', name: 'Talla XXL', size: 'XXL', price: 100, image: '/images/hoodie-negra-eth-cali.png', inStock: true },
    ],
  },
];

export const NAVIGATION_ITEMS = [
  { name: 'Inicio', href: '/' },
  { name: 'Catálogo', href: '/catalog' },
  { name: 'Contácto', href: '/contact' },
];

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/ethcali',
  twitter: 'https://twitter.com/ethcali',
  discord: 'https://discord.gg/ethcali',
  telegram: 'https://t.me/ethcali',
  youtube: 'https://youtube.com/@ethcali',
  github: 'https://github.com/ethcali',
};
