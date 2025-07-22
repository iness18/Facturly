// Service hybride qui utilise l'API backend quand disponible, localStorage en fallback
import {
  apiService,
  type Invoice as ApiInvoice,
  type Client as ApiClient,
} from "./api";
import {
  storageService,
  type Invoice as LocalInvoice,
  type Client as LocalClient,
} from "../utils/storage";

interface HybridInvoice {
  id: string;
  number: string;
  client: string;
  date: string;
  amount: string;
  status: "draft" | "sent" | "paid" | "overdue";
  createdAt: string;
  fullData: any;
}

interface HybridClient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  postalCode?: string;
  city?: string;
  country?: string;
  siret?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  invoiceCount?: number;
  totalAmount?: number;
  lastInvoiceDate?: string;
}

class HybridStorageService {
  private isApiAvailable = false;

  constructor() {
    this.checkApiAvailability();
  }

  // Vérifier si l'API backend est disponible
  private async checkApiAvailability(): Promise<boolean> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/health`,
        {
          method: "GET",
          timeout: 3000,
        } as any
      );
      this.isApiAvailable = response.ok;
      return this.isApiAvailable;
    } catch (error) {
      this.isApiAvailable = false;
      return false;
    }
  }

  // === GESTION DES FACTURES ===

  async getInvoices(): Promise<HybridInvoice[]> {
    try {
      if (await this.checkApiAvailability()) {
        const result = await apiService.getInvoices();
        if (result.data) {
          return this.convertApiInvoicesToLocal(result.data);
        }
      }
    } catch (error) {
      console.warn("API non disponible, utilisation du localStorage:", error);
    }

    // Fallback vers localStorage
    return storageService.getInvoices();
  }

  async saveInvoice(invoice: HybridInvoice): Promise<void> {
    try {
      if (await this.checkApiAvailability()) {
        const apiInvoice = this.convertLocalInvoiceToApi(invoice);

        if (invoice.id.startsWith("invoice_")) {
          // Nouvelle facture
          const result = await apiService.createInvoice(apiInvoice);
          if (result.data) {
            // Mettre à jour l'ID local avec l'ID de la base de données
            invoice.id = result.data.id;
            storageService.saveInvoice(invoice);
            return;
          }
        } else {
          // Mise à jour d'une facture existante
          const result = await apiService.updateInvoice(invoice.id, apiInvoice);
          if (result.data) {
            storageService.saveInvoice(invoice);
            return;
          }
        }
      }
    } catch (error) {
      console.warn("Erreur API, sauvegarde en local:", error);
    }

    // Fallback vers localStorage
    storageService.saveInvoice(invoice);
  }

  async deleteInvoice(invoiceId: string): Promise<void> {
    try {
      if (await this.checkApiAvailability()) {
        const result = await apiService.deleteInvoice(invoiceId);
        if (!result.error) {
          storageService.deleteInvoice(invoiceId);
          return;
        }
      }
    } catch (error) {
      console.warn("Erreur API, suppression en local:", error);
    }

    // Fallback vers localStorage
    storageService.deleteInvoice(invoiceId);
  }

  getInvoiceById(invoiceId: string): HybridInvoice | null {
    return storageService.getInvoiceById(invoiceId);
  }

  // === GESTION DES CLIENTS ===

  async getClients(): Promise<HybridClient[]> {
    try {
      if (await this.checkApiAvailability()) {
        const result = await apiService.getClients();
        if (result.data) {
          return this.convertApiClientsToLocal(result.data);
        }
      }
    } catch (error) {
      console.warn("API non disponible, utilisation du localStorage:", error);
    }

    // Fallback vers localStorage
    return storageService.getClients();
  }

  async saveClient(client: HybridClient): Promise<void> {
    try {
      if (await this.checkApiAvailability()) {
        const apiClient = this.convertLocalClientToApi(client);

        if (client.id.startsWith("client_")) {
          // Nouveau client
          const result = await apiService.createClient(apiClient);
          if (result.data) {
            client.id = result.data.id;
            storageService.saveClient(client);
            return;
          }
        } else {
          // Mise à jour d'un client existant
          const result = await apiService.updateClient(client.id, apiClient);
          if (result.data) {
            storageService.saveClient(client);
            return;
          }
        }
      }
    } catch (error) {
      console.warn("Erreur API, sauvegarde en local:", error);
    }

    // Fallback vers localStorage
    storageService.saveClient(client);
  }

  async deleteClient(clientId: string): Promise<void> {
    try {
      if (await this.checkApiAvailability()) {
        const result = await apiService.deleteClient(clientId);
        if (!result.error) {
          storageService.deleteClient(clientId);
          return;
        }
      }
    } catch (error) {
      console.warn("Erreur API, suppression en local:", error);
    }

    // Fallback vers localStorage
    storageService.deleteClient(clientId);
  }

  getClientById(id: string): HybridClient | null {
    return storageService.getClientById(id);
  }

  searchClients(query: string): HybridClient[] {
    return storageService.searchClients(query);
  }

  // === SYNCHRONISATION ===

  async syncWithBackend(): Promise<void> {
    if (!(await this.checkApiAvailability())) {
      console.log("API non disponible, synchronisation impossible");
      return;
    }

    try {
      // Synchroniser les factures
      const localInvoices = storageService.getInvoices();
      for (const invoice of localInvoices) {
        if (invoice.id.startsWith("invoice_")) {
          // Facture créée en local, l'envoyer au backend
          await this.saveInvoice(invoice);
        }
      }

      // Synchroniser les clients
      const localClients = storageService.getClients();
      for (const client of localClients) {
        if (client.id.startsWith("client_")) {
          // Client créé en local, l'envoyer au backend
          await this.saveClient(client);
        }
      }

      console.log("Synchronisation terminée");
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error);
    }
  }

  // === MÉTHODES DE CONVERSION ===

  private convertApiInvoicesToLocal(
    apiInvoices: ApiInvoice[]
  ): HybridInvoice[] {
    return apiInvoices.map((invoice) => ({
      id: invoice.id,
      number: invoice.invoiceNumber,
      client: invoice.client.name,
      date: invoice.issueDate,
      amount: invoice.totalAmount.toString(),
      status: invoice.status.toLowerCase() as any,
      createdAt: invoice.createdAt,
      fullData: invoice,
    }));
  }

  private convertLocalInvoiceToApi(localInvoice: HybridInvoice): any {
    return {
      invoiceNumber: localInvoice.number,
      title: localInvoice.fullData?.title || "",
      description: localInvoice.fullData?.description || "",
      amount: parseFloat(localInvoice.amount),
      taxAmount: localInvoice.fullData?.taxAmount || 0,
      totalAmount: parseFloat(localInvoice.amount),
      status: localInvoice.status.toUpperCase(),
      issueDate: localInvoice.date,
      dueDate: localInvoice.fullData?.dueDate || localInvoice.date,
      notes: localInvoice.fullData?.notes || "",
      clientId: localInvoice.fullData?.clientId || "temp-client-id",
      items: localInvoice.fullData?.items || [],
    };
  }

  private convertApiClientsToLocal(apiClients: ApiClient[]): HybridClient[] {
    return apiClients.map((client) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address || "",
      city: client.city,
      postalCode: client.postalCode,
      country: client.country,
      siret: client.siret,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }));
  }

  private convertLocalClientToApi(localClient: HybridClient): any {
    return {
      name: localClient.name,
      email: localClient.email,
      phone: localClient.phone,
      address: localClient.address,
      city: localClient.city,
      postalCode: localClient.postalCode,
      country: localClient.country,
      siret: localClient.siret,
    };
  }

  // === MÉTHODES UTILITAIRES ===

  getInvoiceStats() {
    return storageService.getInvoiceStats();
  }

  getRecentTasks() {
    return storageService.getRecentTasks();
  }

  addRecentTask(task: any) {
    return storageService.addRecentTask(task);
  }

  clearAllData() {
    return storageService.clearAllData();
  }

  exportData() {
    return storageService.exportData();
  }

  importData(jsonData: string) {
    return storageService.importData(jsonData);
  }
}

// Instance singleton
export const hybridStorageService = new HybridStorageService();

// Exporter les types
export type { HybridInvoice, HybridClient };

// Fonctions utilitaires
export {
  generateInvoiceNumber,
  generateClientId,
  formatCurrency,
  formatDate,
} from "../utils/storage";
