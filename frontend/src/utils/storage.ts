// Service de stockage local pour les données de l'application
export interface Invoice {
  id: string;
  number: string;
  client: string;
  date: string;
  amount: string;
  status: "draft" | "sent" | "paid" | "overdue";
  createdAt: string;
  fullData: any;
}

// Interface pour les clients
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;

  // Informations pour la facturation
  address: string;
  postalCode?: string;
  city?: string;
  country?: string;

  // Informations légales (pour les entreprises)
  siren?: string;
  siret?: string;
  tvaNumber?: string; // Numéro TVA intracommunautaire
  legalForm?: string; // SARL, SAS, etc.

  // Métadonnées
  createdAt: string;
  updatedAt: string;
  notes?: string;

  // Statistiques (calculées dynamiquement)
  invoiceCount?: number;
  totalAmount?: number;
  lastInvoiceDate?: string;
}

export interface RecentTask {
  id: string;
  type:
    | "invoice_created"
    | "invoice_sent"
    | "payment_received"
    | "client_added";
  title: string;
  description: string;
  date: string;
  icon: string;
}

class StorageService {
  private readonly INVOICES_KEY = "facturly_invoices";
  private readonly RECENT_TASKS_KEY = "facturly_recent_tasks";
  private readonly CLIENTS_KEY = "facturly_clients";

  // Gestion des factures
  getInvoices(): Invoice[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(this.INVOICES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Erreur lors de la récupération des factures:", error);
      return [];
    }
  }

