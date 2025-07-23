"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 50,
          background: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo simplifié */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#ffffff",
              }}
            >
              Facturly
            </span>
          </div>

          {/* Desktop Menu */}
          <div
            className="desktop-menu"
            style={{
              display: "none",
              alignItems: "center",
              gap: "32px",
            }}
          >
            <a
              href="/fonctionnalites"
              style={{ color: "#d1d5db", textDecoration: "none" }}
            >
              Fonctionnalités
            </a>
            <a href="#" style={{ color: "#d1d5db", textDecoration: "none" }}>
              Tarifs
            </a>
            <a
              href="/contact"
              style={{ color: "#d1d5db", textDecoration: "none" }}
            >
              Contact
            </a>
          </div>

          {/* CTA Buttons */}
          <div
            className="desktop-menu"
            style={{
              display: "none",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <a
              href="/connexion"
              style={{
                background: "transparent",
                border: "none",
                color: "#d1d5db",
                cursor: "pointer",
                textDecoration: "none",
                padding: "8px 16px",
              }}
            >
              Connexion
            </a>
            <a
              href="/inscription"
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                color: "#ffffff",
                padding: "8px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              S'inscrire
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            style={{
              display: "none",
              background: "transparent",
              border: "none",
              color: "#ffffff",
              cursor: "pointer",
            }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </nav>

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
              ⭐ Nouvelle version • Plus rapide • Plus moderne
            </span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: "bold",
              marginBottom: "32px",
              lineHeight: "1.1",
            }}
          >
            <span style={{ color: "#ffffff" }}>Votre Facturation,</span>
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
              Réinventée.
            </span>
          </h1>

          {/* Features List */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "24px",
              marginBottom: "32px",
              color: "#ffffff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  background: "#10b981",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              ></div>
              <span>Ultra Rapide</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  background: "#3b82f6",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              ></div>
              <span>Interface Moderne</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  background: "#8b5cf6",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              ></div>
              <span>IA Intégrée</span>
            </div>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: "1.5rem",
              color: "#d1d5db",
              maxWidth: "800px",
              margin: "0 auto 32px auto",
              lineHeight: "1.6",
            }}
          >
            Générez des factures professionnelles en quelques clics. Simple,
            puissant et conçu pour les créatifs comme vous.
          </p>

          {/* Social Proof */}
          <p
            style={{
              fontSize: "1.125rem",
              color: "#9ca3af",
              marginBottom: "48px",
            }}
          >
            Rejoignez plus de 10,000+ freelances qui nous font confiance pour
            gérer leur facturation.
          </p>

          {/* CTA Buttons */}
          <div
            className="responsive-buttons"
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "16px",
              justifyContent: "center",
              marginBottom: "64px",
            }}
          >
            <a
              href="/inscription"
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                color: "#ffffff",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "1.125rem",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                textDecoration: "none",
              }}
            >
              Commencer Gratuitement →
            </a>
            <a
              href="/demo"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "1.125rem",
                fontWeight: "600",
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Voir la Démo
            </a>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "32px",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "#ffffff",
                  marginBottom: "8px",
                }}
              >
                10K+
              </div>
              <div style={{ color: "#9ca3af" }}>Utilisateurs Actifs</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "#ffffff",
                  marginBottom: "8px",
                }}
              >
                50K+
              </div>
              <div style={{ color: "#9ca3af" }}>Factures Générées</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "#ffffff",
                  marginBottom: "8px",
                }}
              >
                99.9%
              </div>
              <div style={{ color: "#9ca3af" }}>Disponibilité</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "#ffffff",
                  marginBottom: "8px",
                }}
              >
                24/7
              </div>
              <div style={{ color: "#9ca3af" }}>Support</div>
            </div>
          </div>
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
          <div
            style={{
              textAlign: "center",
              marginBottom: "64px",
            }}
          >
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                marginBottom: "24px",
                color: "#ffffff",
              }}
            >
              Tout ce dont vous avez besoin pour gérer vos factures
            </h2>
            <p
              style={{
                fontSize: "1.25rem",
                color: "#d1d5db",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Une solution complète pour simplifier votre facturation et
              développer votre activité
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "32px",
            }}
          >
            {/* Factures personnalisées */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "32px",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                📄
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#ffffff",
                }}
              >
                Factures personnalisées
              </h3>
              <p
                style={{
                  color: "#d1d5db",
                  lineHeight: "1.6",
                }}
              >
                Créez et envoyez des factures professionnelles avec votre
                branding. Templates personnalisables, calculs automatiques et
                envoi par email.
              </p>
            </div>

            {/* Gestion des clients */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "32px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                👥
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#ffffff",
                }}
              >
                Répertoire clients
              </h3>
              <p
                style={{
                  color: "#d1d5db",
                  lineHeight: "1.6",
                }}
              >
                Gérez facilement vos contacts clients avec toutes leurs
                informations. Historique des factures et suivi des relations
                commerciales.
              </p>
            </div>

            {/* Suivi des statuts */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "32px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                ⏰
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#ffffff",
                }}
              >
                Suivi en temps réel
              </h3>
              <p
                style={{
                  color: "#d1d5db",
                  lineHeight: "1.6",
                }}
              >
                Suivez le statut de vos factures : envoyée, vue, payée ou en
                retard. Notifications automatiques et relances intelligentes.
              </p>
            </div>

            {/* Dashboard */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "32px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background:
                    "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                📊
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#ffffff",
                }}
              >
                Tableau de bord
              </h3>
              <p
                style={{
                  color: "#d1d5db",
                  lineHeight: "1.6",
                }}
              >
                Visualisez vos performances avec des statistiques clés : chiffre
                d'affaires, paiements en attente, tendances et analyses
                détaillées.
              </p>
            </div>

            {/* Sécurité */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "32px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                🛡️
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#ffffff",
                }}
              >
                Sécurité avancée
              </h3>
              <p
                style={{
                  color: "#d1d5db",
                  lineHeight: "1.6",
                }}
              >
                Authentification sécurisée et protection de vos données
                financières. Chiffrement de bout en bout et conformité RGPD.
              </p>
            </div>

            {/* IA */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "32px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background:
                    "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                ✨
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#ffffff",
                }}
              >
                IA Intégrée
              </h3>
              <p
                style={{
                  color: "#d1d5db",
                  lineHeight: "1.6",
                }}
              >
                Intelligence artificielle pour optimiser vos factures, détecter
                les anomalies et suggérer des améliorations automatiquement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
