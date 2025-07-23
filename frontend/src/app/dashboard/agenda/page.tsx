"use client";

import { useState } from "react";

// Types pour les événements
interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type:
    | "invoice_sent"
    | "invoice_due"
    | "reminder"
    | "payment_received"
    | "manual";
  description?: string;
  invoiceId?: string;
  clientName?: string;
  amount?: number;
  status?: "pending" | "completed" | "overdue";
}

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

// Données d'exemple pour les événements
const sampleEvents: CalendarEvent[] = [];

// Composant pour afficher un événement
const EventItem = ({ event }: { event: CalendarEvent }) => {
  const getEventIcon = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "invoice_sent":
        return "📧";
      case "invoice_due":
        return "⏰";
      case "reminder":
        return "🔔";
      case "payment_received":
        return "💰";
      case "manual":
        return "📅";
      default:
        return "📋";
    }
  };

  const getEventColor = (type: CalendarEvent["type"], status?: string) => {
    if (status === "overdue") return "#ef4444";
    switch (type) {
      case "invoice_sent":
        return "#3b82f6";
      case "invoice_due":
        return "#f59e0b";
      case "reminder":
        return "#ef4444";
      case "payment_received":
        return "#10b981";
      case "manual":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return "";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <div
      style={{
        padding: "12px",
        background: "rgba(255, 255, 255, 0.03)",
        border: `1px solid ${getEventColor(event.type, event.status)}40`,
        borderLeft: `4px solid ${getEventColor(event.type, event.status)}`,
        borderRadius: "8px",
        marginBottom: "8px",
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "4px",
        }}
      >
        <span style={{ fontSize: "16px" }}>{getEventIcon(event.type)}</span>
        <span
          style={{
            color: "#ffffff",
            fontWeight: "500",
            fontSize: "14px",
            flex: 1,
          }}
        >
          {event.title}
        </span>
        {event.amount && (
          <span
            style={{
              color: getEventColor(event.type, event.status),
              fontWeight: "600",
              fontSize: "12px",
            }}
          >
            {formatAmount(event.amount)}
          </span>
        )}
      </div>
      {event.description && (
        <div
          style={{
            color: "#9ca3af",
            fontSize: "12px",
            marginLeft: "24px",
          }}
        >
          {event.description}
        </div>
      )}
      {event.invoiceId && (
        <div
          style={{
            color: "#6b7280",
            fontSize: "11px",
            marginLeft: "24px",
            marginTop: "2px",
          }}
        >
          {event.invoiceId}
        </div>
      )}
    </div>
  );
};

