"use client";

import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import FeaturesGrid from "@/components/features/FeaturesGrid";

export default function FonctionnalitesPage() {
  const features = [
    {
      icon: "📄",
      title: "Factures personnalisées",
      description:
        "Créez et envoyez des factures professionnelles avec votre branding. Templates personnalisables, calculs automatiques et envoi par email.",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      benefits: [
        "Templates professionnels prêts à l'emploi",
        "Personnalisation complète du branding",
        "Calculs automatiques de TVA et totaux",
        "Envoi par email en un clic",
      ],
    },
    {
      icon: "👥",
      title: "Répertoire clients",
      description:
        "Gérez facilement vos contacts clients avec toutes leurs informations. Historique des factures et suivi des relations commerciales.",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      benefits: [
        "Base de données clients centralisée",
        "Historique complet des transactions",
        "Informations de contact détaillées",
        "Suivi des relations commerciales",
      ],
    },
    {
      icon: "⏰",
      title: "Suivi en temps réel",
      description:
        "Suivez le statut de vos factures : envoyée, vue, payée ou en retard. Notifications automatiques et relances intelligentes.",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      benefits: [
        "Statuts en temps réel",
        "Notifications automatiques",
        "Relances intelligentes",
        "Alertes de retard de paiement",
      ],
    },
    {
      icon: "📊",
      title: "Tableau de bord",
      description:
        "Visualisez vos performances avec des statistiques clés : chiffre d'affaires, paiements en attente, tendances et analyses détaillées.",
      gradient: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
      benefits: [
        "Vue d'ensemble de votre activité",
        "Statistiques de performance",
        "Analyses de tendances",
        "Rapports détaillés",
      ],
    },
    {
      icon: "🛡️",
      title: "Sécurité avancée",
      description:
        "Authentification sécurisée et protection de vos données financières. Chiffrement de bout en bout et conformité RGPD.",
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      benefits: [
        "Chiffrement de bout en bout",
        "Authentification multi-facteurs",
        "Conformité RGPD",
        "Sauvegardes automatiques",
      ],
    },
    {
      icon: "✨",
      title: "IA Intégrée",
      description:
        "Intelligence artificielle pour optimiser vos factures, détecter les anomalies et suggérer des améliorations automatiquement.",
      gradient: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
      benefits: [
        "Détection automatique d'anomalies",
        "Suggestions d'optimisation",
        "Prédictions de paiement",
        "Automatisation intelligente",
      ],
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)",
        color: "#ffffff",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Navigation */}
      <Navigation currentPage="/fonctionnalites" />

      {/* Hero Section */}
      <section
        style={{
          paddingTop: "128px",
          paddingBottom: "80px",
          padding: "128px 16px 80px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 16px",
              borderRadius: "50px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              marginBottom: "32px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "#ffffff",
              }}
            >
              🚀 Fonctionnalités • Complètes • Innovantes
            </span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: "clamp(2.5rem, 8vw, 4rem)",
              fontWeight: "bold",
              marginBottom: "clamp(20px, 4vw, 32px)",
              lineHeight: "1.1",
            }}
          >
            <span style={{ color: "#ffffff" }}>
              Tout ce dont vous avez besoin
            </span>
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #ef4444 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              pour réussir.
            </span>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: "clamp(1.125rem, 3vw, 1.5rem)",
              color: "#d1d5db",
              maxWidth: "800px",
              margin: "0 auto clamp(32px, 6vw, 48px) auto",
              lineHeight: "1.6",
              padding: "0 16px",
            }}
          >
            Une solution complète pour simplifier votre facturation et
            développer votre activité. Découvrez toutes les fonctionnalités qui
            font de Facturly l'outil de référence.
          </p>

          {/* CTA Button */}
          <Link
            href="/dashboard"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
              color: "#ffffff",
              padding: "16px 32px",
              borderRadius: "12px",
              fontSize: "1.125rem",
              fontWeight: "600",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            Essayer Gratuitement →
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          padding: "80px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <FeaturesGrid features={features} />
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "80px 16px",
          background: "rgba(255, 255, 255, 0.02)",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(2rem, 6vw, 3rem)",
              fontWeight: "bold",
              marginBottom: "clamp(16px, 3vw, 24px)",
              color: "#ffffff",
            }}
          >
            Prêt à transformer votre facturation ?
          </h2>
          <p
            style={{
              fontSize: "1.25rem",
              color: "#d1d5db",
              marginBottom: "48px",
              lineHeight: "1.6",
            }}
          >
            Rejoignez plus de 10,000+ freelances et entreprises qui utilisent
            déjà Facturly pour simplifier leur gestion financière.
          </p>
          <div
            className="responsive-buttons"
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/dashboard"
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                color: "#ffffff",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "1.125rem",
                fontWeight: "600",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              Commencer Gratuitement →
            </Link>
            <Link
              href="/"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "1.125rem",
                fontWeight: "600",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
