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

        {/* Bouton de déconnexion */}
        {!isEditing && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: "24px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              marginTop: "24px",
            }}
          >
            <button
              onClick={() => {
                // Logique de déconnexion
                window.location.href = "/connexion";
              }}
              style={{
                background: "rgba(239, 68, 68, 0.8)",
                border: "none",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.8)";
              }}
            >
              🚪 Se déconnecter
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

const SecurityContent = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const activeSessions = [
    {
      id: 1,
      device: "MacBook Pro",
      browser: "Chrome 120.0",
      location: "Paris, France",
      lastActive: "Maintenant",
      current: true,
      ip: "192.168.1.100",
    },
    {
      id: 2,
      device: "iPhone 15",
      browser: "Safari Mobile",
      location: "Paris, France",
      lastActive: "Il y a 2 heures",
      current: false,
      ip: "192.168.1.101",
    },
    {
      id: 3,
      device: "Windows PC",
      browser: "Edge 119.0",
      location: "Lyon, France",
      lastActive: "Il y a 1 jour",
      current: false,
      ip: "192.168.1.102",
    },
  ];

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    setIsSubmitting(true);
    // Simulation d'une requête API
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    alert("Mot de passe modifié avec succès");
  };

  const handleEnable2FA = async () => {
    if (!twoFactorEnabled) {
      setShowQRCode(true);
    } else {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTwoFactorEnabled(false);
      setIsSubmitting(false);
      alert("Authentification à deux facteurs désactivée");
    }
  };

  const handleVerify2FA = async () => {
    if (verificationCode.length !== 6) {
      alert("Code de vérification invalide");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setTwoFactorEnabled(true);
    setShowQRCode(false);
    setVerificationCode("");
    setIsSubmitting(false);
    alert("Authentification à deux facteurs activée avec succès");
  };

  const handleTerminateSession = async (sessionId: number) => {
    if (confirm("Êtes-vous sûr de vouloir terminer cette session ?")) {
      // Simulation de terminaison de session
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Session terminée");
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: "Faible", color: "#ef4444" };
    if (strength <= 3) return { strength, label: "Moyen", color: "#f97316" };
    if (strength <= 4) return { strength, label: "Fort", color: "#10b981" };
    return { strength, label: "Très fort", color: "#10b981" };
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Changement de mot de passe */}
      <Card>
        <div style={{ marginBottom: "24px" }}>
          <h3
            style={{
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            🔑 Mot de passe
          </h3>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>
            Modifiez votre mot de passe pour sécuriser votre compte
          </p>
        </div>

        {!isChangingPassword ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div>
              <div
                style={{
                  color: "#ffffff",
                  fontWeight: "500",
                  marginBottom: "4px",
                }}
              >
                Mot de passe actuel
              </div>
              <div style={{ color: "#9ca3af", fontSize: "14px" }}>
                Dernière modification : il y a 3 mois
              </div>
            </div>
            <button
              onClick={() => setIsChangingPassword(true)}
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Modifier
            </button>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Mot de passe actuel */}
            <div>
              <label
                style={{
                  display: "block",
                  color: "#ffffff",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                Mot de passe actuel
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "12px 48px 12px 16px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#9ca3af",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  {showPasswords.current ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Nouveau mot de passe */}
            <div>
              <label
                style={{
                  display: "block",
                  color: "#ffffff",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                Nouveau mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "12px 48px 12px 16px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                  }
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#9ca3af",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  {showPasswords.new ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Indicateur de force */}
              {passwordData.newPassword && (
                <div style={{ marginTop: "8px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: "4px",
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${(passwordStrength.strength / 5) * 100}%`,
                          height: "100%",
                          background: passwordStrength.color,
                          transition: "all 0.3s ease",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        color: passwordStrength.color,
                        fontWeight: "500",
                      }}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirmation */}
            <div>
              <label
                style={{
                  display: "block",
                  color: "#ffffff",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                Confirmer le nouveau mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "12px 48px 12px 16px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#9ca3af",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  {showPasswords.confirm ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Boutons */}
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
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Annuler
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={isSubmitting}
                style={{
                  background: isSubmitting
                    ? "rgba(139, 92, 246, 0.5)"
                    : "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                  border: "none",
                  color: "#ffffff",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting ? "Modification..." : "Modifier le mot de passe"}
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Authentification à deux facteurs */}
      <Card>
        <div style={{ marginBottom: "24px" }}>
          <h3
            style={{
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            🛡️ Authentification à deux facteurs (2FA)
          </h3>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>
            Ajoutez une couche de sécurité supplémentaire à votre compte
          </p>
        </div>

        {!showQRCode ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div>
              <div
                style={{
                  color: "#ffffff",
                  fontWeight: "500",
                  marginBottom: "4px",
                }}
              >
                Authentification à deux facteurs
              </div>
              <div style={{ color: "#9ca3af", fontSize: "14px" }}>
                {twoFactorEnabled ? "✅ Activée" : "❌ Désactivée"}
              </div>
            </div>
            <button
              onClick={handleEnable2FA}
              disabled={isSubmitting}
              style={{
                background: twoFactorEnabled
                  ? "rgba(239, 68, 68, 0.8)"
                  : "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                fontSize: "14px",
                fontWeight: "500",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting
                ? "..."
                : twoFactorEnabled
                ? "Désactiver"
                : "Activer"}
            </button>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  background: "#ffffff",
                  margin: "0 auto 16px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  color: "#000000",
                }}
              >
                QR Code
                <br />
                Simulé
              </div>
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "14px",
                  marginBottom: "16px",
                }}
              >
                Scannez ce QR code avec votre application d'authentification
                (Google Authenticator, Authy, etc.)
              </p>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  color: "#ffffff",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                Code de vérification
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                placeholder="123456"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
                  textAlign: "center",
                  letterSpacing: "0.5em",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setShowQRCode(false);
                  setVerificationCode("");
                }}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleVerify2FA}
                disabled={isSubmitting || verificationCode.length !== 6}
                style={{
                  background:
                    isSubmitting || verificationCode.length !== 6
                      ? "rgba(139, 92, 246, 0.5)"
                      : "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                  border: "none",
                  color: "#ffffff",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor:
                    isSubmitting || verificationCode.length !== 6
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {isSubmitting ? "Vérification..." : "Vérifier et activer"}
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Sessions actives */}
      <Card>
        <div style={{ marginBottom: "24px" }}>
          <h3
            style={{
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            📱 Sessions actives
          </h3>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>
            Gérez les appareils connectés à votre compte
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {activeSessions.map((session) => (
            <div
              key={session.id}
              style={{
                padding: "16px",
                background: session.current
                  ? "rgba(139, 92, 246, 0.1)"
                  : "rgba(255, 255, 255, 0.03)",
                border: `1px solid ${
                  session.current
                    ? "rgba(139, 92, 246, 0.3)"
                    : "rgba(255, 255, 255, 0.1)"
                }`,
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <span style={{ color: "#ffffff", fontWeight: "500" }}>
                    {session.device}
                  </span>
                  {session.current && (
                    <span
                      style={{
                        background: "rgba(139, 92, 246, 0.8)",
                        color: "#ffffff",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "10px",
                        fontWeight: "600",
                      }}
                    >
                      ACTUELLE
                    </span>
                  )}
                </div>
                <div
                  style={{
                    color: "#9ca3af",
                    fontSize: "12px",
                    marginBottom: "2px",
                  }}
                >
                  {session.browser} • {session.location}
                </div>
                <div style={{ color: "#9ca3af", fontSize: "12px" }}>
                  IP: {session.ip} • {session.lastActive}
                </div>
              </div>

              {!session.current && (
                <button
                  onClick={() => handleTerminateSession(session.id)}
                  style={{
                    background: "rgba(239, 68, 68, 0.8)",
                    color: "#ffffff",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Terminer
                </button>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              color: "#3b82f6",
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "4px",
            }}
          >
            💡 Conseil de sécurité
          </div>
          <div style={{ color: "#d1d5db", fontSize: "12px" }}>
            Si vous voyez une session que vous ne reconnaissez pas, terminez-la
            immédiatement et changez votre mot de passe.
          </div>
        </div>
      </Card>

      {/* Zone de danger */}
      <Card style={{ border: "1px solid rgba(239, 68, 68, 0.3)" }}>
        <div style={{ marginBottom: "24px" }}>
          <h3
            style={{
              color: "#ef4444",
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            ⚠️ Zone de danger
          </h3>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>
            Actions irréversibles concernant votre compte
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Désabonnement temporaire */}
          <div
            style={{
              padding: "20px",
              background: "rgba(239, 68, 68, 0.05)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div style={{ flex: 1, minWidth: "250px" }}>
                <h4
                  style={{
                    color: "#ffffff",
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Désabonnement temporaire
                </h4>
                <p
                  style={{
                    color: "#d1d5db",
                    fontSize: "14px",
                    marginBottom: "12px",
                    lineHeight: "1.5",
                  }}
                >
                  Suspendez temporairement votre abonnement. Vos données seront
                  conservées et vous pourrez réactiver votre compte à tout
                  moment.
                </p>
                <div
                  style={{
                    background: "rgba(59, 130, 246, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      color: "#3b82f6",
                      fontSize: "12px",
                      fontWeight: "500",
                      marginBottom: "4px",
                    }}
                  >
                    ℹ️ Information
                  </div>
                  <div style={{ color: "#d1d5db", fontSize: "12px" }}>
                    Pendant la suspension, vous n'aurez pas accès aux
                    fonctionnalités premium mais vos données resteront intactes.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowSuspendModal(true)}
                style={{
                  background: "rgba(249, 115, 22, 0.8)",
                  border: "none",
                  color: "#ffffff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(249, 115, 22, 1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(249, 115, 22, 0.8)";
                }}
              >
                ⏸️ Suspendre l'abonnement
              </button>
            </div>
          </div>

          {/* Suppression de compte */}
          <div
            style={{
              padding: "20px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div style={{ flex: 1, minWidth: "250px" }}>
                <h4
                  style={{
                    color: "#ef4444",
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Suppression définitive du compte
                </h4>
                <p
                  style={{
                    color: "#d1d5db",
                    fontSize: "14px",
                    marginBottom: "12px",
                    lineHeight: "1.5",
                  }}
                >
                  Supprimez définitivement votre compte et toutes les données
                  associées. Cette action est irréversible.
                </p>
                <div
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "12px",
                      fontWeight: "500",
                      marginBottom: "4px",
                    }}
                  >
                    ⚠️ Attention - Action irréversible
                  </div>
                  <div style={{ color: "#d1d5db", fontSize: "12px" }}>
                    Toutes vos données seront définitivement perdues : factures,
                    clients, paramètres, historique. Cette action ne peut pas
                    être annulée.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                style={{
                  background: "rgba(239, 68, 68, 0.8)",
                  border: "none",
                  color: "#ffffff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.8)";
                }}
              >
                🗑️ Supprimer le compte
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Modale de confirmation pour suspension */}
      {showSuspendModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => {
            setShowSuspendModal(false);
            setConfirmPassword("");
            setPasswordError("");
          }}
        >
          <div
            style={{
              background: "rgba(26, 26, 46, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
              <h3
                style={{
                  color: "#ffffff",
                  fontSize: "20px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Suspendre l'abonnement
              </h3>
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                Pour confirmer cette action, veuillez saisir votre mot de passe
              </p>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  color: "#ffffff",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                Mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                placeholder="Saisissez votre mot de passe"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${
                    passwordError
                      ? "rgba(239, 68, 68, 0.8)"
                      : "rgba(255, 255, 255, 0.2)"
                  }`,
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              {passwordError && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  ❌ {passwordError}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => {
                  setShowSuspendModal(false);
                  setConfirmPassword("");
                  setPasswordError("");
                }}
                style={{
                  flex: 1,
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (confirmPassword.trim() === "") {
                    setPasswordError("Veuillez saisir votre mot de passe");
                    return;
                  }

                  // Simulation de vérification du mot de passe
                  // Pour la démo, on considère que "password123" est le bon mot de passe
                  if (confirmPassword !== "password123") {
                    setPasswordError("Mot de passe incorrect");
                    return;
                  }

                  // Message de confirmation personnalisé
                  alert(
                    "🔄 Votre abonnement a été suspendu temporairement.\n\n💙 Nous espérons vous revoir bientôt !\n\nVous allez être redirigé vers la page d'accueil..."
                  );

                  // Redirection vers la page héros
                  window.location.href = "/";
                }}
                disabled={!confirmPassword.trim()}
                style={{
                  flex: 1,
                  background: confirmPassword.trim()
                    ? "rgba(249, 115, 22, 0.8)"
                    : "rgba(249, 115, 22, 0.3)",
                  border: "none",
                  color: "#ffffff",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: confirmPassword.trim() ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                Confirmer la suspension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de confirmation pour suppression */}
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => {
            setShowDeleteModal(false);
            setConfirmPassword("");
            setPasswordError("");
          }}
        >
          <div
            style={{
              background: "rgba(26, 26, 46, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🗑️</div>
              <h3
                style={{
                  color: "#ef4444",
                  fontSize: "20px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Supprimer le compte
              </h3>
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                ⚠️ Cette action est{" "}
                <strong style={{ color: "#ef4444" }}>irréversible</strong>.
                Toutes vos données seront définitivement perdues.
              </p>
            </div>

            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  color: "#ef4444",
                  fontSize: "12px",
                  fontWeight: "500",
                  marginBottom: "4px",
                }}
              >
                ⚠️ Données qui seront supprimées :
              </div>
              <div style={{ color: "#d1d5db", fontSize: "12px" }}>
                • Toutes vos factures et devis
                <br />
                • Tous vos clients
                <br />
                • Vos paramètres et préférences
                <br />• Votre historique complet
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  color: "#ffffff",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                Confirmez avec votre mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                placeholder="Saisissez votre mot de passe"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${
                    passwordError
                      ? "rgba(239, 68, 68, 0.8)"
                      : "rgba(239, 68, 68, 0.3)"
                  }`,
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              {passwordError && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  ❌ {passwordError}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmPassword("");
                  setPasswordError("");
                }}
                style={{
                  flex: 1,
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (confirmPassword.trim() === "") {
                    setPasswordError("Veuillez saisir votre mot de passe");
                    return;
                  }

                  // Simulation de vérification du mot de passe
                  // Pour la démo, on considère que "password123" est le bon mot de passe
                  if (confirmPassword !== "password123") {
                    setPasswordError("Mot de passe incorrect");
                    return;
                  }

                  // Double confirmation pour la suppression
                  if (
                    confirm(
                      "DERNIÈRE CONFIRMATION : Êtes-vous absolument certain de vouloir supprimer définitivement votre compte ? Cette action ne peut pas être annulée."
                    )
                  ) {
                    // Message de confirmation personnalisé
                    alert(
                      "🗑️ Votre compte a été supprimé définitivement.\n\n💙 Nous espérons vous revoir bientôt !\n\nMerci d'avoir utilisé Facturly. Vous allez être redirigé vers la page d'accueil..."
                    );

                    // Redirection vers la page héros
                    window.location.href = "/";
                  }
                }}
                disabled={!confirmPassword.trim()}
                style={{
                  flex: 1,
                  background: confirmPassword.trim()
                    ? "rgba(239, 68, 68, 0.8)"
                    : "rgba(239, 68, 68, 0.3)",
                  border: "none",
                  color: "#ffffff",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: confirmPassword.trim() ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (confirmPassword.trim()) {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (confirmPassword.trim()) {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.8)";
                  }
                }}
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CompanyContent = () => {
  const [companyData, setCompanyData] = useState({
    // Informations générales
    companyName: "Facturly SARL",
    legalForm: "SARL",
    siret: "12345678901234",
    siren: "123456789",
    vatNumber: "FR12345678901",
    nafCode: "6201Z",

    // Adresse
    address: "123 Rue de la Facturation",
    addressComplement: "Bâtiment A",
    postalCode: "75001",
    city: "Paris",
    country: "France",

    // Contact
    phone: "+33 1 23 45 67 89",
    email: "contact@facturly.com",
    website: "https://www.facturly.com",

    // Informations bancaires
    bankName: "Banque Populaire",
    iban: "FR76 1234 5678 9012 3456 7890 123",
    bic: "CCBPFRPPXXX",

    // Branding
    logoUrl: "",
    primaryColor: "#8b5cf6",
    secondaryColor: "#ec4899",

    // Informations légales
    capital: "10000",
    registrationCity: "Paris",
    registrationNumber: "RCS Paris B 123 456 789",
  });

  const [isEditing, setIsEditing] = useState({
    general: false,
    address: false,
    contact: false,
    banking: false,
    branding: false,
    legal: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setCompanyData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (section: string) => {
    setIsSubmitting(true);
    // Simulation d'une sauvegarde
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsEditing((prev) => ({ ...prev, [section]: false }));
    alert(`Informations ${section} sauvegardées avec succès`);
  };

  const handleCancel = (section: string) => {
    setIsEditing((prev) => ({ ...prev, [section]: false }));
    // Ici on pourrait restaurer les données originales
  };

  const formatIBAN = (iban: string) => {
    return iban.replace(/(.{4})/g, "$1 ").trim();
  };

  const validateSIRET = (siret: string) => {
    return siret.length === 14 && /^\d+$/.test(siret);
  };

  const validateIBAN = (iban: string) => {
    return iban.length >= 15 && iban.length <= 34;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Informations générales */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <h3
              style={{
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              🏢 Informations générales
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>
              Informations légales de votre entreprise
            </p>
          </div>
          {!isEditing.general && (
            <button
              onClick={() =>
                setIsEditing((prev) => ({ ...prev, general: true }))
              }
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Modifier
            </button>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                color: "#ffffff",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Nom de l'entreprise *
            </label>
            {isEditing.general ? (
              <input
                type="text"
                value={companyData.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
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
                }}
              >
                {companyData.companyName}
              </div>
            )}
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "#ffffff",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Forme juridique
            </label>
            {isEditing.general ? (
              <select
                value={companyData.legalForm}
                onChange={(e) => handleInputChange("legalForm", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
                }}
              >
                <option value="SARL" style={{ background: "#1a1a2e" }}>
                  SARL
                </option>
                <option value="SAS" style={{ background: "#1a1a2e" }}>
                  SAS
                </option>
                <option value="EURL" style={{ background: "#1a1a2e" }}>
                  EURL
                </option>
                <option value="SCI" style={{ background: "#1a1a2e" }}>
                  SCI
                </option>
                <option
                  value="Auto-entrepreneur"
                  style={{ background: "#1a1a2e" }}
                >
                  Auto-entrepreneur
                </option>
                <option value="Autre" style={{ background: "#1a1a2e" }}>
                  Autre
                </option>
              </select>
            ) : (
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                }}
              >
                {companyData.legalForm}
              </div>
            )}
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "#ffffff",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              SIRET *
            </label>
            {isEditing.general ? (
              <input
                type="text"
                value={companyData.siret}
                onChange={(e) =>
                  handleInputChange(
                    "siret",
                    e.target.value.replace(/\D/g, "").slice(0, 14)
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${
                    validateSIRET(companyData.siret)
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(239, 68, 68, 0.5)"
                  }`,
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
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
                }}
              >
                {companyData.siret}
              </div>
            )}
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "#ffffff",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Numéro de TVA
            </label>
            {isEditing.general ? (
              <input
                type="text"
                value={companyData.vatNumber}
                onChange={(e) =>
                  handleInputChange("vatNumber", e.target.value.toUpperCase())
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
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
                }}
              >
                {companyData.vatNumber}
              </div>
            )}
          </div>
        </div>

        {isEditing.general && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <button
              onClick={() => handleCancel("general")}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Annuler
            </button>
            <button
              onClick={() => handleSave("general")}
              disabled={isSubmitting}
              style={{
                background: isSubmitting
                  ? "rgba(139, 92, 246, 0.5)"
                  : "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                border: "none",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        )}
      </Card>

      {/* Adresse */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <h3
              style={{
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              📍 Adresse du siège social
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>
              Adresse qui apparaîtra sur vos factures
            </p>
          </div>
          {!isEditing.address && (
            <button
              onClick={() =>
                setIsEditing((prev) => ({ ...prev, address: true }))
              }
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Modifier
            </button>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <div style={{ gridColumn: "1 / -1" }}>
            <label
              style={{
                display: "block",
                color: "#ffffff",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Adresse *
            </label>
            {isEditing.address ? (
              <input
                type="text"
                value={companyData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
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
                }}
              >
                {companyData.address}
              </div>
            )}
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "#ffffff",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Code postal *
            </label>
            {isEditing.address ? (
              <input
                type="text"
                value={companyData.postalCode}
                onChange={(e) =>
                  handleInputChange("postalCode", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
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
                }}
              >
                {companyData.postalCode}
              </div>
            )}
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "#ffffff",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Ville *
            </label>
            {isEditing.address ? (
              <input
                type="text"
                value={companyData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
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
                }}
              >
                {companyData.city}
              </div>
            )}
          </div>
        </div>

        {isEditing.address && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <button
              onClick={() => handleCancel("address")}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Annuler
            </button>
            <button
              onClick={() => handleSave("address")}
              disabled={isSubmitting}
              style={{
                background: isSubmitting
                  ? "rgba(139, 92, 246, 0.5)"
                  : "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                border: "none",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        )}
      </Card>

      {/* Informations bancaires */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <h3
              style={{
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              🏦 Informations bancaires
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>
              Coordonnées bancaires pour les virements
            </p>
          </div>
          {!isEditing.banking && (
            <button
              onClick={() =>
                setIsEditing((prev) => ({ ...prev, banking: true }))
              }
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Modifier
            </button>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                color: "#ffffff",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Nom de la banque
            </label>
            {isEditing.banking ? (
              <input
                type="text"
                value={companyData.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
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
                }}
              >
                {companyData.bankName}
              </div>
            )}
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "#ffffff",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Code BIC/SWIFT
            </label>
            {isEditing.banking ? (
              <input
                type="text"
                value={companyData.bic}
                onChange={(e) =>
                  handleInputChange("bic", e.target.value.toUpperCase())
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
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
                }}
              >
                {companyData.bic}
              </div>
            )}
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label
              style={{
                display: "block",
                color: "#ffffff",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              IBAN
            </label>
            {isEditing.banking ? (
              <input
                type="text"
                value={companyData.iban}
                onChange={(e) =>
                  handleInputChange(
                    "iban",
                    e.target.value.toUpperCase().replace(/\s/g, "")
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${
                    validateIBAN(companyData.iban)
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(239, 68, 68, 0.5)"
                  }`,
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "monospace",
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
                  fontFamily: "monospace",
                }}
              >
                {formatIBAN(companyData.iban)}
              </div>
            )}
          </div>
        </div>

        {isEditing.banking && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <button
              onClick={() => handleCancel("banking")}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Annuler
            </button>
            <button
              onClick={() => handleSave("banking")}
              disabled={isSubmitting}
              style={{
                background: isSubmitting
                  ? "rgba(139, 92, 246, 0.5)"
                  : "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                border: "none",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        )}
      </Card>

      {/* Branding */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <h3
              style={{
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              🎨 Branding et apparence
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>
              Personnalisez l'apparence de vos factures
            </p>
          </div>
          {!isEditing.branding && (
            <button
              onClick={() =>
                setIsEditing((prev) => ({ ...prev, branding: true }))
              }
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Modifier
            </button>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                color: "#ffffff",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Logo de l'entreprise
            </label>
            <div
              style={{
                padding: "40px 16px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "2px dashed rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📁</div>
              <div style={{ color: "#9ca3af", fontSize: "14px" }}>
                Cliquez pour télécharger un logo
              </div>
              <div
                style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px" }}
              >
                PNG, JPG jusqu'à 2MB
              </div>
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "#ffffff",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Couleur principale
            </label>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <input
                type="color"
                value={companyData.primaryColor}
                onChange={(e) =>
                  handleInputChange("primaryColor", e.target.value)
                }
                disabled={!isEditing.branding}
                style={{
                  width: "50px",
                  height: "40px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isEditing.branding ? "pointer" : "not-allowed",
                }}
              />
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontFamily: "monospace",
                  flex: 1,
                }}
              >
                {companyData.primaryColor}
              </div>
            </div>
          </div>
        </div>

        {isEditing.branding && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <button
              onClick={() => handleCancel("branding")}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Annuler
            </button>
            <button
              onClick={() => handleSave("branding")}
              disabled={isSubmitting}
              style={{
                background: isSubmitting
                  ? "rgba(139, 92, 246, 0.5)"
                  : "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                border: "none",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

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
            <a
              href="/dashboard"
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#ffffff",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Facturly
            </a>
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
