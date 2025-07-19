import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  FileText,
  Zap,
  Palette,
  Shield,
  BarChart3,
  Users,
  Clock,
  Sparkles,
} from "lucide-react";
import { MoveRight } from "lucide-react";

const features = [
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Création Rapide",
    description:
      "Générez des factures en moins de 60 secondes grâce à une interface intuitive et des modèles prêts à l&apos;emploi.",
    gradient: "from-yellow-400 to-orange-500",
    bgGradient: "from-yellow-500/20 to-orange-500/20",
  },
  {
    icon: <Palette className="h-8 w-8" />,
    title: "Personnalisation",
    description:
      "Adaptez vos factures à votre image de marque. Ajoutez votre logo, choisissez vos couleurs et polices.",
    gradient: "from-purple-400 to-pink-500",
    bgGradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Suivi Simplifié",
    description:
      "Gardez un œil sur vos paiements, vos clients et vos revenus depuis un tableau de bord centralisé et clair.",
    gradient: "from-green-400 to-blue-500",
    bgGradient: "from-green-500/20 to-blue-500/20",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Sécurité Renforcée",
    description:
      "Vos données sont protégées par un chiffrement de niveau bancaire et des sauvegardes automatiques.",
    gradient: "from-blue-400 to-indigo-500",
    bgGradient: "from-blue-500/20 to-indigo-500/20",
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Analytics Avancés",
    description:
      "Analysez vos performances avec des rapports détaillés et des insights sur votre activité.",
    gradient: "from-indigo-400 to-purple-500",
    bgGradient: "from-indigo-500/20 to-purple-500/20",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Gestion Clients",
    description:
      "Centralisez toutes les informations de vos clients et automatisez vos relances de paiement.",
    gradient: "from-pink-400 to-red-500",
    bgGradient: "from-pink-500/20 to-red-500/20",
  },
];

const stats = [
  { icon: Clock, value: "< 2min", label: "Temps de création" },
  { icon: Users, value: "10K+", label: "Utilisateurs actifs" },
  { icon: FileText, value: "50K+", label: "Factures générées" },
  { icon: Sparkles, value: "99.9%", label: "Satisfaction client" },
];

export const FeaturesSection = () => {
  return (
    <section className="w-full py-20 lg:py-32 relative">
      {/* Fond avec gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* En-tête de section */}
        <div className="text-center space-y-6 mb-20">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-purple-300 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Fonctionnalités</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight">
            Une Expérience
            <br />
            <span className="text-gradient-cosmic">Sans Compromis</span>
          </h2>
          <p className="font-sans text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Nous avons conçu chaque fonctionnalité pour vous faire gagner du
            temps et vous permettre de vous concentrer sur ce que vous faites de
            mieux.
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-6 text-center hover-lift animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Grille des fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glass border-white/10 text-white overflow-hidden group hover-lift animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader className="pb-4">
                <div
                  className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${feature.bgGradient} mb-4`}
                >
                  <div
                    className={`text-transparent bg-clip-text bg-gradient-to-r ${feature.gradient}`}
                  >
                    {feature.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardTitle className="font-display text-xl font-bold group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-300 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
                <div className="pt-2">
                  <div
                    className={`inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${feature.gradient} text-transparent bg-clip-text group-hover:gap-3 transition-all cursor-pointer`}
                  >
                    En savoir plus{" "}
                    <MoveRight className="h-4 w-4 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section CTA */}
        <div className="text-center mt-20">
          <div className="glass rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à transformer votre facturation ?
            </h3>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de freelances et d&apos;entreprises qui ont
              déjà fait le choix de la simplicité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold py-4 px-8 rounded-2xl hover-lift animate-pulse-glow transition-all">
                Commencer gratuitement
              </button>
              <button className="glass border-white/20 text-white font-bold py-4 px-8 rounded-2xl hover-lift transition-all">
                Voir la démo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
