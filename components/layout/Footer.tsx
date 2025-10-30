import Link from 'next/link';
import { SOCIAL_LINKS } from '@/app/lib/constants';

export default function Footer() {
  return (
    <footer className="relative bg-brand-black border-t border-eth-gray/30 text-white py-12 overflow-hidden">
      {/* Solid background layer to completely block grid pattern */}
      <div className="absolute inset-0 bg-brand-black -z-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-lg flex items-center justify-center border border-cyber-blue/50">
                <span className="text-white font-heading font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-heading font-bold text-white">ETH Cali Merch</span>
            </div>
            <p className="text-text-secondary mb-6 max-w-md">
              El ecosistema web3 del Pacífico Colombiano. Construyendo el futuro de Ethereum 
              con educación, capacitación y financiación para proyectos locales.
            </p>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-4">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyber-blue hover:text-cyber-purple transition-colors"
              >
                Instagram
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyber-blue hover:text-cyber-purple transition-colors"
              >
                Twitter
              </a>
              <a
                href={SOCIAL_LINKS.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyber-blue hover:text-cyber-purple transition-colors"
              >
                Discord
              </a>
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyber-blue hover:text-cyber-purple transition-colors"
              >
                Telegram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4 text-cyber-blue">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-text-secondary hover:text-cyber-blue transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-text-secondary hover:text-cyber-blue transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-secondary hover:text-cyber-blue transition-colors">
                  Contácto
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-text-secondary hover:text-cyber-blue transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4 text-cyber-blue">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-text-secondary hover:text-cyber-blue transition-colors">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-text-secondary hover:text-cyber-blue transition-colors">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-text-secondary hover:text-cyber-blue transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-text-secondary hover:text-cyber-blue transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-eth-gray/30 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-text-secondary text-sm">
              © 2025 ETH Cali Merch - Desarrollada por el ecosistema ETH Cali
            </p>
            
            {/* Language Selector */}
            <div className="mt-4 md:mt-0">
              <select className="bg-bg-card/50 border border-eth-gray/30 text-white text-sm px-3 py-1 rounded">
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

