"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  storageService,
  formatDate,
  formatCurrency,
  type Client,
} from "@/utils/storage";
import ClientDetailsModal from "@/components/ClientDetailsModal";

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

// Composant pour les filtres et recherche
const ClientFilters = ({
  searchTerm,
  onSearchChange,
  onCreateClick,
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
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
            Gestion des Clients
          </h2>
          <a
            href="/dashboard/clients/create"
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
            ➕ Nouveau Client
          </a>
        </div>

        {/* Recherche */}
        <div
          style={{
            maxWidth: "400px",
          }}
        >
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
            placeholder="Nom, email, entreprise..."
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
      </div>
    </Card>
  );
};

// Composant pour une carte de client
const ClientCard = ({
  client,
  onViewDetails,
  onEdit,
  onDelete,
}: {
  client: Client;
  onViewDetails: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}) => {
  return (
    <Card
      style={{
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "16px",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "60px",
            height: "60px",
            background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            flexShrink: 0,
          }}
        >
          {client.name.charAt(0).toUpperCase()}
        </div>

        {/* Informations */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "8px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: "4px",
                  margin: 0,
                }}
              >
                {client.name}
              </h3>
              {client.company && (
                <p
                  style={{
                    fontSize: "14px",
                    color: "#9ca3af",
                    margin: 0,
                  }}
                >
                  {client.company}
                </p>
              )}
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <button
                onClick={() => onViewDetails(client)}
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
                onClick={() => onEdit(client)}
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
              <button
                onClick={() => onDelete(client)}
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
                🗑️
              </button>
            </div>
          </div>

          {/* Contact */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                color: "#d1d5db",
              }}
            >
              <span>📧</span>
              <span>{client.email}</span>
            </div>
            {client.phone && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  color: "#d1d5db",
                }}
              >
                <span>📞</span>
                <span>{client.phone}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#9ca3af",
              }}
            >
              <span style={{ color: "#10b981", fontWeight: "600" }}>
                {client.invoiceCount || 0}
              </span>{" "}
              factures
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#9ca3af",
              }}
            >
              <span style={{ color: "#8b5cf6", fontWeight: "600" }}>
                {formatCurrency(client.totalAmount || 0)}
              </span>{" "}
              total
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Composant liste des clients
const ClientList = ({
  clients,
  onCreateClick,
  onViewDetails,
  onEdit,
  onDelete,
}: {
  clients: Client[];
  onCreateClick: () => void;
  onViewDetails: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}) => {
  if (clients.length === 0) {
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
            👥
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
            Aucun client trouvé
          </h3>
          <p
            style={{
              fontSize: "14px",
              color: "#9ca3af",
              marginBottom: "24px",
              margin: 0,
            }}
          >
            Ajoutez votre premier client pour commencer.
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
            ➕ Ajouter un client
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div
      className="grid-responsive"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "24px",
      }}
    >
      {clients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

// Page Clients principale
export default function ClientsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const router = useRouter();

  // Charger les clients au montage du composant
  useEffect(() => {
    const loadClients = () => {
      const clients = storageService.getClients();
      setAllClients(clients);
    };

    loadClients();

    // Écouter les changements de localStorage (si plusieurs onglets)
    const handleStorageChange = () => {
      loadClients();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleProfileClick = () => {
    router.push("/dashboard/compte");
  };

  // Fonctions de gestion des actions sur les clients
  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    router.push(`/dashboard/clients/create?edit=${client.id}`);
  };

  const handleDelete = (client: Client) => {
    if (
      confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.name} ?`)
    ) {
      storageService.deleteClient(client.id);
      // Recharger les clients
      const clients = storageService.getClients();
      setAllClients(clients);
    }
  };

  // Filtrage des clients
  const filteredClients = allClients.filter((client) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      searchTerm === "" ||
      client.name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      (client.company && client.company.toLowerCase().includes(searchLower))
    );
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
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: "500",
                borderBottom: "2px solid #8b5cf6",
                paddingBottom: "4px",
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
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: "500",
                  padding: "8px 0",
                  borderBottom: "1px solid #8b5cf6",
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
            Clients
          </h1>
        </div>

        {/* Filtres et recherche */}
        <ClientFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onCreateClick={() => router.push("/dashboard/clients/create")}
        />

        {/* Liste des clients */}
        <ClientList
          clients={filteredClients}
          onCreateClick={() => router.push("/dashboard/clients/create")}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* Modal de détails du client */}
      <ClientDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
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
      `}</style>
    </div>
  );
}