// Composant principal de l'agenda
export default function AgendaPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

  // Fonctions utilitaires pour le calendrier
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Lundi = 0
  };

  const getEventsForDate = (date: Date) => {
    return sampleEvents.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  // Génération du calendrier
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Jours vides du mois précédent
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          style={{
            aspectRatio: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      );
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const events = getEventsForDate(date);
      const isToday =
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear();
      const isSelected =
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          style={{
            aspectRatio: "1",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "4px",
            cursor: "pointer",
            background: isSelected
              ? "rgba(139, 92, 246, 0.2)"
              : isToday
              ? "rgba(59, 130, 246, 0.1)"
              : "transparent",
            border: isToday ? "1px solid #3b82f6" : "1px solid transparent",
            borderRadius: "8px",
            transition: "all 0.2s ease",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = isToday
                ? "rgba(59, 130, 246, 0.1)"
                : "transparent";
            }
          }}
        >
          <span
            style={{
              color: isToday ? "#3b82f6" : "#ffffff",
              fontSize: "14px",
              fontWeight: isToday ? "600" : "400",
              marginBottom: "2px",
            }}
          >
            {day}
          </span>
          {events.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1px",
                justifyContent: "center",
              }}
            >
              {events.slice(0, 3).map((event, index) => (
                <div
                  key={event.id}
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: (() => {
                      switch (event.type) {
                        case "invoice_sent":
                          return "#3b82f6";
                        case "invoice_due":
                          return "#f59e0b";
                        case "reminder":
                          return "#ef4444";
                        case "payment_received":
                          return "#10b981";
                        case "manual":
                          return "#8b5cf6";
                        default:
                          return "#6b7280";
                      }
                    })(),
                  }}
                />
              ))}
              {events.length > 3 && (
                <div
                  style={{
                    fontSize: "8px",
                    color: "#9ca3af",
                    marginLeft: "2px",
                  }}
                >
                  +{events.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
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
            <a
              href="/dashboard/agenda"
              style={{
                color: "#8b5cf6",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "600",
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
            <a
              href="/dashboard/compte"
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
                textDecoration: "none",
              }}
            >
              👤
            </a>
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
                href="/dashboard/agenda"
                style={{
                  color: "#8b5cf6",
                  textDecoration: "none",
                  padding: "8px 0",
                  fontWeight: "600",
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
            marginBottom: "32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#ffffff",
                margin: 0,
                marginBottom: "8px",
              }}
            >
              📅 Agenda
            </h1>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "16px",
                margin: 0,
              }}
            >
              Suivez vos factures et événements importants
            </p>
          </div>

          {/* Bouton Nouvel événement */}
          <button
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease",
            }}
          >
            ➕ Nouvel événement
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: "24px",
          }}
          className="agenda-layout"
        >
          {/* Calendrier principal */}
          <Card>
            {/* En-tête du calendrier */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <button
                  onClick={() => navigateMonth("prev")}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "#ffffff",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  ←
                </button>
                <h2
                  style={{
                    color: "#ffffff",
                    fontSize: "20px",
                    fontWeight: "600",
                    margin: 0,
                  }}
                >
                  {monthNames[currentDate.getMonth()]}{" "}
                  {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={() => navigateMonth("next")}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "#ffffff",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  →
                </button>
              </div>

              {/* Sélecteur de vue */}
              <div style={{ display: "flex", gap: "4px" }}>
                {(["month", "week", "day"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    style={{
                      background:
                        viewMode === mode
                          ? "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"
                          : "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "#ffffff",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px",
                      textTransform: "capitalize",
                    }}
                  >
                    {mode === "month"
                      ? "Mois"
                      : mode === "week"
                      ? "Semaine"
                      : "Jour"}
                  </button>
                ))}
              </div>
            </div>

            {/* Grille du calendrier */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "1px",
                marginBottom: "16px",
              }}
            >
              {/* En-têtes des jours */}
              {dayNames.map((day) => (
                <div
                  key={day}
                  style={{
                    padding: "12px 4px",
                    textAlign: "center",
                    color: "#9ca3af",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: "rgba(255, 255, 255, 0.03)",
                    borderRadius: "4px",
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Jours du calendrier */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "2px",
              }}
            >
              {renderCalendar()}
            </div>

            {/* Légende */}
            <div
              style={{
                marginTop: "24px",
                padding: "16px",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "8px",
              }}
            >
              <h4
                style={{
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "12px",
                }}
              >
                Légende
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "8px",
                }}
              >
                {[
                  {
                    type: "invoice_sent",
                    label: "Facture envoyée",
                    color: "#3b82f6",
                    icon: "📧",
                  },
                  {
                    type: "invoice_due",
                    label: "Échéance",
                    color: "#f59e0b",
                    icon: "⏰",
                  },
                  {
                    type: "reminder",
                    label: "Relance",
                    color: "#ef4444",
                    icon: "🔔",
                  },
                  {
                    type: "payment_received",
                    label: "Paiement reçu",
                    color: "#10b981",
                    icon: "💰",
                  },
                  {
                    type: "manual",
                    label: "Événement manuel",
                    color: "#8b5cf6",
                    icon: "📅",
                  },
                ].map((item) => (
                  <div
                    key={item.type}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: item.color,
                      }}
                    />
                    <span style={{ fontSize: "12px" }}>{item.icon}</span>
                    <span
                      style={{
                        color: "#d1d5db",
                        fontSize: "12px",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Panneau latéral */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Événements du jour sélectionné */}
            <Card>
              <h3
                style={{
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                {selectedDate
                  ? `Événements du ${selectedDate.getDate()} ${
                      monthNames[selectedDate.getMonth()]
                    }`
                  : "Sélectionnez une date"}
              </h3>

              {selectedDate ? (
                <div>
                  {getEventsForDate(selectedDate).length > 0 ? (
                    getEventsForDate(selectedDate).map((event) => (
                      <EventItem key={event.id} event={event} />
                    ))
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#9ca3af",
                        fontSize: "14px",
                        padding: "20px",
                      }}
                    >
                      Aucun événement ce jour
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    color: "#9ca3af",
                    fontSize: "14px",
                    padding: "20px",
                  }}
                >
                  Cliquez sur une date pour voir les événements
                </div>
              )}
            </Card>

            {/* Prochains événements */}
            <Card>
              <h3
                style={{
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                Prochains événements
              </h3>

              <div>
                {sampleEvents
                  .filter((event) => event.date >= new Date())
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 5)
                  .map((event) => (
                    <div
                      key={event.id}
                      style={{
                        padding: "8px",
                        marginBottom: "8px",
                        background: "rgba(255, 255, 255, 0.03)",
                        borderRadius: "6px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        <span style={{ fontSize: "12px" }}>
                          {event.type === "invoice_sent"
                            ? "📧"
                            : event.type === "invoice_due"
                            ? "⏰"
                            : event.type === "reminder"
                            ? "🔔"
                            : event.type === "payment_received"
                            ? "💰"
                            : "📅"}
                        </span>
                        <span
                          style={{
                            color: "#ffffff",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {event.title}
                        </span>
                      </div>
                      <div
                        style={{
                          color: "#9ca3af",
                          fontSize: "11px",
                          marginLeft: "20px",
                        }}
                      >
                        {event.date.toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>
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

        @media (max-width: 1024px) {
          .agenda-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
