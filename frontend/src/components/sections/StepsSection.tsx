"use client";

import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Créez votre compte",
    description:
      "Inscrivez-vous en quelques secondes et configurez votre profil professionnel.",
    features: [
      "Configuration rapide",
      "Profil personnalisé",
      "Sécurité renforcée",
    ],
  },
  {
    number: "02",
    title: "Personnalisez vos templates",
    description:
      "Ajoutez votre logo, choisissez vos couleurs et créez des modèles sur mesure.",
    features: ["Templates prêts", "Branding personnel", "Design moderne"],
  },
  {
    number: "03",
    title: "Générez vos factures",
    description:
      "Créez des factures professionnelles en moins de 2 minutes et envoyez-les directement.",
    features: ["Création rapide", "Envoi automatique", "Suivi en temps réel"],
  },
];

export const StepsSection = () => {
  return (
    <section className="w-full py-20 lg:py-32 relative overflow-hidden">
      {/* Fond avec effets */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"></div>
        <div className="absolute top-[20%] right-[10%] w-[30rem] h-[30rem] bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[25rem] h-[25rem] bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* En-tête */}
        <div className="text-center space-y-6 mb-20">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-purple-300 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>3 étapes simples</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight">
            Commencez en
            <br />
            <span className="text-gradient-cosmic">3 étapes faciles</span>
          </h2>
          <p className="font-sans text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Notre processus simplifié vous permet de commencer à facturer
            professionnellement en quelques minutes seulement.
          </p>
        </div>

        {/* Étapes */}
        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Ligne de connexion */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 md:left-16 top-24 w-0.5 h-32 bg-gradient-to-b from-purple-500 to-transparent hidden md:block"></div>
              )}

              <div
                className={`flex flex-col md:flex-row items-start gap-8 mb-16 animate-fade-in-up`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Numéro et icône */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 md:w-20 md:h-20 glass rounded-2xl flex items-center justify-center mb-4 hover-lift">
                      <span className="text-2xl md:text-3xl font-bold text-gradient-cosmic">
                        {step.number}
                      </span>
                    </div>
                    {/* Effet de glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl blur-xl -z-10"></div>
                  </div>
                </div>

                {/* Contenu */}
                <div className="flex-1">
                  <div className="glass rounded-3xl p-6 md:p-8 hover-lift">
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Fonctionnalités */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {step.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-sm text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Flèche de progression */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center w-12 h-12 glass rounded-full animate-pulse">
                    <ArrowRight className="w-6 h-6 text-purple-400" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA final */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <button className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold py-4 px-8 rounded-2xl hover-lift animate-pulse-glow transition-all">
              Commencer maintenant
            </button>
            <button className="glass border-white/20 text-white font-bold py-4 px-8 rounded-2xl hover-lift transition-all">
              Voir la démo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
