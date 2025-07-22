"use client";

import { useState } from "react";

// Composant Card réutilisable
const Card = ({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        padding: "24px",
        transition: "all 0.3s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Composant StatCards
const StatCards = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "32px",
      }}
    >
      {/* Carte 1: Chiffre d'affaires */}
      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <h3
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            CHIFFRE D'AFFAIRES (30J)
          </h3>
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            💰
          </div>
        </div>
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#ffffff",
            marginBottom: "8px",
          }}
        >
          1,250.00 €
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "#10b981",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          ↗️ +12.5% vs mois dernier
        </div>
      </Card>

      {/* Carte 2: Factures en attente */}
      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <h3
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            FACTURES EN ATTENTE
          </h3>
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            ⏳
          </div>
        </div>
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#ffffff",
            marginBottom: "8px",
          }}
        >
          3 factures
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "#f59e0b",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          💶 450.00 € en attente
        </div>
      </Card>

      {/* Carte 3: Clients actifs */}
      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <h3
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            CLIENTS ACTIFS
          </h3>
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            👥
          </div>
        </div>
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#ffffff",
            marginBottom: "8px",
          }}
        >
          12
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "#8b5cf6",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          📈 +2 ce mois-ci
        </div>
      </Card>
    </div>
  );
};

// Composant RecentActivityFeed
const RecentActivityFeed = () => {
  const [hasActivity] = useState(false); // Pour tester l'état vide/rempli

  const activities = [
    {
      id: 1,
      type: "invoice_created",
      message: "Facture #2024-012 créée",
      time: "Il y a 2h",
      icon: "📄",
    },
    {
      id: 2,
      type: "payment_received",
      message: "Paiement de 50€ reçu de Client X",
      time: "Il y a 4h",
      icon: "💳",
    },
    {
      id: 3,
      type: "invoice_sent",
      message: "Facture #2024-011 envoyée à ABC Corp",
      time: "Il y a 1j",
      icon: "📧",
    },
    {
      id: 4,
      type: "client_added",
      message: 'Nouveau client "XYZ Sarl" ajouté',
      time: "Il y a 2j",
      icon: "👤",
    },
    {
      id: 5,
      type: "payment_received",
      message: "Paiement de 150€ reçu de DEF Ltd",
      time: "Il y a 3j",
      icon: "💳",
    },
  ];

  return (
    <Card style={{ minHeight: "350px" }}>
      {/* En-tête */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h2
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            margin: 0,
          }}
        >
          ACTIVITÉ RÉCENTE
        </h2>
        <button
          style={{
            background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
            color: "#ffffff",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "none",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "opacity 0.2s ease",
          }}
        >
          Voir tout
        </button>
      </div>

      {/* Contenu */}
      {!hasActivity ? (
        // État vide
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "250px",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
              fontSize: "24px",
            }}
          >
            📊
          </div>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: "12px",
              margin: 0,
            }}
          >
            Aucune activité à afficher pour le moment.
          </h3>
          <p
            style={{
              fontSize: "14px",
              color: "#9ca3af",
              maxWidth: "300px",
              lineHeight: "1.5",
              margin: 0,
            }}
          >
            Les dernières factures créées et les paiements reçus apparaîtront
            ici.
          </p>
        </div>
      ) : (
        // État rempli
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {activities.map((activity) => (
            <div
              key={activity.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  flexShrink: 0,
                }}
              >
                {activity.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#ffffff",
                    marginBottom: "2px",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {activity.message}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#9ca3af",
                    margin: 0,
                  }}
                >
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

// Page Dashboard principale
export default function DashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#ffffff",
              }}
            >
              Facturly
            </span>
          </div>

          {/* Desktop Menu */}
          <div
            style={{
              display: "none",
              alignItems: "center",
              gap: "24px",
            }}
            className="desktop-menu"
          >
            <a
              href="/dashboard"
              style={{
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: "500",
                borderBottom: "2px solid #8b5cf6",
                paddingBottom: "4px",
                fontSize: "14px",
              }}
            >
              Tableau de bord
            </a>
            <a
              href="/dashboard/factures"
              style={{
                color: "#d1d5db",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Factures
            </a>
            <a
              href="/dashboard/clients"
              style={{
                color: "#d1d5db",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Clients
            </a>
            <a
              href="/dashboard/parametres"
              style={{
                color: "#d1d5db",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Paramètres
            </a>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: "block",
                background: "transparent",
                border: "none",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "18px",
                padding: "4px",
              }}
              className="mobile-menu-btn"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>

            {/* Bouton Profil */}
            <button
              style={{
                width: "36px",
                height: "36px",
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                borderRadius: "50%",
                border: "none",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              👤
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            style={{
              background: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <a
                href="/dashboard"
                style={{
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: "500",
                  padding: "8px 0",
                  borderBottom: "1px solid #8b5cf6",
                }}
              >
                Tableau de bord
              </a>
              <a
                href="/dashboard/factures"
                style={{
                  color: "#d1d5db",
                  textDecoration: "none",
                  padding: "8px 0",
                }}
              >
                Factures
              </a>
              <a
                href="/dashboard/clients"
                style={{
                  color: "#d1d5db",
                  textDecoration: "none",
                  padding: "8px 0",
                }}
              >
                Clients
              </a>
              <a
                href="/dashboard/parametres"
                style={{
                  color: "#d1d5db",
                  textDecoration: "none",
                  padding: "8px 0",
                }}
              >
                Paramètres
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Contenu principal */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px 16px",
        }}
      >
        {/* En-tête */}
        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#ffffff",
              marginBottom: "6px",
              margin: 0,
            }}
          >
            Tableau de bord
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "#9ca3af",
              margin: 0,
            }}
          >
            Vue d'ensemble de votre activité
          </p>
        </div>

        {/* Statistiques */}
        <StatCards />

        {/* Activité récente */}
        <RecentActivityFeed />
      </main>

      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-menu {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
