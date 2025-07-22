"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { storageService, generateClientId, type Client } from "@/utils/storage";

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

// Page de création/édition de client complète
export default function CreateClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Vérifier si on est en mode édition
  const editId = searchParams.get("edit");
  const isEditing = !!editId;

  const [formData, setFormData] = useState({
    // Informations de base
    name: "",
    email: "",
    phone: "",
    company: "",

    // Adresse complète
    address: "",
    postalCode: "",
    city: "",
    country: "France",

    // Informations légales pour les entreprises
    siren: "",
    siret: "",
    tvaNumber: "",
    legalForm: "",

    // Notes
    notes: "",
  });

  // Charger les données du client à éditer
  useEffect(() => {
    if (isEditing && editId) {
      const client = storageService.getClientById(editId);

      if (client) {
        setFormData({
          name: client.name || "",
          email: client.email || "",
          phone: client.phone || "",
          company: client.company || "",
          address: client.address || "",
          postalCode: client.postalCode || "",
          city: client.city || "",
          country: client.country || "France",
          siren: client.siren || "",
          siret: client.siret || "",
          tvaNumber: client.tvaNumber || "",
          legalForm: client.legalForm || "",
          notes: client.notes || "",
        });
      }
    }
  }, [isEditing, editId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && editId) {
      // Mode édition : mettre à jour le client existant
      const existingClient = storageService.getClientById(editId);

      if (existingClient) {
        const updatedClient: Client = {
          ...existingClient,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          address: formData.address,
          postalCode: formData.postalCode,
          city: formData.city,
          country: formData.country,
          siren: formData.siren,
          siret: formData.siret,
          tvaNumber: formData.tvaNumber,
          legalForm: formData.legalForm,
          notes: formData.notes,
        };

        storageService.saveClient(updatedClient);
        console.log("Client mis à jour:", updatedClient);
      }
    } else {
      // Mode création : créer un nouveau client
      const newClient: Client = {
        id: generateClientId(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        address: formData.address,
        postalCode: formData.postalCode,
        city: formData.city,
        country: formData.country,
        siren: formData.siren,
        siret: formData.siret,
        tvaNumber: formData.tvaNumber,
        legalForm: formData.legalForm,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      storageService.saveClient(newClient);
      console.log("Nouveau client créé:", newClient);
    }

    // Rediriger vers la page des clients
    router.push("/dashboard/clients");
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
              href="/dashboard/clients"
              style={{
                color: "#9ca3af",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Clients
            </a>
            <span style={{ color: "#9ca3af" }}>→</span>
            <span style={{ color: "#ffffff", fontSize: "14px" }}>
              {isEditing ? "Modifier client" : "Nouveau client"}
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
            👤 {isEditing ? "Modifier le Client" : "Nouveau Client"}
          </h1>
          <p
            style={{
              color: "#9ca3af",
              fontSize: "16px",
              margin: 0,
            }}
          >
            {isEditing
              ? "Modifiez les informations de votre client"
              : "Ajoutez un nouveau client avec toutes les informations nécessaires à la facturation"}
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
            {/* 1. Informations de base */}
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
                📋 1. Informations de Base
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
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ex: Jean Dupont"
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
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
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
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="06 12 34 56 78"
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
                    Entreprise/Organisation
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    placeholder="ABC Corporation"
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
            </Card>

            {/* 2. Adresse complète */}
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
                📍 2. Adresse de Facturation
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
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
                    Adresse *
                  </label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="123 Rue de la Paix"
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

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
                      Code postal
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) =>
                        handleInputChange("postalCode", e.target.value)
                      }
                      placeholder="75001"
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
                      Ville
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      placeholder="Paris"
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
                      Pays
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
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
                      <option value="France" style={{ background: "#1a1a2e" }}>
                        France
                      </option>
                      <option
                        value="Belgique"
                        style={{ background: "#1a1a2e" }}
                      >
                        Belgique
                      </option>
                      <option value="Suisse" style={{ background: "#1a1a2e" }}>
                        Suisse
                      </option>
                      <option
                        value="Luxembourg"
                        style={{ background: "#1a1a2e" }}
                      >
                        Luxembourg
                      </option>
                      <option value="Canada" style={{ background: "#1a1a2e" }}>
                        Canada
                      </option>
                      <option value="Autre" style={{ background: "#1a1a2e" }}>
                        Autre
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            {/* 3. Informations légales */}
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
                🏢 3. Informations Légales (Entreprises)
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
                    Forme juridique
                  </label>
                  <select
                    value={formData.legalForm}
                    onChange={(e) =>
                      handleInputChange("legalForm", e.target.value)
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
                    <option value="" style={{ background: "#1a1a2e" }}>
                      Sélectionner...
                    </option>
                    <option
                      value="Particulier"
                      style={{ background: "#1a1a2e" }}
                    >
                      Particulier
                    </option>
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
                    <option value="SA" style={{ background: "#1a1a2e" }}>
                      SA
                    </option>
                    <option
                      value="Association"
                      style={{ background: "#1a1a2e" }}
                    >
                      Association
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
                    N° SIREN
                  </label>
                  <input
                    type="text"
                    value={formData.siren}
                    onChange={(e) => handleInputChange("siren", e.target.value)}
                    placeholder="123456789"
                    maxLength={9}
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
                    N° SIRET
                  </label>
                  <input
                    type="text"
                    value={formData.siret}
                    onChange={(e) => handleInputChange("siret", e.target.value)}
                    placeholder="12345678901234"
                    maxLength={14}
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
                    N° TVA intracommunautaire
                  </label>
                  <input
                    type="text"
                    value={formData.tvaNumber}
                    onChange={(e) =>
                      handleInputChange("tvaNumber", e.target.value)
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
                  💡 Informations légales
                </div>
                <div style={{ color: "#d1d5db", fontSize: "14px" }}>
                  Ces informations sont nécessaires pour la facturation des
                  entreprises.
                  <br />
                  Pour les particuliers, seuls le nom et l'adresse sont
                  obligatoires.
                </div>
              </div>
            </Card>

            {/* 4. Notes */}
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
                📝 4. Notes et Informations Complémentaires
              </h2>

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
                  Notes internes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Informations supplémentaires, préférences de facturation, historique..."
                  rows={4}
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
                onClick={() => router.push("/dashboard/clients")}
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
                👤 {isEditing ? "Mettre à jour le Client" : "Créer le Client"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
