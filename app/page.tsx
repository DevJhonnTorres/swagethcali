'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Users, Zap, Globe, Calendar, MapPin, GraduationCap } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import { SAMPLE_PRODUCTS } from '@/app/lib/constants';
import { useScrollReveal } from '@/app/hooks/useScrollReveal';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState(SAMPLE_PRODUCTS.slice(0, 4));
  
  // Scroll reveal refs
  const missionRef = useScrollReveal(0.2);
  const productsRef = useScrollReveal(0.1);
  const ctaRef = useScrollReveal(0.2);

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

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-[2] py-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Hero Content */}
            <div className="hero-content text-center lg:text-left">
              <h1 className="glitch mb-4 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl" data-text="El Jardín Infinito">
                El Jardín Infinito
              </h1>
              <h2 className="text-cyber-blue text-lg sm:text-xl lg:text-2xl xl:text-3xl mb-4 lg:mb-6 font-heading">
                Del Pacífico Colombiano
              </h2>
              <p className="text-text-secondary text-base sm:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 mb-6 lg:mb-8 leading-relaxed">
                Estamos construyendo alianzas con universidades, empresas y gobierno local 
                para potenciar el ecosistema web3 del pacífico colombiano con tecnologías de ethereum
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/catalog" className="btn-primary text-sm sm:text-base px-6 py-3 lg:px-8 lg:py-4">
                  <span>Explorar Catálogo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                <Link href="/contact" className="btn-secondary text-sm sm:text-base px-6 py-3 lg:px-8 lg:py-4">
                  <span>Conoce Más</span>
                  <Globe className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hero-visual relative flex justify-center items-center h-64 sm:h-80 lg:h-96 xl:h-[500px] mt-8 lg:mt-0">
              {/* Ethereum Symbol */}
              <div className="eth-symbol w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 opacity-60 relative z-[1]">
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
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-[2]">
          <div className="flex flex-col items-center text-cyber-blue">
            <span className="text-xs sm:text-sm mb-2 font-body">Scroll</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-90" />
          </div>
        </div>
      </section>


      {/* Mission Section */}
      <section id="mission" ref={missionRef} className="py-12 sm:py-16 lg:py-24 bg-brand-black relative overflow-hidden scroll-reveal-blur">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyber-blue/30 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyber-pink/40 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-cyber-purple/30 rounded-full animate-bounce"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-[2]">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-heading text-text-primary mb-4 animate-glitch-reveal">
              Nuestra Misión
            </h2>
            <div className="cyber-line mx-auto animate-slide-up"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="mission-text text-center lg:text-left space-y-6">
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <p className="text-text-secondary text-base sm:text-lg lg:text-xl leading-relaxed hover:text-cyber-blue transition-colors duration-300">
                  Nuestra misión es cultivar, impulsar y potenciar el ecosistema web3 del pacífico colombiano construido sobre ethereum.
                </p>
              </div>
              
              <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <p className="text-text-secondary text-base sm:text-lg lg:text-xl leading-relaxed hover:text-cyber-blue transition-colors duration-300">
                  Nuestra estrategia se basa en alianzas estratégicas con universidades, empresas y gobierno para co-crear actividades que permitan
                </p>
              </div>
              
              <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center space-x-3 group cursor-pointer">
                  <div className="w-2 h-2 bg-cyber-blue rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                  <p className="text-text-secondary text-base sm:text-lg group-hover:text-cyber-blue transition-colors duration-300">
                    Educación para apoyar al público general,
                  </p>
                </div>
                <div className="flex items-center space-x-3 group cursor-pointer">
                  <div className="w-2 h-2 bg-cyber-pink rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                  <p className="text-text-secondary text-base sm:text-lg group-hover:text-cyber-pink transition-colors duration-300">
                    Capacitación el talento de las empresas
                  </p>
                </div>
                <div className="flex items-center space-x-3 group cursor-pointer">
                  <div className="w-2 h-2 bg-cyber-purple rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                  <p className="text-text-secondary text-base sm:text-lg group-hover:text-cyber-purple transition-colors duration-300">
                    Financiación para potenciar proyectos web3 locales.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mission-visual flex justify-center mt-8 lg:mt-0">
              <div className="relative group scroll-reveal-scale">
                {/* Outer rotating ring */}
                <div className="absolute inset-0 w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 xl:w-48 xl:h-48 border border-cyber-blue/20 rounded-full animate-spin-slow"></div>
                
                {/* Portal effect ring */}
                <div className="absolute inset-0 w-40 h-40 sm:w-44 sm:h-44 lg:w-48 lg:h-48 xl:w-56 xl:h-56 border border-cyber-purple/10 rounded-full animate-portal-open"></div>
                
                {/* Main hexagon */}
                <div className="cyber-hexagon w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 xl:w-40 xl:h-40 bg-gradient-to-br from-eth-gray/10 to-eth-dark/10 border-2 border-eth-gray/30 rounded-full flex items-center justify-center group-hover:border-cyber-blue/60 group-hover:shadow-lg group-hover:shadow-cyber-blue/20 transition-all duration-500 animate-pulse-glow-scroll">
                  <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-cyber-blue group-hover:scale-110 transition-transform duration-500 animate-float">🌱</div>
                </div>
                
                {/* Floating particles */}
                <div className="absolute -top-2 -right-2 w-1 h-1 bg-cyber-blue/60 rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-cyber-pink/60 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 -right-4 w-1 h-1 bg-cyber-purple/60 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section ref={productsRef} className="py-12 sm:py-16 lg:py-24 bg-brand-black relative overflow-hidden scroll-reveal-up">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/6 w-3 h-3 bg-cyber-blue/20 rounded-full animate-pulse"></div>
          <div className="absolute top-2/3 right-1/6 w-2 h-2 bg-cyber-pink/30 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-cyber-purple/25 rounded-full animate-bounce"></div>
          <div className="absolute bottom-1/4 right-1/3 w-2.5 h-2.5 bg-cyber-blue/15 rounded-full animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-[2]">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-heading text-text-primary mb-4 animate-glitch-reveal">
              Nuevos Lanzamientos
            </h2>
            <div className="cyber-line mx-auto animate-slide-up"></div>
            <p className="text-text-secondary text-base sm:text-lg lg:text-xl mt-4 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Descubre nuestra colección especial 4:20 y más productos exclusivos
            </p>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <ProductGrid products={featuredProducts} />
          </div>

          <div className="text-center mt-8 sm:mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Link href="/catalog" className="btn-primary text-sm sm:text-base px-6 py-3 lg:px-8 lg:py-4 group hover:scale-105 transition-transform duration-300 animate-pulse-glow-scroll">
              <span>Ver Todo el Catálogo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-12 sm:py-16 lg:py-24 bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink relative overflow-hidden scroll-reveal-blur">
        {/* Portal effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyber-blue/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-[2]">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-heading text-text-primary mb-4 sm:mb-6 lg:mb-8 animate-glitch-reveal">
            Únete a la Familia ETH Cali
          </h2>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-text-primary/90 mb-8 sm:mb-10 lg:mb-12 font-body max-w-4xl mx-auto animate-fade-in">
            Sé parte del ecosistema web3 más vibrante del Pacífico Colombiano
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Link
              href="/catalog"
              className="bg-brand-black text-cyber-blue hover:bg-cyber-blue hover:text-brand-black font-heading text-sm sm:text-base lg:text-xl px-6 py-3 sm:px-8 sm:py-4 lg:px-12 lg:py-6 rounded transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center justify-center space-x-2 sm:space-x-3"
            >
              <span>Comprar Ahora</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </Link>
            
            <Link
              href="/contact"
              className="border-2 border-text-primary text-text-primary hover:bg-text-primary hover:text-brand-black font-heading text-sm sm:text-base lg:text-xl px-6 py-3 sm:px-8 sm:py-4 lg:px-12 lg:py-6 rounded transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center justify-center space-x-2 sm:space-x-3"
            >
              <span>Contactar</span>
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
