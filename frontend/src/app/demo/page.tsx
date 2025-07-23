"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const demoSteps = [
    {
      title: "Tableau de bord principal",
      description:
        "Vue d'ensemble de votre activité avec statistiques en temps réel",
      image: "📊",
      content:
        "Visualisez vos revenus, factures en attente et clients actifs d'un coup d'œil.",
    },
    {
      title: "Création de facture",
      description:
        "Interface intuitive pour créer des factures professionnelles",
      image: "📄",
      content:
        "Ajoutez vos services, calculez automatiquement les totaux et personnalisez le design.",
    },
    {
      title: "Gestion des clients",
      description: "Répertoire complet de vos contacts professionnels",
      image: "👥",
      content:
        "Stockez les informations clients et suivez l'historique de vos relations commerciales.",
    },
    {
      title: "Suivi des paiements",
      description: "Monitoring en temps réel du statut de vos factures",
      image: "💰",
      content:
        "Recevez des notifications et gérez les relances automatiquement.",
    },
    {
      title: "Analyses et rapports",
      description: "Insights détaillés sur votre performance financière",
      image: "📈",
      content:
        "Graphiques interactifs et métriques pour optimiser votre business.",
    },
  ];

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % demoSteps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + demoSteps.length) % demoSteps.length);
  };

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
          position: "sticky",
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
          <div
            onClick={() => router.push("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              transition: "opacity 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = "0.8";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = "1";
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
            <span
              style={{
                fontSize: "14px",
                color: "#8b5cf6",
                background: "rgba(139, 92, 246, 0.1)",
                padding: "4px 8px",
                borderRadius: "6px",
                fontWeight: "500",
              }}
            >
              DÉMO
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => router.push("/inscription")}
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                color: "#ffffff",
                padding: "8px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Commencer
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          padding: "80px 16px 40px 16px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              marginBottom: "24px",
              lineHeight: "1.1",
            }}
          >
            <span style={{ color: "#ffffff" }}>Découvrez</span>
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
              Facturly en Action
            </span>
          </h1>

          <p
            style={{
              fontSize: "1.25rem",
              color: "#d1d5db",
              marginBottom: "40px",
              lineHeight: "1.6",
            }}
          >
            Explorez toutes les fonctionnalités qui font de Facturly la solution
            de facturation préférée des freelances et entrepreneurs.
          </p>

          {/* Demo Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            <button
              onClick={prevStep}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                padding: "16px 20px",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              ← Précédent
            </button>

            <div
              style={{
                fontSize: "14px",
                color: "#9ca3af",
                fontWeight: "500",
                padding: "0 16px",
              }}
            >
              {currentStep + 1} / {demoSteps.length}
            </div>

            <button
              onClick={nextStep}
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                color: "#ffffff",
                padding: "16px 20px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(139, 92, 246, 0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Suivant →
            </button>
          </div>
        </div>
      </section>

      {/* Demo Content */}
      <section
        style={{
          padding: "0 16px 80px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Progress Indicators */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "40px",
            }}
          >
            {demoSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  border: "none",
                  background:
                    index === currentStep
                      ? "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"
                      : "rgba(255, 255, 255, 0.2)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* Current Step */}
          <div
            className="demo-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "60px",
              alignItems: "center",
              minHeight: "500px",
            }}
          >
            {/* Content */}
            <div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#8b5cf6",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "16px",
                }}
              >
                Étape {currentStep + 1} sur {demoSteps.length}
              </div>

              <h2
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "#ffffff",
                  marginBottom: "24px",
                  lineHeight: "1.2",
                }}
              >
                {demoSteps[currentStep].title}
              </h2>

              <p
                style={{
                  fontSize: "1.125rem",
                  color: "#d1d5db",
                  marginBottom: "24px",
                  lineHeight: "1.6",
                }}
              >
                {demoSteps[currentStep].description}
              </p>

              <p
                style={{
                  fontSize: "1rem",
                  color: "#9ca3af",
                  lineHeight: "1.6",
                  marginBottom: "32px",
                }}
              >
                {demoSteps[currentStep].content}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                }}
              >
                <button
                  onClick={() => router.push("/inscription")}
                  style={{
                    background:
                      "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                    color: "#ffffff",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Essayer Maintenant
                </button>
                <button
                  onClick={() => router.push("/fonctionnalites")}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "#ffffff",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Voir Toutes les Fonctionnalités
                </button>
              </div>
            </div>

            {/* Visual Demo */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "40px",
                textAlign: "center",
                minHeight: "400px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Background Pattern */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`,
                  animation: "pulse 3s ease-in-out infinite",
                }}
              />

              {/* Icon */}
              <div
                style={{
                  fontSize: "4rem",
                  marginBottom: "24px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {demoSteps[currentStep].image}
              </div>

              {/* Mock Interface */}
              <div
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  padding: "20px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "#ef4444",
                    }}
                  />
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "#f59e0b",
                    }}
                  />
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "#10b981",
                    }}
                  />
                </div>

                {/* Mock Content */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      height: "8px",
                      background: "rgba(255, 255, 255, 0.3)",
                      borderRadius: "4px",
                      width: "80%",
                    }}
                  />
                  <div
                    style={{
                      height: "8px",
                      background: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "4px",
                      width: "60%",
                    }}
                  />
                  <div
                    style={{
                      height: "8px",
                      background: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "4px",
                      width: "90%",
                    }}
                  />
                  <div
                    style={{
                      height: "20px",
                      background:
                        "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                      borderRadius: "6px",
                      width: "50%",
                      marginTop: "8px",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  fontSize: "14px",
                  color: "#9ca3af",
                  marginTop: "20px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Interface interactive simulée
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "80px 16px",
          background: "rgba(255, 255, 255, 0.02)",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
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
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#ffffff",
              marginBottom: "24px",
            }}
          >
            Prêt à transformer votre facturation ?
          </h2>

          <p
            style={{
              fontSize: "1.125rem",
              color: "#d1d5db",
              marginBottom: "40px",
              lineHeight: "1.6",
            }}
          >
            Rejoignez des milliers d'entrepreneurs qui ont déjà simplifié leur
            gestion avec Facturly.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => router.push("/inscription")}
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                color: "#ffffff",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "1.125rem",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
              }}
            >
              Commencer Gratuitement →
            </button>

            <button
              onClick={() => router.push("/contact")}
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
              }}
            >
              Nous Contacter
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .demo-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}
