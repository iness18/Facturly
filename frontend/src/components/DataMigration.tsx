"use client";

import { useState } from "react";
import { hybridStorageService } from "@/services/storage-hybrid";
import { storageService } from "@/utils/storage";

export default function DataMigration() {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string>("");
  const [showMigration, setShowMigration] = useState(false);

  const handleMigration = async () => {
    setIsMigrating(true);
    setMigrationStatus("Démarrage de la migration...");

    try {
      // Vérifier s'il y a des données locales à migrer
      const localInvoices = storageService.getInvoices();
      const localClients = storageService.getClients();

      if (localInvoices.length === 0 && localClients.length === 0) {
        setMigrationStatus("Aucune donnée locale à migrer.");
        setIsMigrating(false);
        return;
      }

      setMigrationStatus(
        `Migration de ${localInvoices.length} factures et ${localClients.length} clients...`
      );

      // Synchroniser avec le backend
      await hybridStorageService.syncWithBackend();

      setMigrationStatus(
        "Migration terminée avec succès ! Vos données sont maintenant sauvegardées en base de données."
      );
    } catch (error) {
      console.error("Erreur lors de la migration:", error);
      setMigrationStatus(
        "Erreur lors de la migration. Vos données restent sauvegardées localement."
      );
    } finally {
      setIsMigrating(false);
    }
  };

  // Vérifier s'il y a des données locales
  const localInvoices = storageService.getInvoices();
  const localClients = storageService.getClients();
  const hasLocalData = localInvoices.length > 0 || localClients.length > 0;

  if (!hasLocalData && !showMigration) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "12px",
        padding: "16px",
        maxWidth: "400px",
        zIndex: 1000,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
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
          🔄 Migration des données
        </h3>
        <button
          onClick={() => setShowMigration(false)}
          style={{
            background: "transparent",
            border: "none",
            color: "#9ca3af",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          ×
        </button>
      </div>

      <p
        style={{
          fontSize: "14px",
          color: "#d1d5db",
          margin: "0 0 12px 0",
          lineHeight: "1.4",
        }}
      >
        Nous avons détecté des données stockées localement. Voulez-vous les
        sauvegarder en base de données pour éviter de les perdre ?
      </p>

      <div
        style={{
          fontSize: "12px",
          color: "#9ca3af",
          marginBottom: "16px",
        }}
      >
        📊 {localInvoices.length} factures • 👥 {localClients.length} clients
      </div>

      {migrationStatus && (
        <div
          style={{
            fontSize: "12px",
            color: migrationStatus.includes("Erreur") ? "#ef4444" : "#10b981",
            marginBottom: "12px",
            padding: "8px",
            background: migrationStatus.includes("Erreur")
              ? "rgba(239, 68, 68, 0.1)"
              : "rgba(16, 185, 129, 0.1)",
            borderRadius: "6px",
            border: `1px solid ${
              migrationStatus.includes("Erreur")
                ? "rgba(239, 68, 68, 0.3)"
                : "rgba(16, 185, 129, 0.3)"
            }`,
          }}
        >
          {migrationStatus}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        <button
          onClick={handleMigration}
          disabled={isMigrating}
          style={{
            background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
            color: "#ffffff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "600",
            cursor: isMigrating ? "not-allowed" : "pointer",
            opacity: isMigrating ? 0.7 : 1,
            flex: 1,
          }}
        >
          {isMigrating ? "Migration..." : "Migrer maintenant"}
        </button>
        <button
          onClick={() => setShowMigration(false)}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            color: "#d1d5db",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          Plus tard
        </button>
      </div>
    </div>
  );
}
