"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

// Composant Tabs
const Tabs = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const tabs = [
    { id: "general", label: "Général", icon: "👤" },
    { id: "subscription", label: "Abonnement & Facturation", icon: "💳" },
    { id: "security", label: "Sécurité", icon: "🔒" },
    { id: "company", label: "Informations de l'entreprise", icon: "🏢" },
  ];

  return (
    <div
      style={{
        marginBottom: "32px",
      }}
    >
      {/* Desktop Tabs */}
      <div
        style={{
          display: "none",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          marginBottom: "24px",
        }}
        className="desktop-tabs"
      >
        <div
          style={{
            display: "flex",
            gap: "0",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                background: "transparent",
                border: "none",
                color: activeTab === tab.id ? "#ffffff" : "#9ca3af",
                padding: "12px 20px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: activeTab === tab.id ? "600" : "400",
                borderBottom:
                  activeTab === tab.id
                    ? "2px solid #8b5cf6"
                    : "2px solid transparent",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Tabs */}
      <div
        style={{
          display: "block",
        }}
        className="mobile-tabs"
      >
        <Card style={{ padding: "16px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "8px",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                style={{
                  background:
                    activeTab === tab.id
                      ? "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"
                      : "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  padding: "12px 8px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: activeTab === tab.id ? "600" : "400",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: "16px" }}>{tab.icon}</span>
                <span style={{ lineHeight: "1.2" }}>{tab.label}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Composant GeneralProfileForm
const GeneralProfileForm = () => {
  const [formData, setFormData] = useState({
    fullName: "Jean Dupont",
    email: "jean.dupont@example.com",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Ici on sauvegarderait les données
    setIsEditing(false);
    // Simulation d'une sauvegarde
    console.log("Données sauvegardées:", formData);
  };

  return (
    <Card>
      {/* Avatar Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "32px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            marginBottom: "16px",
            position: "relative",
            cursor: "pointer",
          }}
        >
          👤
          <div
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              width: "24px",
              height: "24px",
              background: "rgba(255, 255, 255, 0.9)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            ✏️
          </div>
        </div>
        <button
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#ffffff",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Modifier l'avatar
        </button>
      </div>

      {/* Form Fields */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Nom complet */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: "8px",
            }}
          >
            Nom complet
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                color: "#ffffff",
                fontSize: "14px",
                outline: "none",
                transition: "all 0.2s ease",
              }}
            />
          ) : (
            <div
              style={{
                padding: "12px 16px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                color: "#ffffff",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>{formData.fullName}</span>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#8b5cf6",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Modifier
              </button>
            </div>
          )}
        </div>

        {/* Adresse e-mail */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: "8px",
            }}
          >
            Adresse e-mail
          </label>
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: "#9ca3af",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>{formData.email}</span>
            <span
              style={{
                fontSize: "12px",
                color: "#6b7280",
                fontStyle: "italic",
              }}
            >
              Non modifiable
            </span>
          </div>
        </div>

        {/* Boutons d'action */}
        {isEditing && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              paddingTop: "16px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <button
              onClick={() => setIsEditing(false)}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                border: "none",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Enregistrer les modifications
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

// Composants pour les autres onglets (placeholders)
const SubscriptionContent = () => (
  <Card>
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>💳</div>
      <h3 style={{ color: "#ffffff", marginBottom: "8px", fontSize: "18px" }}>
        Abonnement & Facturation
      </h3>
      <p style={{ color: "#9ca3af", fontSize: "14px" }}>
        Cette section sera bientôt disponible.
      </p>
    </div>
  </Card>
);

const SecurityContent = () => (
  <Card>
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
      <h3 style={{ color: "#ffffff", marginBottom: "8px", fontSize: "18px" }}>
        Sécurité
      </h3>
      <p style={{ color: "#9ca3af", fontSize: "14px" }}>
        Cette section sera bientôt disponible.
      </p>
    </div>
  </Card>
);

const CompanyContent = () => (
  <Card>
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏢</div>
      <h3 style={{ color: "#ffffff", marginBottom: "8px", fontSize: "18px" }}>
        Informations de l'entreprise
      </h3>
      <p style={{ color: "#9ca3af", fontSize: "14px" }}>
        Cette section sera bientôt disponible.
      </p>
    </div>
  </Card>
);

// Page Mon Compte principale
export default function MonComptePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralProfileForm />;
      case "subscription":
        return <SubscriptionContent />;
      case "security":
        return <SecurityContent />;
      case "company":
        return <CompanyContent />;
      default:
        return <GeneralProfileForm />;
    }
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
                color: "#d1d5db",
                textDecoration: "none",
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
              href="/dashboard/compte"
              style={{
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: "500",
                borderBottom: "2px solid #8b5cf6",
                paddingBottom: "4px",
                fontSize: "14px",
              }}
            >
              Mon Compte
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
              className="mobile-menu-btn"
              style={{
                display: "block",
                background: "transparent",
                border: "none",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "18px",
                padding: "4px",
              }}
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
                  color: "#d1d5db",
                  textDecoration: "none",
                  padding: "8px 0",
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
                href="/dashboard/compte"
                style={{
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: "500",
                  padding: "8px 0",
                  borderBottom: "1px solid #8b5cf6",
                }}
              >
                Mon Compte
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
        {/* Titre de la page */}
        <div
          style={{
            marginBottom: "32px",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#ffffff",
              margin: 0,
            }}
          >
            Mon Compte
          </h1>
        </div>

        {/* Barre d'onglets */}
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Contenu de l'onglet actif */}
        {renderTabContent()}
      </main>

      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-menu {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .desktop-tabs {
            display: block !important;
          }
          .mobile-tabs {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
