"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  storageService,
  formatDate,
  formatCurrency,
  type Invoice,
} from "@/utils/storage";
import StatusSelect from "@/components/StatusSelect";
import InvoiceDetailsModalComponent from "@/components/InvoiceDetailsModal";
import { DownloadService } from "@/utils/downloadService";

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

// Composant Modal de confirmation de suppression
const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  invoice,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  invoice: any | null;
}) => {
  if (!isOpen || !invoice) return null;

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
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Icône d'avertissement */}
        <div
          style={{
            fontSize: "48px",
            marginBottom: "16px",
          }}
        >
          ⚠️
        </div>

        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#ffffff",
            margin: 0,
            marginBottom: "12px",
          }}
        >
          Supprimer la facture
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: "#d1d5db",
            margin: 0,
            marginBottom: "8px",
          }}
        >
          Êtes-vous sûr de vouloir supprimer la facture
        </p>

        <p
          style={{
            fontSize: "18px",
            color: "#ffffff",
            fontWeight: "600",
            margin: 0,
            marginBottom: "24px",
          }}
        >
          {invoice.number} ?
        </p>

        <p
          style={{
            fontSize: "14px",
            color: "#ef4444",
            margin: 0,
            marginBottom: "32px",
          }}
        >
          Cette action est irréversible.
        </p>

        {/* Boutons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            style={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              border: "none",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            🗑️ Supprimer
          </button>
        </div>
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
          <a
            href="/dashboard/factures/create"
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
              textDecoration: "none",
            }}
          >
            ➕ Nouvelle Facture
          </a>
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
            <StatusSelect value={statusFilter} onChange={onStatusChange} />
          </div>
        </div>
      </div>
    </Card>
  );
};

// Composant pour une ligne de facture
const InvoiceRow = ({
  invoice,
  onViewDetails,
  onEdit,
  onDuplicate,
  onDelete,
  onDownloadPDF,
  onDownloadCSV,
}: {
  invoice: any;
  onViewDetails: (invoice: any) => void;
  onEdit: (invoice: any) => void;
  onDuplicate: (invoice: any) => void;
  onDelete: (invoice: any) => void;
  onDownloadPDF: (invoice: any) => void;
  onDownloadCSV: (invoice: any) => void;
}) => {
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  // Fermer le menu quand on clique ailleurs
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowActionsMenu(false);
    };

    if (showActionsMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showActionsMenu]);

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
        {formatDate(invoice.date)}
      </div>

      {/* Montant */}
      <div
        style={{
          fontSize: "16px",
          fontWeight: "600",
          color: "#ffffff",
        }}
      >
        {formatCurrency(parseFloat(invoice.amount))}
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
          position: "relative",
        }}
      >
        <button
          onClick={() => onViewDetails(invoice)}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#ffffff",
            padding: "6px 8px",
            borderRadius: "6px",
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          }}
        >
          👁️
        </button>
        <button
          onClick={() => onEdit(invoice)}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#ffffff",
            padding: "6px 8px",
            borderRadius: "6px",
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          }}
        >
          ✏️
        </button>
        <div style={{ position: "relative" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActionsMenu(!showActionsMenu);
            }}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              padding: "6px 8px",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }}
          >
            ⋯
          </button>

          {/* Menu déroulant */}
          {showActionsMenu && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "4px",
                background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                padding: "8px",
                minWidth: "150px",
                zIndex: 1000,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              <button
                onClick={() => {
                  onDuplicate(invoice);
                  setShowActionsMenu(false);
                }}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                📋 Dupliquer
              </button>
              <div
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  📥 Télécharger
                </span>
                <div
                  style={{ display: "flex", gap: "6px", paddingLeft: "24px" }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownloadPDF(invoice);
                      setShowActionsMenu(false);
                    }}
                    style={{
                      background:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      border: "none",
                      color: "#ffffff",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    PDF
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownloadCSV(invoice);
                      setShowActionsMenu(false);
                    }}
                    style={{
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                      border: "none",
                      color: "#ffffff",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    CSV
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  onDelete(invoice);
                  setShowActionsMenu(false);
                }}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  color: "#ef4444",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                🗑️ Supprimer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant liste des factures
