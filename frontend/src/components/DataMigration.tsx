"use client";

import { useState, useEffect } from "react";
import { hybridStorageService } from "@/services/storage-hybrid";
import { storageService } from "@/utils/storage";

export default function DataMigration() {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string>("");
  const [hasLocalData, setHasLocalData] = useState(false);
  const [localInvoices, setLocalInvoices] = useState<any[]>([]);
  const [localClients, setLocalClients] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [migrationCompleted, setMigrationCompleted] = useState(false);

  // Vérifier côté client et lancer la migration automatiquement
  useEffect(() => {
    setIsClient(true);

    const invoices = storageService.getInvoices();
    const clients = storageService.getClients();

    setLocalInvoices(invoices);
    setLocalClients(clients);
    setHasLocalData(invoices.length > 0 || clients.length > 0);

    // Lancer automatiquement la migration s'il y a des données locales
    if (invoices.length > 0 || clients.length > 0) {
      handleMigration();
    }
  }, []);

  const handleMigration = async () => {
    setIsMigrating(true);
    setMigrationStatus("Démarrage de la migration automatique...");

    try {
      // Récupérer les données les plus récentes
      const currentInvoices = storageService.getInvoices();
      const currentClients = storageService.getClients();

      if (currentInvoices.length === 0 && currentClients.length === 0) {
        setMigrationStatus("Aucune donnée locale à migrer.");
        setIsMigrating(false);
        setMigrationCompleted(true);
        return;
      }

      setMigrationStatus(
        `Migration automatique de ${currentInvoices.length} factures et ${currentClients.length} clients...`
      );

      // Synchroniser avec le backend
      await hybridStorageService.syncWithBackend();

      setMigrationStatus(
        "Migration automatique terminée avec succès ! Vos données sont maintenant sauvegardées en base de données."
      );

      // Marquer la migration comme terminée et masquer après 5 secondes
      setMigrationCompleted(true);
      setTimeout(() => {
        setMigrationCompleted(false);
      }, 5000);
    } catch (error) {
      console.error("Erreur lors de la migration automatique:", error);

      let errorMessage = "Erreur lors de la migration automatique.";

      if (error instanceof Error) {
        if (error.message.includes("Authentification requise")) {
          errorMessage =
            "Migration reportée : vous devez être connecté pour synchroniser vos données.";
        } else if (error.message.includes("API non disponible")) {
          errorMessage =
            "Migration reportée : serveur non disponible. Vos données restent sauvegardées localement.";
        } else {
          errorMessage = `Erreur de migration : ${error.message}`;
        }
      }

      setMigrationStatus(errorMessage);

      // Masquer le message d'erreur après 10 secondes
      setTimeout(() => {
        setMigrationCompleted(true);
      }, 10000);
    } finally {
      setIsMigrating(false);
    }
  };

  // Ne rien afficher côté serveur ou si pas de données locales
  if (!isClient || !hasLocalData) {
    return null;
  }

  // Afficher seulement un petit indicateur de statut en bas à droite
  if (migrationCompleted && !isMigrating) {
    return null; // Ne plus rien afficher une fois terminé
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "12px",
        padding: "12px 16px",
        maxWidth: "350px",
        zIndex: 1000,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: isMigrating
              ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
              : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "8px",
          }}
        >
          {isMigrating ? "⏳" : "✅"}
        </div>
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#ffffff",
            margin: 0,
          }}
        >
          Migration automatique
        </h3>
      </div>

      <div
        style={{
          fontSize: "11px",
          color: "#9ca3af",
          marginBottom: "8px",
        }}
      >
        📊 {localInvoices.length} factures • 👥 {localClients.length} clients
      </div>

      {migrationStatus && (
        <div
          style={{
            fontSize: "11px",
            color: migrationStatus.includes("Erreur") ? "#ef4444" : "#10b981",
            padding: "6px 8px",
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
    </div>
  );
}
