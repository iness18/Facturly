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
  role: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    invoices: number;
    clients: number;
  };
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // TODO: Remplacer par de vrais appels API
      // const [statsResponse, usersResponse] = await Promise.all([
      //   fetch('/api/admin/stats'),
      //   fetch('/api/admin/users')
      // ]);

      // Données de démonstration
      setStats({
        totalUsers: 15,
        totalClients: 45,
        totalInvoices: 128,
        totalRevenue: 25680.5,
        recentUsers: 3,
      });

      setUsers([
        {
          id: "1",
          email: "admin@facturly.com",
          name: "Administrateur Facturly",
          company: "Facturly",
          role: "ADMIN",
          isActive: true,
          createdAt: new Date().toISOString(),
          _count: { invoices: 0, clients: 0 },
        },
        {
          id: "2",
          email: "demo@facturly.com",
          name: "Utilisateur Démo",
          company: "Entreprise Démo",
          role: "USER",
          isActive: true,
          createdAt: new Date().toISOString(),
          _count: { invoices: 5, clients: 3 },
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
      // TODO: Appel API pour activer/désactiver l'utilisateur
      // await fetch(`/api/admin/users/${userId}/toggle-status`, { method: 'PATCH' });

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isActive: !user.isActive } : user
        )
      );
    } catch (error) {
      console.error("Erreur lors de la modification du statut:", error);
    }
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
            <button
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                padding: "12px 20px",
                color: "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }}
            >
              <span>⚙️</span>
              Paramètres
            </button>
          </div>

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

          {/* Liste des utilisateurs */}
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
                          <div
                            style={{ fontWeight: "500", marginBottom: "4px" }}
                          >
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
                            color:
                              user.role === "ADMIN" ? "#a855f7" : "#3b82f6",
                          }}
                        >
                          {user.role === "ADMIN"
                            ? "Administrateur"
                            : "Utilisateur"}
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
