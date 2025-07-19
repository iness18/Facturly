"use client";

import { useState } from "react";
import {
  ExternalLink,
  Play,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const showcaseItems = [
  {
    id: 1,
    title: "Dashboard Analytics",
    description: "Interface moderne pour suivre vos performances",
    category: "Dashboard",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center",
    gradient: "from-blue-500 to-purple-600",
    stats: { users: "2.5K", growth: "+24%" },
  },
  {
    id: 2,
    title: "Création de Factures",
    description: "Processus simplifié en 3 étapes",
    category: "Workflow",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&crop=center",
    gradient: "from-purple-500 to-pink-600",
    stats: { users: "5.2K", growth: "+18%" },
  },
  {
    id: 3,
    title: "Templates Personnalisés",
    description: "Designs professionnels adaptés à votre marque",
    category: "Design",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop&crop=center",
    gradient: "from-pink-500 to-orange-600",
    stats: { users: "3.8K", growth: "+32%" },
  },
  {
    id: 4,
    title: "Gestion Clients",
    description: "Centralisez toutes vos relations clients",
    category: "CRM",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=center",
    gradient: "from-green-500 to-blue-600",
    stats: { users: "4.1K", growth: "+15%" },
  },
  {
    id: 5,
    title: "Rapports Avancés",
    description: "Analytics détaillés de votre activité",
    category: "Analytics",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center",
    gradient: "from-indigo-500 to-purple-600",
    stats: { users: "1.9K", growth: "+28%" },
  },
  {
    id: 6,
    title: "Mobile App",
    description: "Facturez depuis n&apos;importe où",
    category: "Mobile",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop&crop=center",
    gradient: "from-cyan-500 to-blue-600",
    stats: { users: "6.3K", growth: "+41%" },
  },
];

const categories = [
  "Tous",
  "Dashboard",
  "Workflow",
  "Design",
  "CRM",
  "Analytics",
  "Mobile",
];

export const ShowcaseSection = () => {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const filteredItems =
    activeCategory === "Tous"
      ? showcaseItems
      : showcaseItems.filter((item) => item.category === activeCategory);

  return (
    <section className="w-full py-20 lg:py-32 relative overflow-hidden">
      {/* Fond avec effets */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-indigo-900/10 to-transparent"></div>
        <div className="absolute top-[10%] left-[5%] w-[20rem] h-[20rem] bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[25rem] h-[25rem] bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-float animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* En-tête */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-purple-300 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Découvrez nos fonctionnalités</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight">
            Explorez notre
            <br />
            <span className="text-gradient-cosmic">Écosystème</span>
          </h2>
          <p className="font-sans text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Découvrez comment Facturly transforme votre façon de gérer votre
            activité avec des outils modernes et intuitifs.
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "glass text-gray-300 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grille des éléments */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative animate-fade-in-up hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Carte principale */}
              <div className="glass rounded-3xl overflow-hidden">
                {/* Image avec overlay */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${item.gradient} opacity-60`}
                  ></div>

                  {/* Overlay avec boutons */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-300 ${
                      hoveredItem === item.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <button className="glass rounded-full p-3 hover:bg-white/20 transition-colors">
                      <Play className="w-5 h-5 text-white" />
                    </button>
                    <button className="glass rounded-full p-3 hover:bg-white/20 transition-colors">
                      <ExternalLink className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  {/* Badge catégorie */}
                  <div className="absolute top-4 left-4">
                    <span className="glass rounded-full px-3 py-1 text-xs font-medium text-white">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Statistiques */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-gray-300">
                          {item.stats.users}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400">
                          {item.stats.growth}
                        </span>
                      </div>
                    </div>
                    <Zap className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Effet de glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${
                  item.gradient
                } opacity-20 rounded-3xl blur-xl -z-10 transition-opacity duration-300 ${
                  hoveredItem === item.id ? "opacity-40" : "opacity-20"
                }`}
              ></div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="glass rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
              Prêt à découvrir toutes nos fonctionnalités ?
            </h3>
            <p className="text-gray-300 mb-6">
              Explorez l&apos;interface complète et découvrez comment Facturly
              peut transformer votre activité.
            </p>
            <button className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold py-4 px-8 rounded-2xl hover-lift animate-pulse-glow transition-all">
              Explorer la démo interactive
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
