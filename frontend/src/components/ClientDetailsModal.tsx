"use client";

import React from "react";
import { createPortal } from "react-dom";
import { formatDate, formatCurrency, type Client } from "@/utils/storage";

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  if (!isOpen || !client) return null;

  const modalContent = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "20px",
          padding: "0",
          maxWidth: "800px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "32px 32px 24px 32px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            position: "sticky",
            top: 0,
            background:
              "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)",
            borderRadius: "20px 20px 0 0",
            zIndex: 10,
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
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* Avatar */}
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  color: "#ffffff",
                  fontWeight: "bold",
                }}
              >
                {client.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#ffffff",
                    margin: 0,
                    marginBottom: "4px",
                  }}
                >
                  {client.name}
                </h2>
                {client.company && (
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#9ca3af",
                      margin: 0,
                    }}
                  >
                    {client.company}
                  </p>
                )}
              </div>
            </div>
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
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }}
            >
              ✕
            </button>
          </div>

          {/* Stats rapides */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "16px",
            }}
          >
            <div
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "12px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#10b981",
                  marginBottom: "4px",
                }}
              >
                {client.invoiceCount || 0}
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>Factures</div>
            </div>
            <div
              style={{
                background: "rgba(139, 92, 246, 0.1)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                borderRadius: "12px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#8b5cf6",
                  marginBottom: "4px",
                }}
              >
                {formatCurrency(client.totalAmount || 0)}
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>Total</div>
            </div>
            <div
              style={{
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: "12px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#3b82f6",
                  marginBottom: "4px",
                }}
              >
                {client.lastInvoiceDate
                  ? formatDate(client.lastInvoiceDate)
                  : "Aucune"}
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                Dernière facture
              </div>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div style={{ padding: "32px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "32px",
            }}
          >
            {/* Informations de contact */}
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                📞 Contact
              </h3>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                      display: "block",
                    }}
                  >
                    Email
                  </label>
                  <div style={{ fontSize: "14px", color: "#ffffff" }}>
                    {client.email}
                  </div>
                </div>
                {client.phone && (
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#9ca3af",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                        display: "block",
                      }}
                    >
                      Téléphone
                    </label>
                    <div style={{ fontSize: "14px", color: "#ffffff" }}>
                      {client.phone}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Adresse de facturation */}
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                📍 Adresse de facturation
              </h3>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                {client.address ||
                client.postalCode ||
                client.city ||
                client.country ? (
                  <>
                    {client.address && (
                      <div style={{ marginBottom: "8px" }}>
                        <div style={{ fontSize: "14px", color: "#ffffff" }}>
                          {client.address}
                        </div>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      {client.postalCode && (
                        <div style={{ fontSize: "14px", color: "#ffffff" }}>
                          {client.postalCode}
                        </div>
                      )}
                      {client.city && (
                        <div style={{ fontSize: "14px", color: "#ffffff" }}>
                          {client.city}
                        </div>
                      )}
                    </div>
                    {client.country && (
                      <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                        {client.country}
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#9ca3af",
                      fontStyle: "italic",
                    }}
                  >
                    Aucune adresse renseignée
                  </div>
                )}
              </div>
            </div>

            {/* Informations légales */}
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                🏢 Informations légales
              </h3>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                {client.legalForm && (
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#9ca3af",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                        display: "block",
                      }}
                    >
                      Forme juridique
                    </label>
                    <div style={{ fontSize: "14px", color: "#ffffff" }}>
                      {client.legalForm}
                    </div>
                  </div>
                )}
                {client.siren && (
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#9ca3af",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                        display: "block",
                      }}
                    >
                      SIREN
                    </label>
                    <div style={{ fontSize: "14px", color: "#ffffff" }}>
                      {client.siren}
                    </div>
                  </div>
                )}
                {client.siret && (
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#9ca3af",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                        display: "block",
                      }}
                    >
                      SIRET
                    </label>
                    <div style={{ fontSize: "14px", color: "#ffffff" }}>
                      {client.siret}
                    </div>
                  </div>
                )}
                {client.tvaNumber && (
                  <div>
                    <label
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#9ca3af",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                        display: "block",
                      }}
                    >
                      N° TVA intracommunautaire
                    </label>
                    <div style={{ fontSize: "14px", color: "#ffffff" }}>
                      {client.tvaNumber}
                    </div>
                  </div>
                )}
                {!client.legalForm &&
                  !client.siren &&
                  !client.siret &&
                  !client.tvaNumber && (
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#9ca3af",
                        fontStyle: "italic",
                      }}
                    >
                      Aucune information légale renseignée
                    </div>
                  )}
              </div>
            </div>

            {/* Notes */}
            {client.notes && (
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  📝 Notes
                </h3>
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#ffffff",
                      lineHeight: "1.6",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {client.notes}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div
            style={{
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <a
              href={`/dashboard/clients/create?edit=${client.id}`}
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
            >
              ✏️ Modifier
            </a>
            <a
              href={`/dashboard/factures/create?client=${client.id}`}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
            >
              📄 Nouvelle facture
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  // Utiliser un portail pour s'assurer que la modal s'affiche au-dessus de tout
  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};

export default ClientDetailsModal;
