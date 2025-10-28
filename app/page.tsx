'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Users, Zap, Globe, Calendar, MapPin, GraduationCap } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import { SAMPLE_PRODUCTS } from '@/app/lib/constants';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState(SAMPLE_PRODUCTS.slice(0, 4));

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Noise Overlay */}
      <div className="fixed inset-0 opacity-[0.03] z-[1000] pointer-events-none" 
           style={{
             backgroundImage: `url("data:image/png;base64,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")`
           }}>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-brand-black to-black">
        {/* Cyber Grid Background */}
        <div className="cyber-grid"></div>
        
        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-cyber-blue/10 via-transparent to-transparent pointer-events-none z-[1]"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-[2]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <div className="hero-content">
              <h1 className="glitch mb-4" data-text="El Jardín Infinito">
                El Jardín Infinito
              </h1>
              <h2 className="text-cyber-blue text-2xl mb-6 font-heading">
                Del Pacífico Colombiano
              </h2>
              <p className="text-text-secondary text-lg max-w-lg mb-8 leading-relaxed">
                Estamos construyendo alianzas con universidades, empresas y gobierno local 
                para potenciar el ecosistema web3 del pacífico colombiano con tecnologías de ethereum
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/catalog" className="btn-primary">
                  <span>Explorar Catálogo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                <Link href="/about" className="btn-secondary">
                  <span>Conoce Más</span>
                  <Globe className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hero-visual relative flex justify-center items-center h-96">
              {/* Ethereum Symbol */}
              <div className="eth-symbol w-80 h-80 opacity-60 relative z-[1]">
                <svg viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto animate-float">
                  <path d="M959.8 80.7L420.1 976.3 959.8 731z" fill="#8A92B2"/>
                  <path d="M959.8 731L420.1 976.3l539.7 319.1zm539.8 245.3L959.8 80.7V731z" fill="#62688F"/>
                  <path d="M959.8 1295.4l539.8-319.1L959.8 731z" fill="#454A75"/>
                  <path d="M420.1 1078.7l539.7 760.6v-441.7z" fill="#8A92B2"/>
                  <path d="M959.8 1397.6v441.7l540.1-760.6z" fill="#62688F"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-[2]">
          <div className="flex flex-col items-center text-cyber-blue">
            <span className="text-sm mb-2 font-body">Scroll</span>
            <ArrowRight className="w-4 h-4 rotate-90" />
          </div>
        </div>
      </section>


      {/* Mission Section */}
      <section id="mission" className="py-24 bg-brand-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-heading text-text-primary mb-4">Nuestra Misión</h2>
            <div className="cyber-line mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="mission-text">
              <p className="text-text-secondary text-lg mb-6 leading-relaxed">
                Nuestra misión es cultivar, impulsar y potenciar el ecosistema web3 del pacífico colombiano construido sobre ethereum.
              </p>
              <p className="text-text-secondary text-lg mb-6 leading-relaxed">
                Nuestra estrategia se basa en alianzas estratégicas con universidades, empresas y gobierno para co-crear actividades que permitan
              </p>
              <div className="space-y-4">
                <p className="text-text-secondary text-lg">- Educación para apoyar al público general,</p>
                <p className="text-text-secondary text-lg">- Capacitación el talento de las empresas</p>
                <p className="text-text-secondary text-lg">- Financiación para potenciar proyectos web3 locales.</p>
              </div>
            </div>
            
            <div className="mission-visual flex justify-center">
              <div className="cyber-hexagon w-32 h-32 bg-gradient-to-br from-eth-gray/10 to-eth-dark/10 border-2 border-eth-gray/30 rounded-full flex items-center justify-center">
                <div className="text-6xl text-cyber-blue">🌱</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-heading text-text-primary mb-4">Nuevos Lanzamientos</h2>
            <div className="cyber-line mx-auto"></div>
            <p className="text-text-secondary text-lg mt-4">
              Descubre nuestra colección especial 4:20 y más productos exclusivos
            </p>
          </div>

          <ProductGrid products={featuredProducts} />

          <div className="text-center mt-12">
            <Link href="/catalog" className="btn-primary">
              <span>Ver Todo el Catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-6xl font-heading text-text-primary mb-8">
            Únete a la Familia ETH Cali
          </h2>
          <p className="text-2xl text-text-primary/90 mb-12 font-body">
            Sé parte del ecosistema web3 más vibrante del Pacífico Colombiano
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/catalog"
              className="bg-brand-black text-cyber-blue hover:bg-cyber-blue hover:text-brand-black font-heading text-xl px-12 py-6 rounded transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center space-x-3"
            >
              <span>Comprar Ahora</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
            
            <Link
              href="/contact"
              className="border-2 border-text-primary text-text-primary hover:bg-text-primary hover:text-brand-black font-heading text-xl px-12 py-6 rounded transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center space-x-3"
            >
              <span>Contactar</span>
              <Globe className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
