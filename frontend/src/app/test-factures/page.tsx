"use client";

import React, { useState } from "react";
import { DownloadService } from "@/utils/downloadService";

// Données de test pour simuler des factures
const testInvoices = [
  {
    id: "test-invoice-id",
    number: "FAC-2025-001",
    client: "Client Test",
    date: "2025-08-05",
    amount: "1200.00",
    status: "sent",
  },
  {
    id: "test-invoice-2",
    number: "FAC-2025-002",
    client: "Autre Client",
    date: "2025-08-04",
    amount: "850.00",
    status: "paid",
  },
];

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

// Composant pour tester les téléchargements
export default function TestFacturesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDownloadPDF = async (invoice: any) => {
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

  const handleDownloadCSV = async (invoice: any) => {
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

  const handleDownloadAllCSV = async () => {
    try {
      await DownloadService.downloadAllCSV();
      DownloadService.showSuccessNotification(
        `CSV de toutes les factures téléchargé avec succès`
      );
    } catch (error) {
      DownloadService.showErrorNotification(
        `Erreur lors du téléchargement du CSV`
      );
    }
  };

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
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)",
        color: "#ffffff",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", marginBottom: "32px" }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#ffffff",
            margin: 0,
            marginBottom: "8px",
          }}
        >
          🧪 Test des Téléchargements de Factures
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "16px" }}>
          Page de test pour vérifier les fonctionnalités de téléchargement PDF
          et CSV
        </p>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Bouton pour télécharger toutes les factures en CSV */}
        <Card style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ margin: 0, marginBottom: "8px", color: "#ffffff" }}>
                Export global
              </h3>
              <p style={{ margin: 0, color: "#9ca3af" }}>
                Télécharger toutes les factures au format CSV
              </p>
            </div>
            <button
              onClick={handleDownloadAllCSV}
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                border: "none",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              📊 Télécharger toutes les factures (CSV)
            </button>
          </div>
        </Card>

        {/* Liste des factures de test */}
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
            Factures de test
          </h3>

          {testInvoices.map((invoice) => (
            <div
              key={invoice.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
                gap: "16px",
                alignItems: "center",
                padding: "16px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                marginBottom: "12px",
              }}
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
                {invoice.amount}€
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
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => {
                    setSelectedInvoice(invoice);
                    setShowModal(true);
                  }}
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
                  onClick={() => handleDownloadPDF(invoice)}
                  style={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    border: "none",
                    color: "#ffffff",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  📄 PDF
                </button>
                <button
                  onClick={() => handleDownloadCSV(invoice)}
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    border: "none",
                    color: "#ffffff",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  📊 CSV
                </button>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Modal de test */}
      {showModal && selectedInvoice && (
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
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#ffffff",
                margin: 0,
                marginBottom: "24px",
              }}
            >
              📄 Facture {selectedInvoice.number}
            </h2>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ color: "#d1d5db", margin: "8px 0" }}>
                <strong>Client:</strong> {selectedInvoice.client}
              </p>
              <p style={{ color: "#d1d5db", margin: "8px 0" }}>
                <strong>Date:</strong> {selectedInvoice.date}
              </p>
              <p style={{ color: "#d1d5db", margin: "8px 0" }}>
                <strong>Montant:</strong> {selectedInvoice.amount}€
              </p>
            </div>

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
                onClick={() => setShowModal(false)}
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
                onClick={() => {
                  handleDownloadPDF(selectedInvoice);
                  setShowModal(false);
                }}
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  border: "none",
                  color: "#ffffff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                📄 Télécharger PDF
              </button>
              <button
                onClick={() => {
                  handleDownloadCSV(selectedInvoice);
                  setShowModal(false);
                }}
                style={{
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  border: "none",
                  color: "#ffffff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                📊 Télécharger CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
