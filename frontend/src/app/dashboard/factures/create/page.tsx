"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  storageService,
  generateInvoiceNumber as generateInvoiceNum,
  type Invoice,
  type Client,
} from "@/utils/storage";

// Composant principal qui utilise useSearchParams
function CreateInvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const editId = searchParams.get("edit");
  const isEditing = !!editId;
  const preSelectedClientId = searchParams.get("client");

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  const [formData, setFormData] = useState({
    sellerName: "",
    sellerAddress: "",
    sellerSiret: "",
    clientName: "",
    clientAddress: "",
    invoiceNumber: "",
    issueDate: new Date().toISOString().split("T")[0],
    services: [
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
        totalHT: 0,
      },
    ],
    totalHT: 0,
    totalTTC: 0,
    paymentMethod: "virement",
  });

  useEffect(() => {
    const loadedClients = storageService.getClients();
    setClients(loadedClients);

    if (preSelectedClientId) {
      setSelectedClientId(preSelectedClientId);
      const selectedClient = loadedClients.find(
        (c) => c.id === preSelectedClientId
      );
      if (selectedClient) {
        setFormData((prev) => ({
          ...prev,
          clientName: selectedClient.name,
          clientAddress: `${selectedClient.address || ""}\n${
            selectedClient.postalCode || ""
          } ${selectedClient.city || ""}`.trim(),
        }));
      }
    }
  }, [preSelectedClientId]);

  useEffect(() => {
    if (isEditing && editId) {
      const invoices = storageService.getInvoices();
      const invoiceToEdit = invoices.find((inv) => inv.id === editId);

      if (invoiceToEdit && invoiceToEdit.fullData) {
        setFormData(invoiceToEdit.fullData);
      }
    }
  }, [isEditing, editId]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newServices = [...formData.services];
    newServices[index] = {
      ...newServices[index],
      [field]: value,
    };

    if (field === "quantity" || field === "unitPrice") {
      newServices[index].totalHT =
        Number(newServices[index].quantity) *
        Number(newServices[index].unitPrice);
    }

    const totalHT = newServices.reduce(
      (sum, service) => sum + Number(service.totalHT),
      0
    );

    setFormData((prev) => ({
      ...prev,
      services: newServices,
      totalHT,
      totalTTC: totalHT,
    }));
  };

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
          totalHT: 0,
        },
      ],
    }));
  };

  const removeService = (index: number) => {
    if (formData.services.length > 1) {
      const newServices = formData.services.filter((_, i) => i !== index);
      const totalHT = newServices.reduce(
        (sum, service) => sum + Number(service.totalHT),
        0
      );
      setFormData((prev) => ({
        ...prev,
        services: newServices,
        totalHT,
        totalTTC: totalHT,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const invoiceNumber = formData.invoiceNumber || generateInvoiceNum();

    if (isEditing && editId) {
      const invoices = storageService.getInvoices();
      const existingInvoice = invoices.find((inv) => inv.id === editId);

      if (existingInvoice) {
        const updatedInvoice: Invoice = {
          ...existingInvoice,
          number: invoiceNumber,
          client: formData.clientName,
          date: formData.issueDate,
          amount: formData.totalTTC.toFixed(2),
          fullData: {
            ...formData,
            invoiceNumber: invoiceNumber,
          },
        };

        storageService.saveInvoice(updatedInvoice);
      }
    } else {
      const newInvoice: Invoice = {
        id: `invoice_${Date.now()}`,
        number: invoiceNumber,
        client: formData.clientName,
        date: formData.issueDate,
        amount: formData.totalTTC.toFixed(2),
        status: "draft",
        createdAt: new Date().toISOString(),
        fullData: {
          ...formData,
          invoiceNumber: invoiceNumber,
        },
      };

      storageService.saveInvoice(newInvoice);
    }

    router.push("/dashboard/factures");
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
            gap: "16px",
          }}
        >
          <a
            href="/dashboard"
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#ffffff",
              textDecoration: "none",
            }}
          >
            Facturly
          </a>
          <span style={{ color: "#9ca3af" }}>→</span>
          <a
            href="/dashboard/factures"
            style={{
              color: "#9ca3af",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            Factures
          </a>
          <span style={{ color: "#9ca3af" }}>→</span>
          <span style={{ color: "#ffffff", fontSize: "14px" }}>
            {isEditing ? "Modifier facture" : "Nouvelle facture"}
          </span>
        </div>
      </nav>

      <main
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "20px 16px",
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#ffffff",
              margin: 0,
              marginBottom: "8px",
            }}
          >
            📄 {isEditing ? "Modifier la Facture" : "Nouvelle Facture"}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "32px" }}
          >
            {/* Informations vendeur */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: "20px",
                }}
              >
                🏢 Informations Vendeur
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#9ca3af",
                      marginBottom: "8px",
                    }}
                  >
                    Nom/Raison sociale *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sellerName}
                    onChange={(e) =>
                      handleInputChange("sellerName", e.target.value)
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
                      boxSizing: "border-box",
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
                      marginBottom: "8px",
                    }}
                  >
                    SIRET *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sellerSiret}
                    onChange={(e) =>
                      handleInputChange("sellerSiret", e.target.value)
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
                      boxSizing: "border-box",
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
                    marginBottom: "8px",
                  }}
                >
                  Adresse *
                </label>
                <textarea
                  required
                  value={formData.sellerAddress}
                  onChange={(e) =>
                    handleInputChange("sellerAddress", e.target.value)
                  }
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
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Informations client */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: "20px",
                }}
              >
                👤 Informations Client
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#9ca3af",
                      marginBottom: "8px",
                    }}
                  >
                    Nom/Raison sociale *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) =>
                      handleInputChange("clientName", e.target.value)
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
                      boxSizing: "border-box",
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
                      marginBottom: "8px",
                    }}
                  >
                    Adresse *
                  </label>
                  <textarea
                    required
                    value={formData.clientAddress}
                    onChange={(e) =>
                      handleInputChange("clientAddress", e.target.value)
                    }
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
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Informations facture */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: "20px",
                }}
              >
                📄 Informations Facture
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#9ca3af",
                      marginBottom: "8px",
                    }}
                  >
                    Numéro de facture
                  </label>
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) =>
                      handleInputChange("invoiceNumber", e.target.value)
                    }
                    placeholder={generateInvoiceNum()}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
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
                      marginBottom: "8px",
                    }}
                  >
                    Date d'émission *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.issueDate}
                    onChange={(e) =>
                      handleInputChange("issueDate", e.target.value)
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
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Prestations */}
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
                  marginBottom: "20px",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#ffffff",
                    margin: 0,
                  }}
                >
                  🛍️ Prestations
                </h2>
                <button
                  type="button"
                  onClick={addService}
                  style={{
                    background:
                      "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                    color: "#ffffff",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  ➕ Ajouter
                </button>
              </div>

              {formData.services.map((service, index) => (
                <div
                  key={index}
                  style={{
                    padding: "20px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    marginBottom: "16px",
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
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#ffffff",
                        margin: 0,
                      }}
                    >
                      Prestation {index + 1}
                    </h3>
                    {formData.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        style={{
                          background: "rgba(239, 68, 68, 0.8)",
                          color: "#ffffff",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "none",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        🗑️ Supprimer
                      </button>
                    )}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr 1fr",
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
                          marginBottom: "8px",
                        }}
                      >
                        Description *
                      </label>
                      <textarea
                        required
                        value={service.description}
                        onChange={(e) =>
                          handleServiceChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
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
                          boxSizing: "border-box",
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
                          marginBottom: "8px",
                        }}
                      >
                        Quantité *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={service.quantity}
                        onChange={(e) =>
                          handleServiceChange(
                            index,
                            "quantity",
                            parseFloat(e.target.value) || 0
                          )
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
                          boxSizing: "border-box",
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
                          marginBottom: "8px",
                        }}
                      >
                        Prix unitaire *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={service.unitPrice}
                        onChange={(e) =>
                          handleServiceChange(
                            index,
                            "unitPrice",
                            parseFloat(e.target.value) || 0
                          )
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
                          boxSizing: "border-box",
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
                          marginBottom: "8px",
                        }}
                      >
                        Total HT
                      </label>
                      <div
                        style={{
                          padding: "12px 16px",
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "8px",
                          color: "#10b981",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {service.totalHT.toFixed(2)} €
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div
                style={{
                  padding: "20px",
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "12px",
                  marginTop: "20px",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: "16px",
                    margin: 0,
                  }}
                >
                  💰 Total
                </h3>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#ffffff",
                  }}
                >
                  {formData.totalTTC.toFixed(2)} €
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "flex-end",
                paddingTop: "32px",
              }}
            >
              <button
                type="button"
                onClick={() => router.push("/dashboard/factures")}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
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
                  padding: "12px 32px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                📄 {isEditing ? "Mettre à jour" : "Créer la Facture"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

// Composant de chargement
function LoadingFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
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
        <p style={{ marginTop: "16px", color: "#d1d5db" }}>Chargement...</p>
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

// Composant principal avec Suspense
export default function CreateInvoicePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CreateInvoiceContent />
    </Suspense>
  );
}
