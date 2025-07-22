"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  storageService,
  generateInvoiceNumber as generateInvoiceNum,
  type Invoice,
  type Client,
} from "@/utils/storage";

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

// Simulation des données utilisateur (normalement récupérées depuis une API/base de données)
const getUserCompanyData = () => {
  // Ces données seraient normalement récupérées depuis le profil utilisateur
  // connecté ou depuis une API
  return {
    companyName: "Iness Br.",
    companyAddress: "123 Rue de la Facturation",
    companyPostalCode: "75001",
    companyCity: "Paris",
    companySiret: "12345678901234",
    companyLegalForm: "Micro-entrepreneur",
    companyPhone: "+33 1 23 45 67 89",
    companyEmail: "contact@iness-br.com",
  };
};

// Page de création de facture complète
export default function CreateInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Vérifier si on est en mode édition
  const editId = searchParams.get("edit");
  const isEditing = !!editId;

  // Vérifier si un client est pré-sélectionné
  const preSelectedClientId = searchParams.get("client");

  // État pour la gestion des clients
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  // Récupération automatique des données de l'entreprise
  const userCompanyData = getUserCompanyData();

  const [formData, setFormData] = useState({
    // 1. Informations vendeur (pré-remplies automatiquement depuis le profil)
    sellerName: userCompanyData.companyName,
    sellerAddress: `${userCompanyData.companyAddress}\n${userCompanyData.companyPostalCode} ${userCompanyData.companyCity}`,
    sellerStatus: userCompanyData.companyLegalForm,
    sellerSiret: userCompanyData.companySiret,
    sellerTvaNote: "TVA non applicable, article 293 B du CGI",

    // 2. Informations client
    clientName: "",
    clientAddress: "",
    clientSiren: "",
    clientTvaNumber: "",

    // 3. Informations facture
    invoiceNumber: "",
    issueDate: new Date().toISOString().split("T")[0],
    serviceDate: "",

    // 4. Détail des prestations
    services: [
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
        totalHT: 0,
      },
    ],

    // Totaux
    totalHT: 0,
    tvaRate: 0,
    tvaAmount: 0,
    totalTTC: 0,

    // 5. Conditions
    paymentMethod: "virement",
    paymentDelay: "reception",
    penaltyClause:
      "En cas de retard de paiement, des pénalités égales à 3 fois le taux légal seront exigibles, ainsi qu'une indemnité forfaitaire de 40 € (art. L441-10 du Code de commerce).",
  });

  // Charger les clients disponibles
  useEffect(() => {
    const loadedClients = storageService.getClients();
    setClients(loadedClients);

    // Si un client est pré-sélectionné, le définir
    if (preSelectedClientId) {
      setSelectedClientId(preSelectedClientId);
      const selectedClient = loadedClients.find(
        (c) => c.id === preSelectedClientId
      );
      if (selectedClient) {
        handleClientSelection(selectedClient);
      }
    }
  }, [preSelectedClientId]);

  // Charger les données de la facture à éditer
  useEffect(() => {
    if (isEditing && editId) {
      const invoices = storageService.getInvoices();
      const invoiceToEdit = invoices.find((inv) => inv.id === editId);

      if (invoiceToEdit && invoiceToEdit.fullData) {
        // Charger les données complètes de la facture
        setFormData(invoiceToEdit.fullData);
      } else {
        // Si pas de données complètes, créer à partir des données de base
        setFormData((prev) => ({
          ...prev,
          clientName: invoiceToEdit?.client || "",
          invoiceNumber: invoiceToEdit?.number || "",
          issueDate:
            invoiceToEdit?.date || new Date().toISOString().split("T")[0],
          totalTTC: parseFloat(invoiceToEdit?.amount || "0"),
        }));
      }
    }
  }, [isEditing, editId]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fonction pour gérer la sélection d'un client
  const handleClientSelection = (client: Client) => {
    setFormData((prev) => ({
      ...prev,
      clientName: client.name,
      clientAddress: `${client.address || ""}\n${client.postalCode || ""} ${
        client.city || ""
      }`.trim(),
      clientSiren: client.siren || "",
      clientTvaNumber: client.tvaNumber || "",
    }));
  };

  // Fonction pour gérer le changement de client sélectionné
  const handleClientSelectChange = (clientId: string) => {
    setSelectedClientId(clientId);

    if (clientId === "") {
      // Réinitialiser les champs client
      setFormData((prev) => ({
        ...prev,
        clientName: "",
        clientAddress: "",
        clientSiren: "",
        clientTvaNumber: "",
      }));
    } else {
      const selectedClient = clients.find((c) => c.id === clientId);
      if (selectedClient) {
        handleClientSelection(selectedClient);
      }
    }
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

    // Recalculer le total HT pour cette ligne
    if (field === "quantity" || field === "unitPrice") {
      newServices[index].totalHT =
        Number(newServices[index].quantity) *
        Number(newServices[index].unitPrice);
    }

    setFormData((prev) => ({
      ...prev,
      services: newServices,
    }));

    // Recalculer les totaux
    calculateTotals(newServices);
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
      setFormData((prev) => ({
        ...prev,
        services: newServices,
      }));
      calculateTotals(newServices);
    }
  };

  const calculateTotals = (services: any[]) => {
    const totalHT = services.reduce(
      (sum, service) => sum + Number(service.totalHT),
      0
    );
    const tvaAmount = totalHT * (Number(formData.tvaRate) / 100);
    const totalTTC = totalHT + tvaAmount;

    setFormData((prev) => ({
      ...prev,
      totalHT,
      tvaAmount,
      totalTTC,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Générer le numéro de facture si pas défini
    const invoiceNumber = formData.invoiceNumber || generateInvoiceNum();

    if (isEditing && editId) {
      // Mode édition : mettre à jour la facture existante
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

        // Mettre à jour la facture
        storageService.saveInvoice(updatedInvoice);
        console.log("Facture mise à jour:", updatedInvoice);
      }
    } else {
      // Mode création : créer une nouvelle facture
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

      // Sauvegarder la facture
      storageService.saveInvoice(newInvoice);
      console.log("Nouvelle facture créée et sauvegardée:", newInvoice);
    }

    // Rediriger vers la page des factures
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
          <div
            style={{
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
        </div>
      </nav>

      {/* Contenu principal */}
      <main
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "20px 16px",
        }}
      >
        {/* Titre */}
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
          <p
            style={{
              color: "#9ca3af",
              fontSize: "16px",
              margin: 0,
            }}
          >
            {isEditing
              ? "Modifiez votre facture conforme à la réglementation française"
              : "Créez une facture conforme à la réglementation française"}
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            {/* 1. Informations vendeur */}
            <Card>
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
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  🏢 1. Informations Vendeur/Prestataire
                </h2>
                <div
                  style={{
                    padding: "6px 12px",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#10b981",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  ✅ Récupéré automatiquement
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
                    Statut juridique *
                  </label>
                  <select
                    value={formData.sellerStatus}
                    onChange={(e) =>
                      handleInputChange("sellerStatus", e.target.value)
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
                  >
                    <option
                      value="Micro-entrepreneur"
                      style={{ background: "#1a1a2e" }}
                    >
                      Micro-entrepreneur
                    </option>
                    <option value="EI" style={{ background: "#1a1a2e" }}>
                      Entreprise Individuelle (EI)
                    </option>
                    <option value="EURL" style={{ background: "#1a1a2e" }}>
                      EURL
                    </option>
                    <option value="SARL" style={{ background: "#1a1a2e" }}>
                      SARL
                    </option>
                    <option value="SAS" style={{ background: "#1a1a2e" }}>
                      SAS
                    </option>
                    <option value="SASU" style={{ background: "#1a1a2e" }}>
                      SASU
                    </option>
                  </select>
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
                    placeholder="12345678901234"
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

              <div style={{ marginBottom: "20px" }}>
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
                  }}
                />
              </div>

              <div
                style={{
                  padding: "16px",
                  background: "rgba(59, 130, 246, 0.1)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    color: "#3b82f6",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "4px",
                  }}
                >
                  💡 Informations automatiques
                </div>
                <div style={{ color: "#d1d5db", fontSize: "14px" }}>
                  Ces informations sont automatiquement récupérées depuis votre
                  profil d'entreprise.
                  <br />
                  <strong>Mention TVA :</strong> {formData.sellerTvaNote}
                </div>
              </div>
            </Card>

            {/* 2. Informations client */}
            <Card>
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
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  👤 2. Informations Client
                </h2>
                <a
                  href="/dashboard/clients/create"
                  style={{
                    background: "rgba(139, 92, 246, 0.1)",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                    color: "#8b5cf6",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "500",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  ➕ Nouveau client
                </a>
              </div>

              {/* Sélecteur de client existant */}
              {clients.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#9ca3af",
                      marginBottom: "8px",
                    }}
                  >
                    Sélectionner un client existant
                  </label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => handleClientSelectChange(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                      marginBottom: "16px",
                    }}
                  >
                    <option value="" style={{ background: "#1a1a2e" }}>
                      -- Saisir manuellement ou sélectionner un client --
                    </option>
                    {clients.map((client) => (
                      <option
                        key={client.id}
                        value={client.id}
                        style={{ background: "#1a1a2e" }}
                      >
                        {client.name}{" "}
                        {client.company ? `(${client.company})` : ""}
                      </option>
                    ))}
                  </select>
                  {selectedClientId && (
                    <div
                      style={{
                        padding: "12px 16px",
                        background: "rgba(16, 185, 129, 0.1)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        borderRadius: "8px",
                        fontSize: "14px",
                        color: "#10b981",
                        marginBottom: "16px",
                      }}
                    >
                      ✅ Client sélectionné - Les informations ont été
                      pré-remplies automatiquement
                    </div>
                  )}
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
                    value={formData.clientName}
                    onChange={(e) =>
                      handleInputChange("clientName", e.target.value)
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
                      marginBottom: "8px",
                    }}
                  >
                    N° SIREN (si professionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.clientSiren}
                    onChange={(e) =>
                      handleInputChange("clientSiren", e.target.value)
                    }
                    placeholder="123456789"
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
                      marginBottom: "8px",
                    }}
                  >
                    N° TVA intracom (si UE)
                  </label>
                  <input
                    type="text"
                    value={formData.clientTvaNumber}
                    onChange={(e) =>
                      handleInputChange("clientTvaNumber", e.target.value)
                    }
                    placeholder="FR12345678901"
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
                    marginBottom: "8px",
                  }}
                >
                  Adresse du siège social *
                </label>
                <textarea
                  required
                  value={formData.clientAddress}
                  onChange={(e) =>
                    handleInputChange("clientAddress", e.target.value)
                  }
                  placeholder="123 Rue du Client, 75001 Paris"
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
            </Card>

            {/* 3. Informations facture */}
            <Card>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                📄 3. Informations sur la Facture
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
                    Numéro de facture *
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
                    }}
                  />
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      marginTop: "4px",
                    }}
                  >
                    Doit être unique et chronologique
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
                    Date de prestation
                  </label>
                  <input
                    type="date"
                    value={formData.serviceDate}
                    onChange={(e) =>
                      handleInputChange("serviceDate", e.target.value)
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
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      marginTop: "4px",
                    }}
                  >
                    Si différente de la date de facture
                  </div>
                </div>
              </div>
            </Card>

            {/* 4. Détail des prestations */}
            <Card>
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
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  🛍️ 4. Détail des Prestations
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
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  ➕ Ajouter une ligne
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
                      alignItems: "end",
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
                        placeholder="Ex: Conception site web vitrine"
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
                        Prix unitaire HT *
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

              {/* Totaux */}
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
                  💰 Totaux
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
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#10b981",
                      }}
                    >
                      {formData.totalHT.toFixed(2)} €
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
                      TVA ({formData.tvaRate}%)
                    </label>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#10b981",
                      }}
                    >
                      {formData.tvaAmount.toFixed(2)} €
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
                      Total TTC
                    </label>
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
              </div>
            </Card>

            {/* 5. Conditions */}
            <Card>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                📋 5. Conditions de Paiement
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
                    Modalité de paiement *
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      handleInputChange("paymentMethod", e.target.value)
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
                  >
                    <option value="virement" style={{ background: "#1a1a2e" }}>
                      Virement bancaire
                    </option>
                    <option value="cheque" style={{ background: "#1a1a2e" }}>
                      Chèque
                    </option>
                    <option value="especes" style={{ background: "#1a1a2e" }}>
                      Espèces
                    </option>
                    <option value="carte" style={{ background: "#1a1a2e" }}>
                      Carte bancaire
                    </option>
                    <option value="paypal" style={{ background: "#1a1a2e" }}>
                      PayPal
                    </option>
                  </select>
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
                    Délai de paiement *
                  </label>
                  <select
                    value={formData.paymentDelay}
                    onChange={(e) =>
                      handleInputChange("paymentDelay", e.target.value)
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
                  >
                    <option value="reception" style={{ background: "#1a1a2e" }}>
                      Paiement à réception
                    </option>
                    <option value="30j" style={{ background: "#1a1a2e" }}>
                      30 jours
                    </option>
                    <option
                      value="30j_fin_mois"
                      style={{ background: "#1a1a2e" }}
                    >
                      30 jours fin de mois
                    </option>
                    <option value="45j" style={{ background: "#1a1a2e" }}>
                      45 jours
                    </option>
                    <option value="60j" style={{ background: "#1a1a2e" }}>
                      60 jours
                    </option>
                  </select>
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
                  Clause de pénalités de retard (obligatoire) *
                </label>
                <textarea
                  required
                  value={formData.penaltyClause}
                  onChange={(e) =>
                    handleInputChange("penaltyClause", e.target.value)
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
                  }}
                />
              </div>
            </Card>

            {/* Boutons d'action */}
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
                  padding: "12px 32px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                📄 {isEditing ? "Mettre à jour la Facture" : "Créer la Facture"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
