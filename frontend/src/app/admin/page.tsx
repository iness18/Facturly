"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

interface AdminStats {
  totalUsers: number;
  totalClients: number;
  totalInvoices: number;
  totalRevenue: number;
  recentUsers: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  companyAddress?: string;
  companyPostalCode?: string;
  companyCity?: string;
  companySiret?: string;
  companyLegalForm?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  _count: {
    invoices: number;
    clients: number;
  };
}

interface AppSettings {
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  maxUsersPerAccount: number;
  emailNotifications: boolean;
  backupFrequency: string;
  dataRetentionDays: number;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "settings">(
    "overview"
  );
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    maintenanceMode: false,
    allowRegistrations: true,
    maxUsersPerAccount: 100,
    emailNotifications: true,
    backupFrequency: "daily",
    dataRetentionDays: 365,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // TODO: Remplacer par de vrais appels API
      setStats({
        totalUsers: 1,
        totalClients: 0,
        totalInvoices: 0,
        totalRevenue: 0,
        recentUsers: 1,
      });

      setUsers([
        {
          id: "1",
          email: "admin@facturly.com",
          name: "Administrateur Facturly",
          company: "Facturly",
          companyAddress: "123 Rue de la Tech",
          companyPostalCode: "75001",
          companyCity: "Paris",
          companySiret: "12345678901234",
          companyLegalForm: "SAS",
          phone: "+33 1 23 45 67 89",
          role: "ADMIN",
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          _count: { invoices: 0, clients: 0 },
        },
      ]);
    } catch (error) {
      console.error("Erreur lors du chargement des données admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isActive: !user.isActive } : user
        )
      );
    } catch (error) {
      console.error("Erreur lors de la modification du statut:", error);
    }
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paramètres:", error);
    }
  };

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
  };

  const renderTabNavigation = () => (
    <div
      style={{
        display: "flex",
        gap: "8px",
        marginBottom: "32px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {[
        { id: "overview", label: "Vue d'ensemble", icon: "📊" },
        { id: "users", label: "Utilisateurs", icon: "👥" },
        { id: "settings", label: "Paramètres", icon: "⚙️" },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          style={{
            background:
              activeTab === tab.id
                ? "rgba(168, 85, 247, 0.2)"
                : "rgba(255, 255, 255, 0.05)",
            border:
              activeTab === tab.id
                ? "1px solid rgba(168, 85, 247, 0.5)"
                : "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px 8px 0 0",
            padding: "12px 20px",
            color: activeTab === tab.id ? "#a855f7" : "#d1d5db",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s ease",
            fontWeight: activeTab === tab.id ? "600" : "400",
          }}
          onMouseEnter={(e) => {
            if (activeTab !== tab.id) {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== tab.id) {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            }
          }}
        >
          <span>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );

  const renderOverviewTab = () => (
    <>
      {/* Statistiques */}
      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px",
            marginBottom: "48px",
          }}
        >
          {/* Utilisateurs Total */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
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
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#d1d5db",
                }}
              >
                Utilisateurs Total
              </h3>
              <span style={{ fontSize: "20px" }}>👥</span>
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            >
              {stats.totalUsers}
            </div>
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>
              +{stats.recentUsers} ce mois
            </p>
          </div>

          {/* Clients Total */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
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
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#d1d5db",
                }}
              >
                Clients Total
              </h3>
              <span style={{ fontSize: "20px" }}>🏢</span>
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            >
              {stats.totalClients}
            </div>
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>
              Tous utilisateurs confondus
            </p>
          </div>

          {/* Factures Total */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
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
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#d1d5db",
                }}
              >
                Factures Total
              </h3>
              <span style={{ fontSize: "20px" }}>📄</span>
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            >
              {stats.totalInvoices}
            </div>
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>
              Toutes les factures créées
            </p>
          </div>

          {/* Chiffre d'Affaires */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
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
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#d1d5db",
                }}
              >
                Chiffre d'Affaires
              </h3>
              <span style={{ fontSize: "20px" }}>📈</span>
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            >
              {stats.totalRevenue.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </div>
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>
              Factures payées uniquement
            </p>
          </div>
        </div>
      )}
    </>
  );

  const renderUsersTab = () => (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        padding: "32px",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          Gestion des Utilisateurs
        </h2>
        <p style={{ color: "#d1d5db" }}>
          Visualisez et gérez tous les utilisateurs de la plateforme
        </p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <th
                style={{
                  textAlign: "left",
                  padding: "16px",
                  color: "#d1d5db",
                  fontWeight: "500",
                }}
              >
                Utilisateur
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "16px",
                  color: "#d1d5db",
                  fontWeight: "500",
                }}
              >
                Entreprise
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "16px",
                  color: "#d1d5db",
                  fontWeight: "500",
                }}
              >
                Rôle
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "16px",
                  color: "#d1d5db",
                  fontWeight: "500",
                }}
              >
                Activité
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "16px",
                  color: "#d1d5db",
                  fontWeight: "500",
                }}
              >
                Statut
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "16px",
                  color: "#d1d5db",
                  fontWeight: "500",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <td style={{ padding: "16px" }}>
                  <div>
                    <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                      {user.email}
                    </div>
                  </div>
                </td>
                <td style={{ padding: "16px" }}>
                  <span style={{ fontSize: "14px" }}>
                    {user.company || "-"}
                  </span>
                </td>
                <td style={{ padding: "16px" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background:
                        user.role === "ADMIN"
                          ? "rgba(168, 85, 247, 0.2)"
                          : "rgba(59, 130, 246, 0.2)",
                      color: user.role === "ADMIN" ? "#a855f7" : "#3b82f6",
                    }}
                  >
                    {user.role === "ADMIN" ? "Administrateur" : "Utilisateur"}
                  </span>
                </td>
                <td style={{ padding: "16px" }}>
                  <div style={{ fontSize: "14px" }}>
                    <div>{user._count.invoices} factures</div>
                    <div style={{ color: "#9ca3af" }}>
                      {user._count.clients} clients
                    </div>
                  </div>
                </td>
                <td style={{ padding: "16px" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background: user.isActive
                        ? "rgba(34, 197, 94, 0.2)"
                        : "rgba(239, 68, 68, 0.2)",
                      color: user.isActive ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {user.isActive ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td style={{ padding: "16px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => viewUserDetails(user)}
                      style={{
                        background: "rgba(59, 130, 246, 0.2)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        borderRadius: "6px",
                        padding: "8px 16px",
                        color: "#3b82f6",
                        cursor: "pointer",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(59, 130, 246, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(59, 130, 246, 0.2)";
                      }}
                    >
                      Détails
                    </button>
                    {user.role !== "ADMIN" && (
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "6px",
                          padding: "8px 16px",
                          color: "#ffffff",
                          cursor: "pointer",
                          fontSize: "14px",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255, 255, 255, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255, 255, 255, 0.1)";
                        }}
                      >
                        {user.isActive ? "Désactiver" : "Activer"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        padding: "32px",
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          Paramètres de l'Application
        </h2>
        <p style={{ color: "#d1d5db" }}>
          Configurez les paramètres globaux de la plateforme
        </p>
      </div>

      <div style={{ display: "grid", gap: "24px" }}>
        {/* Mode Maintenance */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                Mode Maintenance
              </h3>
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>
                Désactive temporairement l'accès à l'application pour tous les
                utilisateurs
              </p>
            </div>
            <label
              style={{
                position: "relative",
                display: "inline-block",
                width: "60px",
                height: "34px",
              }}
            >
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  updateSettings({ maintenanceMode: e.target.checked })
                }
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: settings.maintenanceMode
                    ? "#a855f7"
                    : "#374151",
                  transition: "0.4s",
                  borderRadius: "34px",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    content: "",
                    height: "26px",
                    width: "26px",
                    left: settings.maintenanceMode ? "30px" : "4px",
                    bottom: "4px",
                    backgroundColor: "white",
                    transition: "0.4s",
                    borderRadius: "50%",
                  }}
                />
              </span>
            </label>
          </div>
        </div>

        {/* Autoriser les inscriptions */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                Autoriser les Inscriptions
              </h3>
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>
                Permet aux nouveaux utilisateurs de créer un compte
              </p>
            </div>
            <label
              style={{
                position: "relative",
                display: "inline-block",
                width: "60px",
                height: "34px",
              }}
            >
              <input
                type="checkbox"
                checked={settings.allowRegistrations}
                onChange={(e) =>
                  updateSettings({ allowRegistrations: e.target.checked })
                }
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: settings.allowRegistrations
                    ? "#a855f7"
                    : "#374151",
                  transition: "0.4s",
                  borderRadius: "34px",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    content: "",
                    height: "26px",
                    width: "26px",
                    left: settings.allowRegistrations ? "30px" : "4px",
                    bottom: "4px",
                    backgroundColor: "white",
                    transition: "0.4s",
                    borderRadius: "50%",
                  }}
                />
              </span>
            </label>
          </div>
        </div>

        {/* Notifications Email */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                Notifications Email
              </h3>
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>
                Envoie des notifications par email aux utilisateurs
              </p>
            </div>
            <label
              style={{
                position: "relative",
                display: "inline-block",
                width: "60px",
                height: "34px",
              }}
            >
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  updateSettings({ emailNotifications: e.target.checked })
                }
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: settings.emailNotifications
                    ? "#a855f7"
                    : "#374151",
                  transition: "0.4s",
                  borderRadius: "34px",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    content: "",
                    height: "26px",
                    width: "26px",
                    left: settings.emailNotifications ? "30px" : "4px",
                    bottom: "4px",
                    backgroundColor: "white",
                    transition: "0.4s",
                    borderRadius: "50%",
                  }}
                />
              </span>
            </label>
          </div>
        </div>

        {/* Paramètres numériques */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Nombre max d'utilisateurs */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Utilisateurs Maximum
            </h3>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "14px",
                marginBottom: "16px",
              }}
            >
              Nombre maximum d'utilisateurs autorisés
            </p>
            <input
              type="number"
              value={settings.maxUsersPerAccount}
              onChange={(e) =>
                updateSettings({
                  maxUsersPerAccount: parseInt(e.target.value) || 0,
                })
              }
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                padding: "12px",
                color: "#ffffff",
                fontSize: "14px",
              }}
            />
          </div>

          {/* Rétention des données */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Rétention des Données
            </h3>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "14px",
                marginBottom: "16px",
              }}
            >
              Nombre de jours de conservation des données
            </p>
            <input
              type="number"
              value={settings.dataRetentionDays}
              onChange={(e) =>
                updateSettings({
                  dataRetentionDays: parseInt(e.target.value) || 0,
                })
              }
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                padding: "12px",
                color: "#ffffff",
                fontSize: "14px",
              }}
            />
          </div>
        </div>

        {/* Fréquence de sauvegarde */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Fréquence de Sauvegarde
          </h3>
          <p
            style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "16px" }}
          >
            Fréquence des sauvegardes automatiques
          </p>
          <select
            value={settings.backupFrequency}
            onChange={(e) =>
              updateSettings({ backupFrequency: e.target.value })
            }
            style={{
              width: "100%",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "8px",
              padding: "12px",
              color: "#ffffff",
              fontSize: "14px",
            }}
          >
            <option
              value="hourly"
              style={{ background: "#1a1a2e", color: "#ffffff" }}
            >
              Toutes les heures
            </option>
            <option
              value="daily"
              style={{ background: "#1a1a2e", color: "#ffffff" }}
            >
              Quotidienne
            </option>
            <option
              value="weekly"
              style={{ background: "#1a1a2e", color: "#ffffff" }}
            >
              Hebdomadaire
            </option>
            <option
              value="monthly"
              style={{ background: "#1a1a2e", color: "#ffffff" }}
            >
              Mensuelle
            </option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderUserDetailsModal = () => {
    if (!selectedUser) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px",
        }}
        onClick={closeUserDetails}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "32px",
            maxWidth: "600px",
            width: "100%",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#ffffff",
              }}
            >
              Détails de l'utilisateur
            </h2>
            <button
              onClick={closeUserDetails}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                padding: "8px",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: "grid", gap: "24px" }}>
            {/* Informations personnelles */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#a855f7",
                }}
              >
                👤 Informations Personnelles
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Nom complet
                  </label>
                  <div style={{ color: "#ffffff", fontWeight: "500" }}>
                    {selectedUser.name}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Email
                  </label>
                  <div style={{ color: "#ffffff", fontWeight: "500" }}>
                    {selectedUser.email}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Téléphone
                  </label>
                  <div style={{ color: "#ffffff", fontWeight: "500" }}>
                    {selectedUser.phone || "-"}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Rôle
                  </label>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background:
                        selectedUser.role === "ADMIN"
                          ? "rgba(168, 85, 247, 0.2)"
                          : "rgba(59, 130, 246, 0.2)",
                      color:
                        selectedUser.role === "ADMIN" ? "#a855f7" : "#3b82f6",
                    }}
                  >
                    {selectedUser.role === "ADMIN"
                      ? "Administrateur"
                      : "Utilisateur"}
                  </span>
                </div>
              </div>
            </div>

            {/* Informations entreprise */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#ec4899",
                }}
              >
                🏢 Informations Entreprise
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Nom de l'entreprise
                  </label>
                  <div style={{ color: "#ffffff", fontWeight: "500" }}>
                    {selectedUser.company || "-"}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Forme juridique
                  </label>
                  <div style={{ color: "#ffffff", fontWeight: "500" }}>
                    {selectedUser.companyLegalForm || "-"}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    SIRET
                  </label>
                  <div style={{ color: "#ffffff", fontWeight: "500" }}>
                    {selectedUser.companySiret || "-"}
                  </div>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Adresse complète
                  </label>
                  <div style={{ color: "#ffffff", fontWeight: "500" }}>
                    {selectedUser.companyAddress ? (
                      <>
                        {selectedUser.companyAddress}
                        <br />
                        {selectedUser.companyPostalCode}{" "}
                        {selectedUser.companyCity}
                      </>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques d'activité */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#22c55e",
                }}
              >
                📊 Statistiques d'Activité
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "16px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: "#3b82f6",
                      marginBottom: "4px",
                    }}
                  >
                    {selectedUser._count.invoices}
                  </div>
                  <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                    Factures créées
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: "#ec4899",
                      marginBottom: "4px",
                    }}
                  >
                    {selectedUser._count.clients}
                  </div>
                  <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                    Clients gérés
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: "#22c55e",
                      marginBottom: "4px",
                    }}
                  >
                    {selectedUser.isActive ? "✓" : "✗"}
                  </div>
                  <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                    Statut actuel
                  </div>
                </div>
              </div>
            </div>

            {/* Informations système */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#f59e0b",
                }}
              >
                🔧 Informations Système
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Date d'inscription
                  </label>
                  <div style={{ color: "#ffffff", fontWeight: "500" }}>
                    {new Date(selectedUser.createdAt).toLocaleDateString(
                      "fr-FR",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Dernière connexion
                  </label>
                  <div style={{ color: "#ffffff", fontWeight: "500" }}>
                    {selectedUser.lastLoginAt
                      ? new Date(selectedUser.lastLoginAt).toLocaleDateString(
                          "fr-FR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "Jamais connecté"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)",
          color: "#ffffff",
          padding: "32px 16px",
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div
              style={{
                display: "inline-block",
                width: "40px",
                height: "40px",
                border: "4px solid rgba(139, 92, 246, 0.3)",
                borderTop: "4px solid #8b5cf6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            <p style={{ marginTop: "16px", color: "#d1d5db" }}>
              Chargement des données d'administration...
            </p>
          </div>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)",
          color: "#ffffff",
          padding: "32px 16px",
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "48px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "2rem" }}>🛡️</span>
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #ef4444 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Administration Facturly
                </span>
              </h1>
              <p style={{ color: "#d1d5db", fontSize: "1.125rem" }}>
                Gérez les utilisateurs et surveillez l'activité de la plateforme
              </p>
            </div>
          </div>

          {/* Navigation par onglets */}
          {renderTabNavigation()}

          {/* Contenu des onglets */}
          {activeTab === "overview" && renderOverviewTab()}
          {activeTab === "users" && renderUsersTab()}
          {activeTab === "settings" && renderSettingsTab()}
        </div>

        {/* Modal de détails utilisateur */}
        {renderUserDetailsModal()}
      </div>
    </ProtectedRoute>
  );
}
