import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden">
      {/* Fond "Aurora" */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0D1127]"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-purple-600/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-600/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="z-10 flex flex-col items-center space-y-8">
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white animate-fade-in-up">
          Votre Facturation,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            Réinventée.
          </span>
        </h1>
        <p className="font-sans text-lg md:text-xl max-w-2xl text-gray-300 animate-fade-in-up animation-delay-200">
          Générez des factures professionnelles en quelques clics. Simple,
          puissant et conçu pour les créatifs comme vous.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-400">
          <Button
            size="lg"
            className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-opacity"
          >
            Commencer Gratuitement <MoveRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="font-bold text-lg bg-white/5 border-white/20 hover:bg-white/10 backdrop-blur-md"
          >
            Parler à un expert
          </Button>
        </div>
      </div>
    </section>
  );
};
