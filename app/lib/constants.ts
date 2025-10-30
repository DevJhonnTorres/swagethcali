import { Product } from '@/app/types';

// Chains configuration - Temporalmente deshabilitado
// export const CHAINS = [...];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Gorra Privacy is Freedom',
    description: 'Gorra blanca de béisbol con logo de Ethereum en colores pastel. Diseño exclusivo ETH Cali con mensaje "Privacy is Freedom" en la parte posterior.',
    price: 120000,
    originalPrice: 150000,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop&crop=center'],
    category: 'Accesorios',
    inStock: true,
    isOnSale: true,
    tags: ['gorra', 'ethereum', 'blanco'],
    variants: [
      {
        id: '1-white',
        name: 'Blanco',
        price: 120000,
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop&crop=center',
        inStock: true,
      },
      {
        id: '1-black',
        name: 'Negro',
        price: 120000,
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop&crop=center',
        inStock: true,
      },
    ],
  },
  {
    id: '2',
    name: 'Gorra Privacy is Normal',
    description: 'Gorra negra de béisbol con logo de Ethereum holográfico. Diseño exclusivo con mensaje "Privacy is Normal" en la parte posterior.',
    price: 120000,
    originalPrice: 150000,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop&crop=center'],
    category: 'Accesorios',
    inStock: true,
    isOnSale: true,
    tags: ['gorra', 'ethereum', 'negro', 'holográfico'],
  },
  {
    id: '3',
    name: 'Hoodie Privacy Magic',
    description: 'Sudadera crema con diseño místico de Ethereum. Front con emblema ETH-CO L.G.L.T. Back con ilustración de hands holding crystal.',
    price: 250000,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop&crop=center'],
    category: 'Ropa',
    inStock: true,
    isOnSale: false,
    tags: ['hoodie', 'crema', 'místico', 'privacy'],
  },
  {
    id: '4',
    name: 'Hoodie ETH Cali Original',
    description: 'Sudadera negra con logo ETH CO CALI en la manga. Front con hands holding crystal. Back con diseño tribal de 5 figuras alrededor del crystal de Ethereum.',
    price: 280000,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop&crop=center'],
    category: 'Ropa',
    inStock: true,
    isOnSale: false,
    tags: ['hoodie', 'negro', 'tribal', 'exclusivo'],
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
