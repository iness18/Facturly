"use client";

import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";

const footerLinks = {
  product: [
    { name: "Fonctionnalités", href: "#features" },
    { name: "Tarifs", href: "#pricing" },
    { name: "Démo", href: "#demo" },
    { name: "API", href: "#api" },
  ],
  company: [
    { name: "À propos", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Carrières", href: "#careers" },
    { name: "Contact", href: "#contact" },
  ],
  support: [
    { name: "Centre d'aide", href: "#help" },
    { name: "Documentation", href: "#docs" },
    { name: "Statut", href: "#status" },
    { name: "Communauté", href: "#community" },
  ],
  legal: [
    { name: "Confidentialité", href: "#privacy" },
    { name: "Conditions", href: "#terms" },
    { name: "Cookies", href: "#cookies" },
    { name: "RGPD", href: "#gdpr" },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
  { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:text-blue-600" },
  { name: "GitHub", icon: Github, href: "#", color: "hover:text-gray-300" },
  { name: "Email", icon: Mail, href: "#", color: "hover:text-purple-400" },
];

export const Footer = () => {
  return (
    <footer className="relative w-full bg-gradient-to-b from-transparent to-black/50 pt-20 pb-8">
      {/* Fond avec effets */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        <div className="absolute top-[20%] left-[10%] w-[20rem] h-[20rem] bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[15rem] h-[15rem] bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section principale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Branding */}
          <div className="lg:col-span-4">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="font-display text-2xl font-bold text-white">
                  Facturly
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed max-w-md">
                La solution de facturation moderne qui simplifie votre gestion
                administrative. Créée par des freelances, pour des freelances.
              </p>

              {/* Contact info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <span className="text-sm">Paris, France</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-5 h-5 text-purple-400" />
                  <span className="text-sm">+33 1 23 45 67 89</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <span className="text-sm">contact@facturly.com</span>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 glass rounded-xl flex items-center justify-center text-gray-400 transition-all duration-300 hover-lift ${social.color}`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Liens */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-display text-lg font-semibold text-white mb-4">
                  Produit
                </h3>
                <ul className="space-y-3">
                  {footerLinks.product.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-display text-lg font-semibold text-white mb-4">
                  Entreprise
                </h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-display text-lg font-semibold text-white mb-4">
                  Support
                </h3>
                <ul className="space-y-3">
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-display text-lg font-semibold text-white mb-4">
                  Légal
                </h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="glass rounded-3xl p-8 mb-12">
          <div className="text-center space-y-4">
            <h3 className="font-display text-2xl font-bold text-white">
              Restez informé des nouveautés
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Recevez nos dernières mises à jour, conseils et astuces
              directement dans votre boîte mail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-3 px-6 rounded-xl hover-lift transition-all">
                S&apos;abonner
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2025 Facturly. Tous droits réservés.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>Fait avec ❤️ en France</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Tous systèmes opérationnels</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
