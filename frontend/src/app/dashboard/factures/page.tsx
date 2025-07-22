"use client";

import React, { useState } from "react";
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

// Composant Modal de création de facture
const CreateInvoiceModal = ({
  isOpen,
  onClose,
  onInvoiceCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onInvoiceCreated: (invoice: any) => void;
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

    // Créer une nouvelle facture
    const newInvoice = {
      id: Date.now(), // ID temporaire basé sur timestamp
      number: `FAC-2024-${String(Date.now()).slice(-3)}`,
      client: formData.client,
      date: new Date().toLocaleDateString("fr-FR"),
      amount: `${parseFloat(formData.amount).toFixed(2)} €`,
      status: "draft",
    };

    // Ajouter la facture à la liste
    onInvoiceCreated(newInvoice);

    console.log("Nouvelle facture créée:", newInvoice);
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

// Composant Modal de détails de facture
const InvoiceDetailsModal = ({
  isOpen,
  onClose,
  invoice,
}: {
  isOpen: boolean;
  onClose: () => void;
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
            Détails de la Facture
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

        {/* Contenu */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Informations principales */}
          <Card>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#ffffff",
                margin: 0,
                marginBottom: "16px",
              }}
            >
              📄 Informations Générales
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
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}
                >
                  Numéro de facture
                </label>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#ffffff",
                    fontWeight: "600",
                    marginTop: "4px",
                  }}
                >
                  {invoice.number}
                </div>
              </div>
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}
                >
                  Date d'émission
                </label>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#ffffff",
                    marginTop: "4px",
                  }}
                >
                  {invoice.date}
                </div>
              </div>
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}
                >
                  Montant
                </label>
                <div
                  style={{
                    fontSize: "20px",
                    color: "#10b981",
                    fontWeight: "bold",
                    marginTop: "4px",
                  }}
                >
                  {invoice.amount}
                </div>
              </div>
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}
                >
                  Statut
                </label>
                <div style={{ marginTop: "4px" }}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      background:
                        invoice.status === "paid"
                          ? "#10b98120"
                          : invoice.status === "sent"
                          ? "#3b82f620"
                          : invoice.status === "overdue"
                          ? "#ef444420"
                          : "#9ca3af20",
                      color:
                        invoice.status === "paid"
                          ? "#10b981"
                          : invoice.status === "sent"
                          ? "#3b82f6"
                          : invoice.status === "overdue"
                          ? "#ef4444"
                          : "#9ca3af",
                      border: `1px solid ${
                        invoice.status === "paid"
                          ? "#10b98140"
                          : invoice.status === "sent"
                          ? "#3b82f640"
                          : invoice.status === "overdue"
                          ? "#ef444440"
                          : "#9ca3af40"
                      }`,
                    }}
                  >
                    {invoice.status === "paid"
                      ? "Payée"
                      : invoice.status === "sent"
                      ? "Envoyée"
                      : invoice.status === "overdue"
                      ? "En retard"
                      : "Brouillon"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Informations client */}
          <Card>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#ffffff",
                margin: 0,
                marginBottom: "16px",
              }}
            >
              👤 Informations Client
            </h3>
            <div>
              <label
                style={{
                  fontSize: "12px",
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  fontWeight: "600",
                }}
              >
                Nom du client
              </label>
              <div
                style={{
                  fontSize: "16px",
                  color: "#ffffff",
                  fontWeight: "600",
                  marginTop: "4px",
                }}
              >
                {invoice.client}
              </div>
            </div>
          </Card>

          {/* Actions */}
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
              onClick={onClose}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Fermer
            </button>
            <button
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                border: "none",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              📧 Envoyer par email
            </button>
          </div>
        </div>
      </div>
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
                appearance: "none",
                backgroundImage:
                  'url(\'data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%23ffffff" d="M2 0L0 2h4zm0 5L0 3h4z"/></svg>\')',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
                backgroundSize: "12px",
                paddingRight: "32px",
              }}
            >
              <option
                value=""
                style={{ background: "#1a1a2e", color: "#ffffff" }}
              >
                Tous les statuts
              </option>
              <option
                value="draft"
                style={{ background: "#1a1a2e", color: "#ffffff" }}
              >
                Brouillon
              </option>
              <option
                value="sent"
                style={{ background: "#1a1a2e", color: "#ffffff" }}
              >
                Envoyée
              </option>
              <option
                value="paid"
                style={{ background: "#1a1a2e", color: "#ffffff" }}
              >
                Payée
              </option>
              <option
                value="overdue"
                style={{ background: "#1a1a2e", color: "#ffffff" }}
              >
                En retard
              </option>
            </select>
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
}: {
  invoice: any;
  onViewDetails: (invoice: any) => void;
  onEdit: (invoice: any) => void;
  onDuplicate: (invoice: any) => void;
  onDelete: (invoice: any) => void;
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
}: {
  invoices: any[];
  onCreateClick: () => void;
  onViewDetails: (invoice: any) => void;
  onEdit: (invoice: any) => void;
  onDuplicate: (invoice: any) => void;
  onDelete: (invoice: any) => void;
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
          <InvoiceRow
            key={invoice.id}
            invoice={invoice}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const router = useRouter();

  // État pour les factures (maintenant dynamique)
  const [allInvoices, setAllInvoices] = useState([
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
  ]);

  const handleProfileClick = () => {
    router.push("/dashboard/compte");
  };

  const handleInvoiceCreated = (newInvoice: any) => {
    setAllInvoices((prev) => [newInvoice, ...prev]); // Ajouter en début de liste
  };

  // Fonctions de gestion des actions sur les factures
  const handleViewDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (invoice: any) => {
    // Pour l'instant, on redirige vers une page d'édition (à créer)
    router.push(`/dashboard/factures/edit/${invoice.id}`);
  };

  const handleDuplicate = (invoice: any) => {
    const duplicatedInvoice = {
      ...invoice,
      id: Date.now(), // Nouvel ID
      number: `FAC-2024-${String(Date.now()).slice(-3)}`, // Nouveau numéro
      status: "draft", // Statut brouillon par défaut
      date: new Date().toLocaleDateString("fr-FR"), // Date actuelle
    };
    setAllInvoices((prev) => [duplicatedInvoice, ...prev]);
  };

  const handleDelete = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedInvoice) {
      setAllInvoices((prev) =>
        prev.filter((inv) => inv.id !== selectedInvoice.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedInvoice(null);
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
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      </main>

      {/* Modal de création de facture */}
      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onInvoiceCreated={handleInvoiceCreated}
      />

      {/* Modal de détails de facture */}
      <InvoiceDetailsModal
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
