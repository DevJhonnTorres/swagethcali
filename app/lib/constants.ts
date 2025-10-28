import { Product } from '@/app/types';

// Chains configuration - Temporalmente deshabilitado
// export const CHAINS = [...];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'SPECIAL 4:20 2.0',
    description: 'Camiseta especial de la colección 4:20 con diseño único de ETH Cali',
    price: 150000,
    originalPrice: 200000,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&crop=center', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&crop=center'],
    category: 'Ropa',
    inStock: true,
    isOnSale: true,
    tags: ['nuevo', 'especial', '4:20'],
    variants: [
      {
        id: '1-black',
        name: 'Negro',
        price: 150000,
        image: '/images/product-1-black.jpg',
        inStock: true,
      },
      {
        id: '1-white',
        name: 'Blanco',
        price: 150000,
        image: '/images/product-1-white.jpg',
        inStock: true,
      },
    ],
  },
  {
    id: '2',
    name: 'SPECIAL 4:20 2.0 BLACK',
    description: 'Versión negra de la camiseta especial 4:20',
    price: 150000,
    originalPrice: 200000,
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&h=500&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&h=500&fit=crop&crop=center'],
    category: 'Ropa',
    inStock: true,
    isOnSale: true,
    tags: ['nuevo', 'especial', '4:20', 'negro'],
  },
  {
    id: '3',
    name: 'Hoodie ETH Cali',
    description: 'Sudadera con capucha del ecosistema ETH Cali',
    price: 250000,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop&crop=center'],
    category: 'Ropa',
    inStock: true,
    isOnSale: false,
    tags: ['hoodie', 'abrigo'],
  },
  {
    id: '4',
    name: 'Sticker Pack',
    description: 'Pack de stickers con logos de ETH Cali y partners',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=500&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=500&fit=crop&crop=center'],
    category: 'Accesorios',
    inStock: true,
    isOnSale: false,
    tags: ['stickers', 'pack'],
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
