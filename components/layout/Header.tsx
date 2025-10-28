'use client';

import { useState } from 'react';
import Link from 'next/link';
// import { ConnectButton } from '@coinbase/onchainkit';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';
import { NAVIGATION_ITEMS, SOCIAL_LINKS } from '@/app/lib/constants';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cart } = useCart();

  return (
    <header className="bg-brand-black/95 backdrop-blur-sm border-b border-eth-gray/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cyber-blue rounded flex items-center justify-center">
              <span className="text-brand-black font-heading font-black text-lg">E</span>
            </div>
            <span className="text-2xl font-heading font-black text-text-primary">ETH Cali Merch</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-text-secondary hover:text-cyber-blue font-body font-medium transition-colors uppercase tracking-wide"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-text-secondary hover:text-cyber-blue transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-text-secondary hover:text-cyber-blue transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyber-blue text-brand-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-heading font-bold">
                  {cart.itemCount}
                </span>
              )}
            </Link>

            {/* Connect Wallet - Temporalmente deshabilitado */}
            <button className="btn-secondary text-sm px-4 py-2">
              Conectar Wallet
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-secondary-600 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-eth-gray/30">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full px-4 py-2 pl-10 bg-bg-card/50 border border-eth-gray/30 rounded text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-cyber-blue focus:border-cyber-blue focus:outline-none font-body"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary-200">
            <nav className="flex flex-col space-y-4">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Social Links */}
              <div className="pt-4 border-t border-secondary-200">
                <p className="text-sm text-secondary-500 mb-2">Síguenos</p>
                <div className="flex space-x-4">
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary-600 hover:text-primary-600 transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href={SOCIAL_LINKS.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary-600 hover:text-primary-600 transition-colors"
                  >
                    Twitter
                  </a>
                  <a
                    href={SOCIAL_LINKS.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary-600 hover:text-primary-600 transition-colors"
                  >
                    Discord
                  </a>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
