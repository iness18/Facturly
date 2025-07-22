"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  storageService,
  formatDate,
  formatCurrency,
  type RecentTask,
} from "@/utils/storage";

// Composant Card réutilisable
const Card = ({
  children,
  style = {},
  onClick,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
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
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Composant Modal Chiffre d'Affaires
const RevenueModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  // Données d'exemple pour les graphiques
  const monthlyData = [
    { month: "Jan", revenue: 800, expenses: 200 },
    { month: "Fév", revenue: 1200, expenses: 300 },
    { month: "Mar", revenue: 950, expenses: 250 },
    { month: "Avr", revenue: 1400, expenses: 350 },
    { month: "Mai", revenue: 1100, expenses: 280 },
    { month: "Juin", revenue: 1250, expenses: 320 },
  ];

  const currentMonth = monthlyData[monthlyData.length - 1];
  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = monthlyData.reduce(
    (sum, item) => sum + item.expenses,
    0
  );
  const netProfit = totalRevenue - totalExpenses;

  // Composant graphique simple en barres
  const BarChart = ({ data }: { data: typeof monthlyData }) => {
    const maxValue = Math.max(
      ...data.map((item) => Math.max(item.revenue, item.expenses))
    );

    return (
      <div
        style={{
          display: "flex",
          alignItems: "end",
          gap: "12px",
          height: "200px",
          padding: "20px 0",
        }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              gap: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "end",
                gap: "4px",
                height: "150px",
              }}
            >
              {/* Barre revenus */}
              <div
                style={{
                  width: "16px",
                  height: `${(item.revenue / maxValue) * 150}px`,
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  borderRadius: "2px 2px 0 0",
                  minHeight: "4px",
                }}
              />
              {/* Barre dépenses */}
              <div
                style={{
                  width: "16px",
                  height: `${(item.expenses / maxValue) * 150}px`,
                  background:
                    "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  borderRadius: "2px 2px 0 0",
                  minHeight: "4px",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                fontWeight: "500",
              }}
            >
              {item.month}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Graphique en secteurs simple
  const PieChart = () => {
    const total = currentMonth.revenue + currentMonth.expenses;
    const revenuePercentage = (currentMonth.revenue / total) * 100;
    const expensePercentage = (currentMonth.expenses / total) * 100;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "120px",
        }}
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: `conic-gradient(
            #10b981 0deg ${revenuePercentage * 3.6}deg,
            #ef4444 ${revenuePercentage * 3.6}deg 360deg
          )`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            {Math.round(revenuePercentage)}%
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(5px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "20px",
          padding: "32px",
          maxWidth: "900px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#ffffff",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            💰 Analyse Financière
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              color: "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Résumé financier */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <Card style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "14px",
                color: "#10b981",
                fontWeight: "600",
                marginBottom: "8px",
                textTransform: "uppercase",
              }}
            >
              💰 Revenus Totaux (6 mois)
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#ffffff",
              }}
            >
              {totalRevenue.toLocaleString()} €
            </div>
          </Card>

          <Card style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "14px",
                color: "#ef4444",
                fontWeight: "600",
                marginBottom: "8px",
                textTransform: "uppercase",
              }}
            >
              📉 Dépenses Totales (6 mois)
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#ffffff",
              }}
            >
              {totalExpenses.toLocaleString()} €
            </div>
          </Card>

          <Card style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "14px",
                color: netProfit > 0 ? "#10b981" : "#ef4444",
                fontWeight: "600",
                marginBottom: "8px",
                textTransform: "uppercase",
              }}
            >
              📊 Bénéfice Net
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#ffffff",
              }}
            >
              {netProfit.toLocaleString()} €
            </div>
          </Card>
        </div>

        {/* Graphiques */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Graphique en barres */}
          <Card>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#ffffff",
                margin: 0,
                marginBottom: "20px",
              }}
            >
              📈 Évolution Mensuelle
            </h3>
            <BarChart data={monthlyData} />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                marginTop: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    borderRadius: "2px",
                  }}
                />
                <span style={{ color: "#d1d5db" }}>Revenus</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background:
                      "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    borderRadius: "2px",
                  }}
                />
                <span style={{ color: "#d1d5db" }}>Dépenses</span>
              </div>
            </div>
          </Card>

          {/* Graphique en secteurs */}
          <Card>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#ffffff",
                margin: 0,
                marginBottom: "20px",
              }}
            >
              🥧 Répartition du Mois
            </h3>
            <PieChart />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
                padding: "16px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "8px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#10b981",
                    fontWeight: "600",
                  }}
                >
                  Revenus
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#ffffff",
                    fontWeight: "bold",
                  }}
                >
                  {currentMonth.revenue} €
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#ef4444",
                    fontWeight: "600",
                  }}
                >
                  Dépenses
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#ffffff",
                    fontWeight: "bold",
                  }}
                >
                  {currentMonth.expenses} €
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Composant StatCards
const StatCards = ({
  onRevenueClick,
  onInvoicesClick,
  onClientsClick,
}: {
  onRevenueClick: () => void;
  onInvoicesClick: () => void;
  onClientsClick: () => void;
}) => {
  const [stats, setStats] = useState({
    revenue: 0,
    pendingInvoices: 0,
    pendingAmount: 0,
    clients: 0,
  });

  // Charger les statistiques au montage du composant
  useEffect(() => {
    const loadStats = () => {
      const invoiceStats = storageService.getInvoiceStats();
      const invoices = storageService.getInvoices();

      // Calculer le chiffre d'affaires des 30 derniers jours
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentRevenue = invoices
        .filter((invoice) => {
          const invoiceDate = new Date(invoice.date);
          return invoiceDate >= thirtyDaysAgo && invoice.status === "paid";
        })
        .reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);

      // Calculer les factures en attente
      const pendingInvoices = invoices.filter(
        (invoice) => invoice.status === "sent" || invoice.status === "overdue"
      );

      const pendingAmount = pendingInvoices.reduce(
        (sum, invoice) => sum + parseFloat(invoice.amount),
        0
      );

      // Calculer le nombre de clients uniques
      const uniqueClients = new Set(invoices.map((invoice) => invoice.client))
        .size;

      setStats({
        revenue: recentRevenue,
        pendingInvoices: pendingInvoices.length,
        pendingAmount: pendingAmount,
        clients: uniqueClients,
      });
    };

    loadStats();

    // Écouter les changements de localStorage
    const handleStorageChange = () => {
      loadStats();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
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
      <Card style={{ cursor: "pointer" }} onClick={onRevenueClick}>
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
          {formatCurrency(stats.revenue)}
        </div>
        <div
          style={{
            fontSize: "13px",
            color: stats.revenue > 0 ? "#10b981" : "#9ca3af",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {stats.revenue > 0 ? "💰 Revenus générés" : "Aucun revenu ce mois"}
        </div>
      </Card>

      {/* Carte 2: Factures en attente */}
      <Card style={{ cursor: "pointer" }} onClick={onInvoicesClick}>
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
          {stats.pendingInvoices} facture
          {stats.pendingInvoices !== 1 ? "s" : ""}
        </div>
        <div
          style={{
            fontSize: "13px",
            color: stats.pendingInvoices > 0 ? "#f59e0b" : "#9ca3af",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          💶 {formatCurrency(stats.pendingAmount)} en attente
        </div>
      </Card>

      {/* Carte 3: Clients actifs */}
      <Card style={{ cursor: "pointer" }} onClick={onClientsClick}>
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
          {stats.clients}
        </div>
        <div
          style={{
            fontSize: "13px",
            color: stats.clients > 0 ? "#8b5cf6" : "#9ca3af",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {stats.clients > 0 ? "👥 Clients uniques" : "Aucun client"}
        </div>
      </Card>
    </div>
  );
};

// Composant RecentActivityFeed
const RecentActivityFeed = () => {
  const [recentTasks, setRecentTasks] = useState<RecentTask[]>([]);

  // Charger les tâches récentes au montage du composant
  useEffect(() => {
    const loadRecentTasks = () => {
      const tasks = storageService.getRecentTasks();
      setRecentTasks(tasks);
    };

    loadRecentTasks();

    // Écouter les changements de localStorage (si plusieurs onglets)
    const handleStorageChange = () => {
      loadRecentTasks();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Fonction pour formater le temps relatif
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return diffInMinutes <= 1 ? "À l'instant" : `Il y a ${diffInMinutes}min`;
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      return `Il y a ${diffInDays}j`;
    }
  };

  const hasActivity = recentTasks.length > 0;

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
          {recentTasks.map((task) => (
            <div
              key={task.id}
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
                {task.icon}
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
                  {task.title}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#9ca3af",
                    margin: 0,
                  }}
                >
                  {getRelativeTime(task.date)}
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
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const router = useRouter();

  const handleRevenueClick = () => {
    setIsRevenueModalOpen(true);
  };

  const handleInvoicesClick = () => {
    router.push("/dashboard/factures");
  };

  const handleClientsClick = () => {
    router.push("/dashboard/clients");
  };

  const handleProfileClick = () => {
    router.push("/dashboard/compte");
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
              href="/dashboard/agenda"
              style={{
                color: "#d1d5db",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Agenda
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
              onClick={handleProfileClick}
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
                href="/dashboard/agenda"
                style={{
                  color: "#d1d5db",
                  textDecoration: "none",
                  padding: "8px 0",
                }}
              >
                Agenda
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
        <StatCards
          onRevenueClick={handleRevenueClick}
          onInvoicesClick={handleInvoicesClick}
          onClientsClick={handleClientsClick}
        />

        {/* Activité récente */}
        <RecentActivityFeed />
      </main>

      {/* Modal Chiffre d'Affaires */}
      <RevenueModal
        isOpen={isRevenueModalOpen}
        onClose={() => setIsRevenueModalOpen(false)}
      />

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
