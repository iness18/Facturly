"use client";

import { useState, useEffect } from "react";
import { Menu, X, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Accueil", href: "#home" },
  {
    name: "Fonctionnalités",
    href: "#features",
    submenu: [
      { name: "Création de factures", href: "#invoicing" },
      { name: "Gestion clients", href: "#clients" },
      { name: "Rapports", href: "#reports" },
      { name: "API", href: "#api" },
    ],
  },
  { name: "Tarifs", href: "#pricing" },
  { name: "À propos", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="font-display text-xl md:text-2xl font-bold text-white">
              Facturly
            </span>
          </div>

          {/* Navigation desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => item.submenu && setActiveSubmenu(item.name)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <a
                  href={item.href}
                  className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors font-medium"
                >
                  {item.name}
                  {item.submenu && (
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  )}
                </a>

                {/* Submenu */}
                {item.submenu && activeSubmenu === item.name && (
                  <div className="absolute top-full left-0 mt-2 w-56 glass rounded-2xl border border-white/10 py-2 animate-fade-in-up">
                    {item.submenu.map((subItem) => (
                      <a
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {subItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Boutons d'action desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="outline"
              className="glass border-white/20 text-white hover:bg-white/10"
            >
              Connexion
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity">
              Commencer
            </Button>
          </div>

          {/* Menu mobile */}
          <button
            className="lg:hidden w-10 h-10 glass rounded-xl flex items-center justify-center text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu mobile ouvert */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 glass border-t border-white/10 animate-fade-in-up">
            <div className="container mx-auto px-4 py-6">
              <div className="space-y-4">
                {navItems.map((item) => (
                  <div key={item.name}>
                    <a
                      href={item.href}
                      className="block text-gray-300 hover:text-white transition-colors font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </a>
                    {item.submenu && (
                      <div className="ml-4 space-y-2 mt-2">
                        {item.submenu.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            className="block text-sm text-gray-400 hover:text-gray-300 transition-colors py-1"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 mt-6 pt-6 space-y-3">
                <Button
                  variant="outline"
                  className="w-full glass border-white/20 text-white hover:bg-white/10"
                >
                  Connexion
                </Button>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity">
                  Commencer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