const InvoiceList = ({
  invoices,
  onCreateClick,
  onViewDetails,
  onEdit,
  onDuplicate,
  onDelete,
  onDownloadPDF,
  onDownloadCSV,
}: {
  invoices: any[];
  onCreateClick: () => void;
  onViewDetails: (invoice: any) => void;
  onEdit: (invoice: any) => void;
  onDuplicate: (invoice: any) => void;
  onDelete: (invoice: any) => void;
  onDownloadPDF: (invoice: any) => void;
  onDownloadCSV: (invoice: any) => void;
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
          <a
            href="/dashboard/factures/create"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
              color: "#ffffff",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            ➕ Créer une facture
          </a>
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
          <InvoiceRow
            key={invoice.id}
            invoice={invoice}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onDownloadPDF={onDownloadPDF}
            onDownloadCSV={onDownloadCSV}
          />
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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const router = useRouter();

  // État pour les factures (chargées depuis le localStorage)
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);

  // Charger les factures au montage du composant
  useEffect(() => {
    const loadInvoices = () => {
      const invoices = storageService.getInvoices();
      setAllInvoices(invoices);
    };

    loadInvoices();

    // Écouter les changements de localStorage (si plusieurs onglets)
    const handleStorageChange = () => {
      loadInvoices();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleProfileClick = () => {
    router.push("/dashboard/compte");
  };

  // Fonctions de gestion des actions sur les factures
  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (invoice: Invoice) => {
    // Rediriger vers la page de création avec les données de la facture pour édition
    router.push(`/dashboard/factures/create?edit=${invoice.id}`);
  };

  const handleDuplicate = (invoice: Invoice) => {
    const duplicatedInvoice: Invoice = {
      ...invoice,
      id: `invoice_${Date.now()}`, // Nouvel ID
      number: `FACT-${new Date().getFullYear()}-${String(Date.now()).slice(
        -4
      )}`, // Nouveau numéro
      status: "draft", // Statut brouillon par défaut
      date: new Date().toISOString().split("T")[0], // Date actuelle
      createdAt: new Date().toISOString(),
    };

    // Sauvegarder la facture dupliquée
    storageService.saveInvoice(duplicatedInvoice);

    // Recharger les factures
    const invoices = storageService.getInvoices();
    setAllInvoices(invoices);
  };

  const handleDelete = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedInvoice) {
      // Supprimer la facture du stockage
      storageService.deleteInvoice(selectedInvoice.id);

      // Recharger les factures
      const invoices = storageService.getInvoices();
      setAllInvoices(invoices);

      setIsDeleteModalOpen(false);
      setSelectedInvoice(null);
    }
  };

  // Fonctions de téléchargement
  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      await DownloadService.downloadPDF(invoice.id);
      DownloadService.showSuccessNotification(
        `PDF de la facture ${invoice.number} téléchargé avec succès`
      );
    } catch (error) {
      DownloadService.showErrorNotification(
        `Erreur lors du téléchargement du PDF de la facture ${invoice.number}`
      );
    }
  };

  const handleDownloadCSV = async (invoice: Invoice) => {
    try {
      await DownloadService.downloadCSV(invoice.id);
      DownloadService.showSuccessNotification(
        `CSV de la facture ${invoice.number} téléchargé avec succès`
      );
    } catch (error) {
      DownloadService.showErrorNotification(
        `Erreur lors du téléchargement du CSV de la facture ${invoice.number}`
      );
    }
  };

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
          onCreateClick={() => router.push("/dashboard/factures/create")}
        />

        {/* Liste des factures */}
        <InvoiceList
          invoices={filteredInvoices}
          onCreateClick={() => router.push("/dashboard/factures/create")}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onDownloadPDF={handleDownloadPDF}
          onDownloadCSV={handleDownloadCSV}
        />
      </main>

      {/* Modal de détails de facture */}
      <InvoiceDetailsModalComponent
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
      />

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedInvoice(null);
        }}
        onConfirm={confirmDelete}
        invoice={selectedInvoice}
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
