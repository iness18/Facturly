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

// Composant Modal de création de facture
const CreateInvoiceModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    client: "",
    clientEmail: "",
    description: "",
    amount: "",
    dueDate: "",
    notes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici on traiterait la création de la facture
    console.log("Nouvelle facture:", formData);
    onClose();
    // Reset form
    setFormData({
      client: "",
      clientEmail: "",
      description: "",
      amount: "",
      dueDate: "",
      notes: "",
    });
  };

  if (!isOpen) return null;

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
          maxWidth: "600px",
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
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#ffffff",
              margin: 0,
            }}
          >
            Nouvelle Facture
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Informations client */}
            <div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                👤 Informations Client
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#9ca3af",
                      marginBottom: "6px",
                    }}
                  >
                    Nom du client *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client}
                    onChange={(e) =>
                      handleInputChange("client", e.target.value)
                    }
                    placeholder="Ex: ABC Corporation"
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
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#9ca3af",
                      marginBottom: "6px",
                    }}
                  >
                    Email du client *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.clientEmail}
                    onChange={(e) =>
                      handleInputChange("clientEmail", e.target.value)
                    }
                    placeholder="client@example.com"
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
                </div>
              </div>
            </div>

            {/* Détails de la facture */}
            <div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                📄 Détails de la Facture
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#9ca3af",
                      marginBottom: "6px",
                    }}
                  >
                    Description des services *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Décrivez les services ou produits facturés..."
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

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
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#9ca3af",
                        marginBottom: "6px",
                      }}
                    >
                      Montant (€) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) =>
                        handleInputChange("amount", e.target.value)
                      }
                      placeholder="0.00"
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
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#9ca3af",
                        marginBottom: "6px",
                      }}
                    >
                      Date d'échéance *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dueDate}
                      onChange={(e) =>
                        handleInputChange("dueDate", e.target.value)
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
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#9ca3af",
                      marginBottom: "6px",
                    }}
                  >
                    Notes additionnelles
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Conditions de paiement, notes spéciales..."
                    rows={2}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
                paddingTop: "20px",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Annuler
              </button>
              <button
                type="submit"
                style={{
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                  border: "none",
                  color: "#ffffff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Créer la Facture
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant pour les filtres et recherche
const InvoiceFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onCreateClick,
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  onCreateClick: () => void;
}) => {
  return (
    <Card style={{ marginBottom: "24px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Titre et bouton nouveau */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#ffffff",
              margin: 0,
            }}
          >
            Gestion des Factures
          </h2>
          <button
            onClick={onCreateClick}
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
              color: "#ffffff",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            ➕ Nouvelle Facture
          </button>
        </div>

        {/* Filtres */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {/* Recherche */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "#9ca3af",
                marginBottom: "6px",
                textTransform: "uppercase",
              }}
            >
              Rechercher
            </label>
            <input
              type="text"
              placeholder="Numéro, client, montant..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "6px",
                color: "#ffffff",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          {/* Filtre par statut */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "#9ca3af",
                marginBottom: "6px",
                textTransform: "uppercase",
              }}
            >
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "6px",
                color: "#ffffff",
                fontSize: "14px",
                outline: "none",
              }}
            >
              <option value="">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="sent">Envoyée</option>
              <option value="paid">Payée</option>
              <option value="overdue">En retard</option>
            </select>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Composant pour une ligne de facture
const InvoiceRow = ({ invoice }: { invoice: any }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "#10b981";
      case "sent":
        return "#3b82f6";
      case "overdue":
        return "#ef4444";
      case "draft":
        return "#9ca3af";
      default:
        return "#9ca3af";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Payée";
      case "sent":
        return "Envoyée";
      case "overdue":
        return "En retard";
      case "draft":
        return "Brouillon";
      default:
        return status;
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
        gap: "16px",
        alignItems: "center",
        padding: "16px",
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "12px",
        transition: "all 0.2s ease",
      }}
      className="invoice-row"
    >
      {/* Numéro et client */}
      <div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#ffffff",
            marginBottom: "4px",
          }}
        >
          {invoice.number}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#9ca3af",
          }}
        >
          {invoice.client}
        </div>
      </div>

      {/* Date */}
      <div
        style={{
          fontSize: "14px",
          color: "#d1d5db",
        }}
      >
        {invoice.date}
      </div>

      {/* Montant */}
      <div
        style={{
          fontSize: "16px",
          fontWeight: "600",
          color: "#ffffff",
        }}
      >
        {invoice.amount}
      </div>

      {/* Statut */}
      <div>
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "500",
            background: `${getStatusColor(invoice.status)}20`,
            color: getStatusColor(invoice.status),
            border: `1px solid ${getStatusColor(invoice.status)}40`,
          }}
        >
          {getStatusText(invoice.status)}
        </span>
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        <button
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#ffffff",
            padding: "6px 8px",
            borderRadius: "6px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          👁️
        </button>
        <button
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#ffffff",
            padding: "6px 8px",
            borderRadius: "6px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          ✏️
        </button>
        <button
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#ffffff",
            padding: "6px 8px",
            borderRadius: "6px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          ⋯
        </button>
      </div>
    </div>
  );
};

