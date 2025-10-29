export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  inStock: boolean;
  isOnSale: boolean;
  tags: string[];
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variant?: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface User {
  id: string;
  address: string;
  name?: string;
  email?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  user: User;
  createdAt: Date;
  transactionHash?: string;
}

