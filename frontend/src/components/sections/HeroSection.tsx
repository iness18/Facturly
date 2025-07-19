"use client";

import { Button } from "@/components/ui/button";
import { MoveRight, Sparkles, Zap, TrendingUp } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center text-center overflow-hidden">
      {/* Fond gradient complexe */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0D1127] via-[#1a1a2e] to-[#16213e]"></div>

        {/* Orbes flottants avec gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-gradient-to-r from-purple-600/40 to-pink-600/40 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-gradient-to-r from-blue-600/40 to-cyan-600/40 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-[20%] right-[10%] w-[20rem] h-[20rem] bg-gradient-to-r from-indigo-600/30 to-purple-600/30 rounded-full blur-2xl animate-float animation-delay-2000"></div>

        {/* Particules flottantes */}
        <div className="absolute top-[10%] left-[20%] w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-[30%] right-[30%] w-1 h-1 bg-blue-400 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-[40%] left-[10%] w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse animation-delay-2000"></div>

        {/* Grille subtile */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="z-10 flex flex-col items-center space-y-8 px-4 max-w-6xl mx-auto">
        {/* Badge de statut */}
        <div className="glass rounded-full px-6 py-2 animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm text-purple-300">
            <Sparkles className="w-4 h-4" />
            <span>Nouvelle version disponible</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Titre principal */}
        <div className="space-y-4 animate-fade-in-up animation-delay-200">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-tight">
            Votre Facturation,
            <br />
            <span className="text-gradient-cosmic animate-gradient">
              Réinventée.
            </span>
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-purple-300">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>Rapide</span>
            </div>
            <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>Moderne</span>
            </div>
            <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              <span>Intuitif</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="font-sans text-lg md:text-xl max-w-3xl text-gray-300 leading-relaxed animate-fade-in-up animation-delay-400">
          Générez des factures professionnelles en quelques clics. Simple,
          puissant et conçu pour les créatifs comme vous. Rejoignez plus de{" "}
          <span className="text-purple-400 font-semibold">10,000+</span>{" "}
          freelances qui nous font confiance.
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-600">
          <Button
            size="lg"
            className="font-bold text-lg bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:opacity-90 transition-all duration-300 hover-lift animate-pulse-glow px-8 py-4"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Commencer Gratuitement <MoveRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="font-bold text-lg glass border-white/20 hover:bg-white/10 transition-all duration-300 hover-lift px-8 py-4"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Voir le Dashboard
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-8 mt-16 animate-fade-in-up animation-delay-800">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">
              10K+
            </div>
            <div className="text-sm text-gray-400">Utilisateurs actifs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">
              50K+
            </div>
            <div className="text-sm text-gray-400">Factures générées</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">
              99.9%
            </div>
            <div className="text-sm text-gray-400">Disponibilité</div>
          </div>
        </div>
      </div>

      {/* Indicateur de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};
