'use client';

import { useState, useMemo } from 'react';
import { Filter, Grid, List, Search } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import { SAMPLE_PRODUCTS } from '@/app/lib/constants';

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['all', 'Ropa', 'Accesorios'];
  const sortOptions = [
    { value: 'name', label: 'Nombre' },
    { value: 'price-low', label: 'Precio: Menor a Mayor' },
    { value: 'price-high', label: 'Precio: Mayor a Menor' },
    { value: 'newest', label: 'Más Recientes' },
  ];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = SAMPLE_PRODUCTS.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return b.id.localeCompare(a.id);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="glitch text-5xl font-heading text-text-primary mb-4" data-text="CATÁLOGO">
            CATÁLOGO
          </h1>
          <p className="text-xl text-text-secondary font-body">
            Descubre todos nuestros productos del ecosistema ETH Cali
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-bg-card/80 backdrop-blur-sm rounded-lg border border-eth-gray/30 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-bg-card/50 border border-eth-gray/30 rounded text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-cyber-blue focus:border-cyber-blue focus:outline-none font-body"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-bg-card/50 border border-eth-gray/30 rounded text-text-primary focus:ring-2 focus:ring-cyber-blue focus:border-cyber-blue focus:outline-none font-body"
            >
              <option value="all">Todas las categorías</option>
              {categories.slice(1).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-bg-card/50 border border-eth-gray/30 rounded text-text-primary focus:ring-2 focus:ring-cyber-blue focus:border-cyber-blue focus:outline-none font-body"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex border border-eth-gray/30 rounded overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 font-body ${viewMode === 'grid' ? 'bg-cyber-blue text-brand-black' : 'bg-bg-card/50 text-text-secondary hover:bg-cyber-blue hover:text-brand-black'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 font-body ${viewMode === 'list' ? 'bg-cyber-blue text-brand-black' : 'bg-bg-card/50 text-text-secondary hover:bg-cyber-blue hover:text-brand-black'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-2 px-4 py-3 border border-eth-gray/30 rounded bg-bg-card/50 text-text-primary hover:bg-cyber-blue hover:text-brand-black font-body"
            >
              <Filter className="w-5 h-5" />
              <span>FILTROS</span>
            </button>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-eth-gray/30 lg:hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2 font-body">
                    CATEGORÍA
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-card/50 border border-eth-gray/30 rounded text-text-primary focus:ring-2 focus:ring-cyber-blue focus:border-cyber-blue focus:outline-none font-body"
                  >
                    <option value="all">Todas las categorías</option>
                    {categories.slice(1).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2 font-body">
                    ORDENAR POR
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-card/50 border border-eth-gray/30 rounded text-text-primary focus:ring-2 focus:ring-cyber-blue focus:border-cyber-blue focus:outline-none font-body"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-text-secondary font-body">
            Mostrando {filteredAndSortedProducts.length} de {SAMPLE_PRODUCTS.length} productos
          </p>
        </div>

        {/* Products Grid */}
        <ProductGrid 
          products={filteredAndSortedProducts}
          title=""
          subtitle=""
        />
      </div>
    </div>
  );
}
