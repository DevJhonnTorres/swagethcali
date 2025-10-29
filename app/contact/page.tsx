'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone, Send, Instagram, Twitter, MessageCircle, Send as Telegram } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí implementarías el envío del formulario
    console.log('Form submitted:', formData);
    alert('¡Mensaje enviado! Te contactaremos pronto.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Cyber Grid Background */}
      <div className="cyber-grid"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 relative z-[2]">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="glitch text-4xl lg:text-6xl font-heading text-text-primary mb-4" data-text="CONTACTO">
            CONTACTO
          </h1>
          <div className="cyber-line mx-auto mb-6"></div>
          <p className="text-lg lg:text-xl text-text-secondary max-w-3xl mx-auto font-body">
            ¿Tienes preguntas sobre nuestros productos o quieres saber más sobre ETH Cali? 
            Estamos aquí para ayudarte.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="card">
            <h2 className="text-2xl lg:text-3xl font-heading text-cyber-blue mb-6">
              ENVÍANOS UN MENSAJE
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2 font-body">
                    TU NOMBRE COMPLETO *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-card/50 border border-eth-gray/30 rounded text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-cyber-blue focus:border-cyber-blue focus:outline-none font-body"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2 font-body">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-card/50 border border-eth-gray/30 rounded text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-cyber-blue focus:border-cyber-blue focus:outline-none font-body"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-2 font-body">
                  ¿EN QUÉ PODEMOS AYUDARTE? *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-card/50 border border-eth-gray/30 rounded text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-cyber-blue focus:border-cyber-blue focus:outline-none font-body"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2 font-body">
                  CUÉNTANOS MÁS DETALLES... *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-card/50 border border-eth-gray/30 rounded text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-cyber-blue focus:border-cyber-blue focus:outline-none font-body resize-none"
                  placeholder="Cuéntanos más detalles..."
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary text-lg py-4 px-8 inline-flex items-center justify-center space-x-3"
              >
                <Send className="w-5 h-5" />
                <span>ENVIAR MENSAJE</span>
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 lg:space-y-8">
            {/* Contact Details */}
            <div className="card">
              <h2 className="text-2xl lg:text-3xl font-heading text-cyber-blue mb-6">
                INFORMACIÓN DE CONTACTO
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-cyber-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-cyber-blue" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-text-primary text-lg mb-1">EMAIL</h3>
                    <p className="text-text-secondary font-body">info@ethcali.org</p>
                    <p className="text-text-secondary font-body">merch@ethcali.org</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-cyber-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-cyber-blue" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-text-primary text-lg mb-1">UBICACIÓN</h3>
                    <p className="text-text-secondary font-body">
                      Zonamerica Colombia<br />
                      Calle 36#128-321, Auto. Cali - Jamundi #760030<br />
                      Zona Franca de Servicios Tecnológicos
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-cyber-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-cyber-blue" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-text-primary text-lg mb-1">TELÉFONO</h3>
                    <p className="text-text-secondary font-body">+57 (2) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="card">
              <h2 className="text-2xl lg:text-3xl font-heading text-cyber-blue mb-6">
                SÍGUENOS
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://instagram.com/ethcali"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-bg-card/50 border border-eth-gray/30 rounded hover:border-cyber-pink hover:bg-cyber-pink/10 transition-all group"
                >
                  <div className="w-10 h-10 bg-cyber-pink/20 rounded-lg flex items-center justify-center group-hover:bg-cyber-pink/30 transition-colors">
                    <Instagram className="w-5 h-5 text-cyber-pink" />
                  </div>
                  <div>
                    <span className="font-heading font-bold text-text-primary text-sm">IG</span>
                    <p className="text-text-secondary font-body text-xs">Instagram</p>
                  </div>
                </a>

                <a
                  href="https://twitter.com/ethcali"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-bg-card/50 border border-eth-gray/30 rounded hover:border-cyber-blue hover:bg-cyber-blue/10 transition-all group"
                >
                  <div className="w-10 h-10 bg-cyber-blue/20 rounded-lg flex items-center justify-center group-hover:bg-cyber-blue/30 transition-colors">
                    <Twitter className="w-5 h-5 text-cyber-blue" />
                  </div>
                  <div>
                    <span className="font-heading font-bold text-text-primary text-sm">TW</span>
                    <p className="text-text-secondary font-body text-xs">Twitter</p>
                  </div>
                </a>

                <a
                  href="https://discord.gg/ethcali"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-bg-card/50 border border-eth-gray/30 rounded hover:border-cyber-purple hover:bg-cyber-purple/10 transition-all group"
                >
                  <div className="w-10 h-10 bg-cyber-purple/20 rounded-lg flex items-center justify-center group-hover:bg-cyber-purple/30 transition-colors">
                    <MessageCircle className="w-5 h-5 text-cyber-purple" />
                  </div>
                  <div>
                    <span className="font-heading font-bold text-text-primary text-sm">DC</span>
                    <p className="text-text-secondary font-body text-xs">Discord</p>
                  </div>
                </a>

                <a
                  href="https://t.me/ethcali"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-bg-card/50 border border-eth-gray/30 rounded hover:border-cyber-blue hover:bg-cyber-blue/10 transition-all group"
                >
                  <div className="w-10 h-10 bg-cyber-blue/20 rounded-lg flex items-center justify-center group-hover:bg-cyber-blue/30 transition-colors">
                    <Telegram className="w-5 h-5 text-cyber-blue" />
                  </div>
                  <div>
                    <span className="font-heading font-bold text-text-primary text-sm">TG</span>
                    <p className="text-text-secondary font-body text-xs">Telegram</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