// Composant liste des factures
const InvoiceList = ({
  invoices,
  onCreateClick,
}: {
  invoices: any[];
  onCreateClick: () => void;
}) => {
  if (invoices.length === 0) {
    return (
      <Card>
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "16px",
            }}
          >
            📄
          </div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: "8px",
              margin: 0,
            }}
          >
            Aucune facture trouvée
          </h3>
          <p
            style={{
              fontSize: "14px",
              color: "#9ca3af",
              marginBottom: "24px",
              margin: 0,
            }}
          >
            Créez votre première facture pour commencer.
          </p>
          <button
            onClick={onCreateClick}
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
              color: "#ffffff",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ➕ Créer une facture
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {/* En-tête du tableau */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
          gap: "16px",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          marginBottom: "16px",
        }}
        className="invoice-header"
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#9ca3af",
            textTransform: "uppercase",
          }}
        >
          Facture / Client
        </div>
        <div
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#9ca3af",
            textTransform: "uppercase",
          }}
        >
          Date
        </div>
        <div
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#9ca3af",
            textTransform: "uppercase",
          }}
        >
          Montant
        </div>
        <div
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#9ca3af",
            textTransform: "uppercase",
          }}
        >
          Statut
        </div>
        <div
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#9ca3af",
            textTransform: "uppercase",
          }}
        >
          Actions
        </div>
      </div>

      {/* Liste des factures */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {invoices.map((invoice) => (
          <InvoiceRow key={invoice.id} invoice={invoice} />
        ))}
      </div>
    </Card>
  );
};

// Page Factures principale
export default function FacturesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Données d'exemple
  const allInvoices = [
    {
      id: 1,
      number: "FAC-2024-001",
      client: "ABC Corporation",
      date: "15/01/2024",
      amount: "1,250.00 €",
      status: "paid",
    },
    {
      id: 2,
      number: "FAC-2024-002",
      client: "XYZ Sarl",
      date: "18/01/2024",
      amount: "750.00 €",
      status: "sent",
    },
    {
      id: 3,
      number: "FAC-2024-003",
      client: "DEF Ltd",
      date: "20/01/2024",
      amount: "2,100.00 €",
      status: "overdue",
    },
    {
      id: 4,
      number: "FAC-2024-004",
      client: "GHI Industries",
      date: "22/01/2024",
      amount: "450.00 €",
      status: "draft",
    },
    {
      id: 5,
      number: "FAC-2024-005",
      client: "JKL Services",
      date: "25/01/2024",
      amount: "890.00 €",
      status: "paid",
    },
  ];

  // Filtrage des factures
  const filteredInvoices = allInvoices.filter((invoice) => {
    const matchesSearch =
      searchTerm === "" ||
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.amount.includes(searchTerm);

    const matchesStatus =
      statusFilter === "" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: "500",
                borderBottom: "2px solid #8b5cf6",
                paddingBottom: "4px",
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
                color: "#d1d5db",
                textDecoration: "none",
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
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: "500",
                  padding: "8px 0",
                  borderBottom: "1px solid #8b5cf6",
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
                  color: "#d1d5db",
                  textDecoration: "none",
                  padding: "8px 0",
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
            marginBottom: "24px",
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
            Factures
          </h1>
        </div>

        {/* Filtres et recherche */}
        <InvoiceFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          onCreateClick={() => setIsCreateModalOpen(true)}
        />

        {/* Liste des factures */}
        <InvoiceList
          invoices={filteredInvoices}
          onCreateClick={() => setIsCreateModalOpen(true)}
        />
      </main>

      {/* Modal de création de facture */}
      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
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

        @media (max-width: 767px) {
          .invoice-row {
            grid-template-columns: 1fr auto !important;
            gap: 8px !important;
          }

          .invoice-header {
            display: none !important;
          }

          .invoice-row > div:nth-child(2),
          .invoice-row > div:nth-child(3),
          .invoice-row > div:nth-child(4) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
