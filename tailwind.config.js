/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ETH Cali Brand Colors
        brand: {
          black: '#0c0c11',
          blue: '#2d25ff',
        },
        cyber: {
          blue: '#2d25ff',
          pink: '#ff00ff',
          purple: '#9900ff',
          green: '#0000b3',
        },
        eth: {
          blue: '#3498db',
          'blue-light': '#64b5f6',
          'blue-dark': '#1565c0',
          gray: '#8a92b2',
          dark: '#454a75',
        },
        bg: {
          dark: '#0c0c11',
          darker: '#050505',
          card: 'rgba(20, 20, 20, 0.7)',
          glass: 'rgba(30, 30, 30, 0.3)',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b0b0b0',
          accent: '#2d25ff',
        }
      },
      fontFamily: {
        heading: ['Orbitron', 'sans-serif'],
        body: ['Space Mono', 'monospace'],
        alt: ['Share Tech Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
