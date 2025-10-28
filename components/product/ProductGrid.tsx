'use client';

import { Product } from '@/app/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export default function ProductGrid({ products, title, subtitle }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-text-secondary text-lg mb-2 font-body">No se encontraron productos</div>
        <p className="text-text-secondary font-body">Intenta con otros filtros o términos de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {(title || subtitle) && (
        <div className="text-center">
          {title && (
            <h2 className="text-3xl font-heading font-bold text-text-primary mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-text-secondary max-w-2xl mx-auto font-body">{subtitle}</p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
