import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { CartProvider } from './contexts/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'ETH Cali Merch - El Jardín Infinito del Pacífico Colombiano',
  description: 'Tienda oficial de ETH Cali. Merchandise del ecosistema web3 del Pacífico Colombiano. Camisetas, hoodies, stickers y más.',
  keywords: 'ETH Cali, Ethereum, Web3, Colombia, Pacífico, Merchandise, Blockchain',
  authors: [{ name: 'ETH Cali' }],
  openGraph: {
    title: 'ETH Cali Merch - El Jardín Infinito del Pacífico Colombiano',
    description: 'Tienda oficial de ETH Cali. Merchandise del ecosistema web3 del Pacífico Colombiano.',
    type: 'website',
    locale: 'es_CO',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
