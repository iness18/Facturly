import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FileText, Zap, Palette } from "lucide-react";
import { MoveRight } from "lucide-react";

const features = [
  {
    icon: <Zap className="h-8 w-8 text-purple-400" />,
    title: "Création Rapide",
    description:
      "Générez des factures en moins de 60 secondes grâce à une interface intuitive et des modèles prêts à l'emploi.",
  },
  {
    icon: <Palette className="h-8 w-8 text-blue-400" />,
    title: "Personnalisation",
    description:
      "Adaptez vos factures à votre image de marque. Ajoutez votre logo, choisissez vos couleurs et polices.",
  },
  {
    icon: <FileText className="h-8 w-8 text-green-400" />,
    title: "Suivi Simplifié",
    description:
      "Gardez un œil sur vos paiements, vos clients et vos revenus depuis un tableau de bord centralisé et clair.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            Une Expérience Sans Compromis
          </h2>
          <p className="font-sans text-lg text-gray-400 max-w-3xl mx-auto">
            Nous avons conçu chaque fonctionnalité pour vous faire gagner du
            temps et vous permettre de vous concentrer sur ce que vous faites de
            mieux.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/5 border-white/10 text-white overflow-hidden group"
            >
              <CardHeader>{feature.icon}</CardHeader>
              <CardContent className="space-y-4">
                <CardTitle className="font-display text-2xl font-bold">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-300 text-base">
                  {feature.description}
                </CardDescription>
                <a
                  href="#"
                  className="font-bold text-purple-400 flex items-center gap-2 group-hover:gap-3 transition-all"
                >
                  En savoir plus <MoveRight className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