  saveInvoice(invoice: Invoice): void {
    if (typeof window === "undefined") return;

    try {
      const invoices = this.getInvoices();
      const existingIndex = invoices.findIndex((inv) => inv.id === invoice.id);
      const isNewInvoice = existingIndex < 0;

      if (existingIndex >= 0) {
        invoices[existingIndex] = invoice;
      } else {
        invoices.unshift(invoice); // Ajouter au début de la liste
      }

      localStorage.setItem(this.INVOICES_KEY, JSON.stringify(invoices));

      // Ajouter une tâche récente SEULEMENT pour les nouvelles factures
      if (isNewInvoice) {
        this.addRecentTask({
          id: `task_${Date.now()}`,
          type: "invoice_created",
          title: "Nouvelle facture créée",
          description: `Facture ${invoice.number} pour ${invoice.client}`,
          date: new Date().toISOString(),
          icon: "📄",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la facture:", error);
    }
  }

  deleteInvoice(invoiceId: string): void {
    if (typeof window === "undefined") return;

    try {
      const invoices = this.getInvoices();
      const filteredInvoices = invoices.filter((inv) => inv.id !== invoiceId);
      localStorage.setItem(this.INVOICES_KEY, JSON.stringify(filteredInvoices));
    } catch (error) {
      console.error("Erreur lors de la suppression de la facture:", error);
    }
  }

  getInvoiceById(invoiceId: string): Invoice | null {
    const invoices = this.getInvoices();
    return invoices.find((inv) => inv.id === invoiceId) || null;
  }

  // Gestion des tâches récentes
  getRecentTasks(): RecentTask[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(this.RECENT_TASKS_KEY);
      const tasks = stored ? JSON.parse(stored) : [];

      // Retourner les 10 tâches les plus récentes
      return tasks.slice(0, 10);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des tâches récentes:",
        error
      );
      return [];
    }
  }

  addRecentTask(task: RecentTask): void {
    if (typeof window === "undefined") return;

    try {
      const tasks = this.getRecentTasks();

      // Logique de déduplication améliorée
      let shouldAdd = true;

      if (task.type === "invoice_created") {
        // Pour les factures, extraire le numéro de facture de la description
        const invoiceNumberMatch = task.description.match(/Facture ([^\s]+)/);
        if (invoiceNumberMatch) {
          const invoiceNumber = invoiceNumberMatch[1];
          // Vérifier s'il existe déjà une tâche pour cette facture
          const existingTaskIndex = tasks.findIndex(
            (existingTask) =>
              existingTask.type === "invoice_created" &&
              existingTask.description.includes(`Facture ${invoiceNumber}`)
          );

          if (existingTaskIndex >= 0) {
            // Remplacer l'ancienne tâche par la nouvelle (mise à jour)
            tasks.splice(existingTaskIndex, 1);
          }
        }
      } else if (task.type === "client_added") {
        // Pour les clients, extraire le nom du client
        const clientNameMatch = task.description.match(/Client ([^]+) ajouté/);
        if (clientNameMatch) {
          const clientName = clientNameMatch[1];
          // Vérifier s'il existe déjà une tâche pour ce client
          const existingTaskIndex = tasks.findIndex(
            (existingTask) =>
              existingTask.type === "client_added" &&
              existingTask.description.includes(`Client ${clientName}`)
          );

          if (existingTaskIndex >= 0) {
            // Ne pas ajouter de doublon pour le même client
            shouldAdd = false;
          }
        }
      } else {
        // Pour les autres types, vérifier la description exacte
        const existingTaskIndex = tasks.findIndex(
          (existingTask) =>
            existingTask.type === task.type &&
            existingTask.description === task.description
        );

        if (existingTaskIndex >= 0) {
          tasks.splice(existingTaskIndex, 1);
        }
      }

      if (shouldAdd) {
        tasks.unshift(task); // Ajouter au début
      }

      // Garder seulement les 20 tâches les plus récentes
      const limitedTasks = tasks.slice(0, 20);

      localStorage.setItem(this.RECENT_TASKS_KEY, JSON.stringify(limitedTasks));
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche récente:", error);
    }
  }

  // Statistiques
  getInvoiceStats() {
    const invoices = this.getInvoices();

    const stats = {
      total: invoices.length,
      draft: invoices.filter((inv) => inv.status === "draft").length,
      sent: invoices.filter((inv) => inv.status === "sent").length,
      paid: invoices.filter((inv) => inv.status === "paid").length,
      overdue: invoices.filter((inv) => inv.status === "overdue").length,
      totalAmount: invoices.reduce((sum, inv) => {
        const amount = parseFloat(inv.amount.replace(/[^\d.-]/g, ""));
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0),
    };

    return stats;
  }

  // Utilitaires
  clearAllData(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem(this.INVOICES_KEY);
    localStorage.removeItem(this.RECENT_TASKS_KEY);
    localStorage.removeItem(this.CLIENTS_KEY);
  }

  // Nettoyer les tâches récentes orphelines (sans factures/clients correspondants)
  cleanupOrphanedTasks(): void {
    if (typeof window === "undefined") return;

    try {
      const tasks = this.getRecentTasks();
      const invoices = this.getInvoices();
      const clients = this.getClientsRaw();

      // Filtrer les tâches qui ont encore des données correspondantes
      const validTasks = tasks.filter((task) => {
        if (
          task.type === "invoice_created" ||
          task.type === "invoice_sent" ||
          task.type === "payment_received"
        ) {
          // Vérifier si la facture existe encore
          return invoices.some(
            (invoice) =>
              task.description.includes(invoice.number) ||
              task.description.includes(invoice.client)
          );
        }
        if (task.type === "client_added") {
          // Vérifier si le client existe encore
          return clients.some((client) =>
            task.description.includes(client.name)
          );
        }
        return false;
      });

      // Sauvegarder seulement les tâches valides
      localStorage.setItem(this.RECENT_TASKS_KEY, JSON.stringify(validTasks));
    } catch (error) {
      console.error("Erreur lors du nettoyage des tâches orphelines:", error);
    }
  }

  // Nettoyer les doublons de tâches récentes
  cleanupDuplicateTasks(): void {
    if (typeof window === "undefined") return;

    try {
      const tasks = this.getRecentTasks();
      const cleanedTasks: RecentTask[] = [];
      const seenInvoices = new Set<string>();
      const seenClients = new Set<string>();

      for (const task of tasks) {
        let shouldKeep = true;

        if (task.type === "invoice_created") {
          // Extraire le numéro de facture
          const invoiceNumberMatch = task.description.match(/Facture ([^\s]+)/);
          if (invoiceNumberMatch) {
            const invoiceNumber = invoiceNumberMatch[1];
            if (seenInvoices.has(invoiceNumber)) {
              shouldKeep = false; // Doublon détecté
            } else {
              seenInvoices.add(invoiceNumber);
            }
          }
        } else if (task.type === "client_added") {
          // Extraire le nom du client
          const clientNameMatch =
            task.description.match(/Client ([^]+) ajouté/);
          if (clientNameMatch) {
            const clientName = clientNameMatch[1];
            if (seenClients.has(clientName)) {
              shouldKeep = false; // Doublon détecté
            } else {
              seenClients.add(clientName);
            }
          }
        }

        if (shouldKeep) {
          cleanedTasks.push(task);
        }
      }

      // Sauvegarder les tâches nettoyées
      localStorage.setItem(this.RECENT_TASKS_KEY, JSON.stringify(cleanedTasks));

      const removedCount = tasks.length - cleanedTasks.length;
      if (removedCount > 0) {
        console.log(
          `🧹 Nettoyage des tâches récentes: ${removedCount} doublons supprimés`
        );
      }
    } catch (error) {
      console.error("Erreur lors du nettoyage des doublons:", error);
    }
  }

  // Initialiser le service (à appeler au démarrage de l'app)
  initialize(): void {
    if (typeof window === "undefined") return;

    // Nettoyer les doublons au démarrage
    this.cleanupDuplicateTasks();
    // Nettoyer les tâches orphelines au démarrage
    this.cleanupOrphanedTasks();
  }

  exportData(): string {
    const data = {
      invoices: this.getInvoices(),
      recentTasks: this.getRecentTasks(),
      exportDate: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (data.invoices && Array.isArray(data.invoices)) {
        localStorage.setItem(this.INVOICES_KEY, JSON.stringify(data.invoices));
      }

      if (data.recentTasks && Array.isArray(data.recentTasks)) {
        localStorage.setItem(
          this.RECENT_TASKS_KEY,
          JSON.stringify(data.recentTasks)
        );
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de l'importation des données:", error);
      return false;
    }
  }

  // === GESTION DES CLIENTS ===

  // Récupérer tous les clients
  getClients(): Client[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(this.CLIENTS_KEY);
      const clients = stored ? JSON.parse(stored) : [];

      // Calculer les statistiques pour chaque client
      return clients.map((client: Client) => ({
        ...client,
        ...this.calculateClientStats(client.id),
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      return [];
    }
  }

  // Sauvegarder un client
  saveClient(client: Client): void {
    if (typeof window === "undefined") return;

    try {
      const clients = this.getClientsRaw(); // Récupérer sans statistiques pour éviter les boucles
      const existingIndex = clients.findIndex((c) => c.id === client.id);
      const isNewClient = existingIndex < 0;

      const now = new Date().toISOString();

      if (existingIndex >= 0) {
        // Mettre à jour un client existant
        clients[existingIndex] = {
          ...client,
          updatedAt: now,
        };
      } else {
        // Ajouter un nouveau client
        clients.unshift({
          ...client,
          createdAt: client.createdAt || now,
          updatedAt: now,
        });

        // Ajouter une tâche récente SEULEMENT pour les nouveaux clients
        if (isNewClient) {
          this.addRecentTask({
            id: `task_${Date.now()}`,
            type: "client_added",
            title: "Nouveau client ajouté",
            description: `Client ${client.name} ajouté`,
            date: now,
            icon: "👤",
          });
        }
      }

      localStorage.setItem(this.CLIENTS_KEY, JSON.stringify(clients));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du client:", error);
    }
  }

  // Méthode pour mettre à jour le statut d'une facture sans créer de tâche récente
  updateInvoiceStatus(invoiceId: string, newStatus: Invoice["status"]): void {
    if (typeof window === "undefined") return;

    try {
      const invoices = this.getInvoices();
      const invoiceIndex = invoices.findIndex((inv) => inv.id === invoiceId);

      if (invoiceIndex >= 0) {
        const oldStatus = invoices[invoiceIndex].status;
        invoices[invoiceIndex].status = newStatus;

        localStorage.setItem(this.INVOICES_KEY, JSON.stringify(invoices));

        // Ajouter une tâche récente seulement pour certains changements de statut importants
        if (oldStatus !== newStatus) {
          if (newStatus === "paid") {
            this.addRecentTask({
              id: `task_${Date.now()}`,
              type: "payment_received",
              title: "Paiement reçu",
              description: `Facture ${invoices[invoiceIndex].number} payée`,
              date: new Date().toISOString(),
              icon: "💰",
            });
          } else if (newStatus === "sent" && oldStatus === "draft") {
            this.addRecentTask({
              id: `task_${Date.now()}`,
              type: "invoice_sent",
              title: "Facture envoyée",
              description: `Facture ${invoices[invoiceIndex].number} envoyée à ${invoices[invoiceIndex].client}`,
              date: new Date().toISOString(),
              icon: "📤",
            });
          }
        }
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut de la facture:",
        error
      );
    }
  }

  // Récupérer les clients sans statistiques (pour éviter les boucles)
  private getClientsRaw(): Client[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(this.CLIENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      return [];
    }
  }

  // Récupérer un client par ID
  getClientById(id: string): Client | null {
    try {
      const clients = this.getClients();
      return clients.find((client) => client.id === id) || null;
    } catch (error) {
      console.error("Erreur lors de la récupération du client:", error);
      return null;
    }
  }

  // Supprimer un client
  deleteClient(id: string): void {
    if (typeof window === "undefined") return;

    try {
      const clients = this.getClientsRaw();
      const filteredClients = clients.filter((client) => client.id !== id);
      localStorage.setItem(this.CLIENTS_KEY, JSON.stringify(filteredClients));
    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error);
    }
  }

  // Calculer les statistiques d'un client
  private calculateClientStats(clientId: string) {
    try {
      const invoices = this.getInvoices();
      const clientInvoices = invoices.filter(
        (invoice) =>
          invoice.fullData?.clientName === clientId ||
          invoice.client === clientId ||
          invoice.fullData?.clientId === clientId
      );

      const invoiceCount = clientInvoices.length;
      const totalAmount = clientInvoices.reduce((sum, invoice) => {
        const amount = parseFloat(invoice.amount.replace(/[^\d.-]/g, ""));
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);

      const lastInvoiceDate =
        clientInvoices.length > 0
          ? clientInvoices.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0].date
          : undefined;

      return {
        invoiceCount,
        totalAmount,
        lastInvoiceDate,
      };
    } catch (error) {
      console.error("Erreur lors du calcul des statistiques client:", error);
      return {
        invoiceCount: 0,
        totalAmount: 0,
        lastInvoiceDate: undefined,
      };
    }
  }

  // Rechercher des clients
  searchClients(query: string): Client[] {
    try {
      const clients = this.getClients();
      const searchTerm = query.toLowerCase().trim();

      if (!searchTerm) return clients;

      return clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm) ||
          client.email.toLowerCase().includes(searchTerm) ||
          (client.company &&
            client.company.toLowerCase().includes(searchTerm)) ||
          (client.siren && client.siren.includes(searchTerm)) ||
          (client.siret && client.siret.includes(searchTerm))
      );
    } catch (error) {
      console.error("Erreur lors de la recherche de clients:", error);
      return [];
    }
  }
}

// Instance singleton
export const storageService = new StorageService();

// Fonctions utilitaires
export const generateInvoiceNumber = (): string => {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-4);
  return `FACT-${year}-${timestamp}`;
};

// Générer un ID unique pour un client
export const generateClientId = (): string => {
  return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
