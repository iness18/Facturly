// Service pour gérer les téléchargements de factures
export class DownloadService {
  private static readonly API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

  /**
   * Télécharge une facture au format PDF
   */
  static async downloadPDF(invoiceId: string): Promise<void> {
    // Vérifier que nous sommes côté client
    if (typeof window === "undefined" || typeof document === "undefined") {
      console.error("downloadPDF ne peut être appelé que côté client");
      return;
    }

    try {
      const response = await fetch(
        `${this.API_BASE_URL}/invoices/${invoiceId}/export/pdf`,
        {
          method: "GET",
          headers: {
            // Temporairement sans authentification pour les tests
            // Authorization: `Bearer ${this.getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erreur lors du téléchargement PDF: ${response.statusText}`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Créer un lien de téléchargement temporaire
      const link = document.createElement("a");
      link.href = url;
      link.download = `facture-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Nettoyer
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors du téléchargement PDF:", error);
      throw error;
    }
  }

  /**
   * Télécharge une facture au format CSV
   */
  static async downloadCSV(invoiceId: string): Promise<void> {
    // Vérifier que nous sommes côté client
    if (typeof window === "undefined" || typeof document === "undefined") {
      console.error("downloadCSV ne peut être appelé que côté client");
      return;
    }

    try {
      const response = await fetch(
        `${this.API_BASE_URL}/invoices/${invoiceId}/export/csv`,
        {
          method: "GET",
          headers: {
            // Temporairement sans authentification pour les tests
            // Authorization: `Bearer ${this.getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erreur lors du téléchargement CSV: ${response.statusText}`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Créer un lien de téléchargement temporaire
      const link = document.createElement("a");
      link.href = url;
      link.download = `facture-${invoiceId}.csv`;
      document.body.appendChild(link);
      link.click();

      // Nettoyer
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors du téléchargement CSV:", error);
      throw error;
    }
  }

  /**
   * Télécharge toutes les factures au format CSV
   */
  static async downloadAllCSV(): Promise<void> {
    // Vérifier que nous sommes côté client
    if (typeof window === "undefined" || typeof document === "undefined") {
      console.error("downloadAllCSV ne peut être appelé que côté client");
      return;
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/invoices/export/csv`, {
        method: "GET",
        headers: {
          // Temporairement sans authentification pour les tests
          // Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Erreur lors du téléchargement CSV: ${response.statusText}`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Créer un lien de téléchargement temporaire
      const link = document.createElement("a");
      link.href = url;
      link.download = `factures-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();

      // Nettoyer
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors du téléchargement CSV:", error);
      throw error;
    }
  }

  /**
   * Récupère le token d'authentification
   */
  private static getAuthToken(): string {
    // Pour l'instant, on retourne un token factice
    // Dans une vraie application, on récupérerait le token depuis le localStorage ou un contexte d'auth
    return "fake-token";
  }

  /**
   * Affiche une notification de succès qui disparaît automatiquement
   */
  static showSuccessNotification(message: string): void {
    this.createToast(`✅ ${message}`, "success");
  }

  /**
   * Affiche une notification d'erreur qui disparaît automatiquement
   */
  static showErrorNotification(message: string): void {
    this.createToast(`❌ ${message}`, "error");
  }

  /**
   * Crée une notification toast qui disparaît automatiquement
   */
  private static createToast(message: string, type: "success" | "error"): void {
    // Vérifier que nous sommes côté client
    if (typeof window === "undefined" || typeof document === "undefined") {
      console.log(message); // Fallback pour le côté serveur
      return;
    }

    // Créer l'élément de notification
    const toast = document.createElement("div");
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${
        type === "success"
          ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
          : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
      };
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      max-width: 400px;
      transform: translateX(100%);
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
    `;
    toast.textContent = message;

    // Ajouter au DOM
    document.body.appendChild(toast);

    // Animation d'entrée
    setTimeout(() => {
      toast.style.transform = "translateX(0)";
    }, 100);

    // Animation de sortie et suppression automatique après 3 secondes
    const removeToast = () => {
      toast.style.transform = "translateX(100%)";
      toast.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    };

    // Disparaît automatiquement après 3 secondes
    const autoRemoveTimeout = setTimeout(removeToast, 3000);

    // Permettre de fermer en cliquant dessus
    toast.addEventListener("click", () => {
      clearTimeout(autoRemoveTimeout);
      removeToast();
    });
  }
}
