// dans frontend/src/app/page.tsx

import { ArrowRight, Sparkles } from "lucide-react"; // Assurez-vous d'installer lucide-react: npm install lucide-react

export default function HomePage() {
  return (
    // Conteneur principal qui prend tout l'écran et centre le contenu
    // `relative` est CRUCIAL pour positionner notre "blob" décoratif
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4">
      {/* =================================================================== */}
      {/* Le fameux "Blob" décoratif. C'est ce qui crée l'effet de lueur. */}
      {/* Il est en position absolue, derrière tout le reste (`-z-10`) */}
      {/* Les classes `blur-3xl` et `opacity-30` le rendent doux et subtil */}
      {/* =================================================================== */}
      <div
        className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-primary to-purple-700 opacity-30 blur-3xl"
        aria-hidden="true"
      />

      {/* Conteneur pour le contenu textuel, pour limiter sa largeur et le centrer */}
      <div className="flex flex-col items-center text-center space-y-8">
        {/* =================================================================== */}
        {/* Titre Principal : Grand, audacieux, avec un dégradé ! */}
        {/* On utilise la classe `text-gradient-cosmic` que vous avez déjà créée ! */}
        {/* =================================================================== */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter">
          Votre Facturation,{" "}
          <span className="text-gradient-cosmic">Réinventée.</span>
        </h1>

        {/* =================================================================== */}
        {/* Tagline / Sous-titre */}
        {/* =================================================================== */}
        <div className="flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-2 text-muted-foreground">
          <Sparkles className="h-4 w-4 text-accent" />
          <span>Rapide · Moderne · Intuitif</span>
        </div>

        {/* =================================================================== */}
        {/* Paragraphe de description */}
        {/* Moins de contraste (`text-muted-foreground`) pour la hiérarchie */}
        {/* `max-w-xl` pour que les lignes ne soient pas trop longues et restent lisibles */}
        {/* =================================================================== */}
        <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
          Générez des factures professionnelles en quelques clics. Simple,
          puissant et conçu pour les créatifs comme vous. Rejoignez plus de
          10,000+ freelances qui nous font confiance.
        </p>

        {/* =================================================================== */}
        {/* Bouton d'action principal (CTA) */}
        {/* Grand, avec une icône, et un effet de lueur au survol */}
        {/* =================================================================== */}
        <button className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/40">
          <span>Commencer Gratuitement</span>
          <ArrowRight className="h-5 w-5" />
        </button>

        {/* =================================================================== */}
        {/* Preuve sociale (Stats) */}
        {/* On utilise flex pour les aligner, et on donne un style distinct au nombre et au texte */}
        {/* =================================================================== */}
        <div className="flex items-center space-x-12 pt-8">
          <div className="text-center">
            <p className="text-2xl font-bold">10K+</p>
            <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">50K+</p>
            <p className="text-sm text-muted-foreground">Factures générées</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">99.9%</p>
            <p className="text-sm text-muted-foreground">Disponibilité</p>
          </div>
        </div>
      </div>
    </main>
  );
}
