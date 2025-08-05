"use client";

import React from "react";
import { formatDate, formatCurrency } from "@/utils/storage";
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

// Composant Modal de détails de facture complète
const InvoiceDetailsModal = ({
  isOpen,
  onClose,
  invoice,
}: {
  isOpen: boolean;
  onClose: () => void;
  invoice: any | null;
}) => {
  // Fonctions de téléchargement
  const handleDownloadPDF = async () => {
    if (!invoice) return;
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

  const handleDownloadCSV = async () => {
    if (!invoice) return;
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
  if (!isOpen || !invoice) return null;

  // Récupérer les données complètes de la facture
  const fullData = invoice.fullData || {};

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
            📄 Facture {invoice.number}
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
          {/* Informations vendeur */}
          {fullData.sellerName && (
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
                🏢 Vendeur/Prestataire
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
                    Nom/Raison sociale
                  </label>
                  <div
                    style={{
                      fontSize: "16px",
                      color: "#ffffff",
                      fontWeight: "600",
                      marginTop: "4px",
                    }}
                  >
                    {fullData.sellerName}
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
                    Statut juridique
                  </label>
                  <div
                    style={{
                      fontSize: "16px",
                      color: "#ffffff",
                      marginTop: "4px",
                    }}
                  >
                    {fullData.sellerStatus}
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
                    SIRET
                  </label>
                  <div
                    style={{
                      fontSize: "16px",
                      color: "#ffffff",
                      marginTop: "4px",
                    }}
                  >
                    {fullData.sellerSiret}
                  </div>
                </div>
              </div>
              {fullData.sellerAddress && (
                <div style={{ marginTop: "16px" }}>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      fontWeight: "600",
                    }}
                  >
                    Adresse
                  </label>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#d1d5db",
                      marginTop: "4px",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {fullData.sellerAddress}
                  </div>
                </div>
              )}
            </Card>
          )}

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
                  {fullData.clientName || invoice.client}
                </div>
              </div>
              {fullData.clientSiren && (
                <div>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      fontWeight: "600",
                    }}
                  >
                    N° SIREN
                  </label>
                  <div
                    style={{
                      fontSize: "16px",
                      color: "#ffffff",
                      marginTop: "4px",
                    }}
                  >
                    {fullData.clientSiren}
                  </div>
                </div>
              )}
              {fullData.clientTvaNumber && (
                <div>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      fontWeight: "600",
                    }}
                  >
                    N° TVA intracom
                  </label>
                  <div
                    style={{
                      fontSize: "16px",
                      color: "#ffffff",
                      marginTop: "4px",
                    }}
                  >
                    {fullData.clientTvaNumber}
                  </div>
                </div>
              )}
            </div>
            {fullData.clientAddress && (
              <div style={{ marginTop: "16px" }}>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}
                >
                  Adresse
                </label>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#d1d5db",
                    marginTop: "4px",
                    whiteSpace: "pre-line",
                  }}
                >
                  {fullData.clientAddress}
                </div>
              </div>
            )}
          </Card>

          {/* Informations facture */}
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
              📄 Informations Facture
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
                  {formatDate(fullData.issueDate || invoice.date)}
                </div>
              </div>
              {fullData.serviceDate && (
                <div>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      fontWeight: "600",
                    }}
                  >
                    Date de prestation
                  </label>
                  <div
                    style={{
                      fontSize: "16px",
                      color: "#ffffff",
                      marginTop: "4px",
                    }}
                  >
                    {formatDate(fullData.serviceDate)}
                  </div>
                </div>
              )}
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

          {/* Détail des prestations */}
          {fullData.services && fullData.services.length > 0 && (
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
                🛍️ Détail des Prestations
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {fullData.services.map((service: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      padding: "16px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 1fr 1fr",
                        gap: "16px",
                        alignItems: "center",
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
                          Description
                        </label>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#ffffff",
                            marginTop: "4px",
                          }}
                        >
                          {service.description}
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
                          Quantité
                        </label>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#ffffff",
                            marginTop: "4px",
                          }}
                        >
                          {service.quantity}
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
                          Prix unitaire HT
                        </label>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#ffffff",
                            marginTop: "4px",
                          }}
                        >
                          {formatCurrency(service.unitPrice)}
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
                          Total HT
                        </label>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#10b981",
                            fontWeight: "600",
                            marginTop: "4px",
                          }}
                        >
                          {formatCurrency(service.totalHT)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totaux */}
              <div
                style={{
                  marginTop: "20px",
                  padding: "16px",
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
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
                      Total HT
                    </label>
                    <div
                      style={{
                        fontSize: "16px",
                        color: "#10b981",
                        fontWeight: "600",
                        marginTop: "4px",
                      }}
                    >
                      {formatCurrency(fullData.totalHT || 0)}
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
                      TVA ({fullData.tvaRate || 0}%)
                    </label>
                    <div
                      style={{
                        fontSize: "16px",
                        color: "#10b981",
                        fontWeight: "600",
                        marginTop: "4px",
                      }}
                    >
                      {formatCurrency(fullData.tvaAmount || 0)}
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
                      Total TTC
                    </label>
                    <div
                      style={{
                        fontSize: "20px",
                        color: "#ffffff",
                        fontWeight: "bold",
                        marginTop: "4px",
                      }}
                    >
                      {formatCurrency(parseFloat(invoice.amount))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Conditions de paiement */}
          {(fullData.paymentMethod ||
            fullData.paymentDelay ||
            fullData.penaltyClause) && (
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
                📋 Conditions de Paiement
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                }}
              >
                {fullData.paymentMethod && (
                  <div>
                    <label
                      style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        textTransform: "uppercase",
                        fontWeight: "600",
                      }}
                    >
                      Modalité de paiement
                    </label>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#ffffff",
                        marginTop: "4px",
                      }}
                    >
                      {fullData.paymentMethod === "virement"
                        ? "Virement bancaire"
                        : fullData.paymentMethod === "cheque"
                        ? "Chèque"
                        : fullData.paymentMethod === "especes"
                        ? "Espèces"
                        : fullData.paymentMethod === "carte"
                        ? "Carte bancaire"
                        : fullData.paymentMethod === "paypal"
                        ? "PayPal"
                        : fullData.paymentMethod}
                    </div>
                  </div>
                )}
                {fullData.paymentDelay && (
                  <div>
                    <label
                      style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        textTransform: "uppercase",
                        fontWeight: "600",
                      }}
                    >
                      Délai de paiement
                    </label>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#ffffff",
                        marginTop: "4px",
                      }}
                    >
                      {fullData.paymentDelay === "reception"
                        ? "Paiement à réception"
                        : fullData.paymentDelay === "30j"
                        ? "30 jours"
                        : fullData.paymentDelay === "30j_fin_mois"
                        ? "30 jours fin de mois"
                        : fullData.paymentDelay === "45j"
                        ? "45 jours"
                        : fullData.paymentDelay === "60j"
                        ? "60 jours"
                        : fullData.paymentDelay}
                    </div>
                  </div>
                )}
              </div>
              {fullData.penaltyClause && (
                <div style={{ marginTop: "16px" }}>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      fontWeight: "600",
                    }}
                  >
                    Clause de pénalités
                  </label>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#d1d5db",
                      marginTop: "4px",
                      lineHeight: "1.5",
                    }}
                  >
                    {fullData.penaltyClause}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              flexWrap: "wrap",
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
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }}
            >
              Fermer
            </button>
            <button
              onClick={handleDownloadPDF}
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
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
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(16, 185, 129, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              📄 Télécharger PDF
            </button>
            <button
              onClick={handleDownloadCSV}
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
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
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(59, 130, 246, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              📊 Télécharger CSV
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
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(139, 92, 246, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
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

export default InvoiceDetailsModal;
