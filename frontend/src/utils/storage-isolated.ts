// Service de stockage isolé par utilisateur pour Facturly
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

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address: string;
  postalCode?: string;
  city?: string;
  country?: string;
  siren?: string;
  siret?: string;
  tvaNumber?: string;
  legalForm?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
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

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  isActive: boolean;
}

class IsolatedStorageService {
  private currentUser: UserSession | null = null;

  // Clés de base (seront préfixées par l'ID utilisateur)
  private readonly BASE_KEYS = {
    invoices: "invoices",
    tasks: "recent_tasks",
    clients: "clients",
    session: "facturly_current_session", // Clé globale pour la session
    global_prefix: "facturly_user_", // Préfixe pour les données utilisateur
  };

  // === GESTION DE SESSION ===

  setCurrentUser(user: UserSession): void {
    if (typeof window === "undefined") return;

    this.currentUser = user;
    localStorage.setItem(this.BASE_KEYS.session, JSON.stringify(user));
    console.log(
      `🔐 Session utilisateur définie pour: ${user.email} (ID: ${user.userId})`
    );
  }

  getCurrentUser(): UserSession | null {
    if (typeof window === "undefined") return null;

    if (!this.currentUser) {
      try {
        const stored = localStorage.getItem(this.BASE_KEYS.session);
        if (stored) {
          this.currentUser = JSON.parse(stored);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la session:", error);
      }
    }

    return this.currentUser;
  }

  logout(): void {
    if (typeof window === "undefined") return;

    console.log(`🚪 Déconnexion de l'utilisateur: ${this.currentUser?.email}`);
    this.currentUser = null;
    localStorage.removeItem(this.BASE_KEYS.session);
  }

  // === GESTION DES CLÉS ISOLÉES ===

  private getUserKey(baseKey: string): string {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error(
        "Aucun utilisateur connecté - impossible d'accéder aux données"
      );
    }
    return `${this.BASE_KEYS.global_prefix}${user.userId}_${baseKey}`;
  }

  private getStorageData<T>(baseKey: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue;

    try {
      const key = this.getUserKey(baseKey);
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${baseKey}:`, error);
      return defaultValue;
    }
  }

  private setStorageData<T>(baseKey: string, data: T): void {
    if (typeof window === "undefined") return;

    try {
      const key = this.getUserKey(baseKey);
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${baseKey}:`, error);
    }
  }

  // === GESTION DES FACTURES ===

  getInvoices(): Invoice[] {
    return this.getStorageData(this.BASE_KEYS.invoices, []);
  }

  saveInvoice(invoice: Invoice): void {
    try {
      const invoices = this.getInvoices();
      const existingIndex = invoices.findIndex((inv) => inv.id === invoice.id);
      const isNewInvoice = existingIndex < 0;

      if (existingIndex >= 0) {
        invoices[existingIndex] = invoice;
      } else {
        invoices.unshift(invoice);
      }

      this.setStorageData(this.BASE_KEYS.invoices, invoices);

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
    try {
      const invoices = this.getInvoices();
      const filteredInvoices = invoices.filter((inv) => inv.id !== invoiceId);
      this.setStorageData(this.BASE_KEYS.invoices, filteredInvoices);
    } catch (error) {
      console.error("Erreur lors de la suppression de la facture:", error);
    }
  }

  getInvoiceById(invoiceId: string): Invoice | null {
    const invoices = this.getInvoices();
    return invoices.find((inv) => inv.id === invoiceId) || null;
  }

  // === GESTION DES TÂCHES RÉCENTES ===

  getRecentTasks(): RecentTask[] {
    const tasks = this.getStorageData(this.BASE_KEYS.tasks, []);
    return tasks.slice(0, 10); // Retourner les 10 plus récentes
  }

  addRecentTask(task: RecentTask): void {
    try {
      const tasks = this.getRecentTasks();

      // Logique de déduplication
      let shouldAdd = true;

      if (task.type === "invoice_created") {
        const invoiceNumberMatch = task.description.match(/Facture ([^\s]+)/);
        if (invoiceNumberMatch) {
          const invoiceNumber = invoiceNumberMatch[1];
          const existingTaskIndex = tasks.findIndex(
            (existingTask) =>
              existingTask.type === "invoice_created" &&
              existingTask.description.includes(`Facture ${invoiceNumber}`)
          );

          if (existingTaskIndex >= 0) {
            tasks.splice(existingTaskIndex, 1);
          }
        }
      } else if (task.type === "client_added") {
        const clientNameMatch = task.description.match(/Client ([^]+) ajouté/);
        if (clientNameMatch) {
          const clientName = clientNameMatch[1];
          const existingTaskIndex = tasks.findIndex(
            (existingTask) =>
              existingTask.type === "client_added" &&
              existingTask.description.includes(`Client ${clientName}`)
          );

          if (existingTaskIndex >= 0) {
            shouldAdd = false;
          }
        }
      }

      if (shouldAdd) {
        tasks.unshift(task);
      }

      // Garder seulement les 20 tâches les plus récentes
      const limitedTasks = tasks.slice(0, 20);
      this.setStorageData(this.BASE_KEYS.tasks, limitedTasks);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche récente:", error);
    }
  }

  // === GESTION DES CLIENTS ===

  getClients(): Client[] {
    const clients = this.getStorageData(this.BASE_KEYS.clients, []);

    // Calculer les statistiques pour chaque client
    return clients.map((client: Client) => ({
      ...client,
      ...this.calculateClientStats(client.id),
    }));
  }

  saveClient(client: Client): void {
    try {
      const clients = this.getClientsRaw();
      const existingIndex = clients.findIndex((c) => c.id === client.id);
      const isNewClient = existingIndex < 0;

      const now = new Date().toISOString();

      if (existingIndex >= 0) {
        clients[existingIndex] = {
          ...client,
          updatedAt: now,
        };
      } else {
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

      this.setStorageData(this.BASE_KEYS.clients, clients);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du client:", error);
    }
  }

  deleteClient(id: string): void {
    try {
      const clients = this.getClientsRaw();
      const filteredClients = clients.filter((client) => client.id !== id);
      this.setStorageData(this.BASE_KEYS.clients, filteredClients);
    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error);
    }
  }

  getClientById(id: string): Client | null {
    try {
      const clients = this.getClients();
      return clients.find((client) => client.id === id) || null;
    } catch (error) {
      console.error("Erreur lors de la récupération du client:", error);
      return null;
    }
  }

  private getClientsRaw(): Client[] {
    return this.getStorageData(this.BASE_KEYS.clients, []);
  }

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

  // === STATISTIQUES ===

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

  // === NETTOYAGE ET MAINTENANCE ===

  clearCurrentUserData(): void {
    if (typeof window === "undefined") return;

    const user = this.getCurrentUser();
    if (!user) return;

    try {
      const keysToRemove = [
        this.getUserKey(this.BASE_KEYS.invoices),
        this.getUserKey(this.BASE_KEYS.tasks),
        this.getUserKey(this.BASE_KEYS.clients),
      ];

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });

      console.log(`🧹 Données supprimées pour l'utilisateur: ${user.email}`);
    } catch (error) {
      console.error("Erreur lors du nettoyage des données utilisateur:", error);
    }
  }

  clearAllUsersData(): void {
    if (typeof window === "undefined") return;

    try {
      const keysToRemove: string[] = [];

      // Parcourir toutes les clés localStorage pour trouver celles de Facturly
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.BASE_KEYS.global_prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });

      // Supprimer aussi la session
      localStorage.removeItem(this.BASE_KEYS.session);

      console.log(
        `🧹 Toutes les données Facturly supprimées (${keysToRemove.length} clés)`
      );
    } catch (error) {
      console.error("Erreur lors du nettoyage complet:", error);
    }
  }

  // === MIGRATION DEPUIS L'ANCIEN SYSTÈME ===

  migrateFromOldStorage(): boolean {
    if (typeof window === "undefined") return false;

    const user = this.getCurrentUser();
    if (!user) return false;

    try {
      // Clés de l'ancien système
      const oldKeys = {
        invoices: "facturly_invoices",
        tasks: "facturly_recent_tasks",
        clients: "facturly_clients",
      };

      let migrated = false;

      // Migrer les factures
      const oldInvoices = localStorage.getItem(oldKeys.invoices);
      if (oldInvoices && this.getInvoices().length === 0) {
        this.setStorageData(this.BASE_KEYS.invoices, JSON.parse(oldInvoices));
        localStorage.removeItem(oldKeys.invoices);
        migrated = true;
      }

      // Migrer les tâches
      const oldTasks = localStorage.getItem(oldKeys.tasks);
      if (oldTasks && this.getRecentTasks().length === 0) {
        this.setStorageData(this.BASE_KEYS.tasks, JSON.parse(oldTasks));
        localStorage.removeItem(oldKeys.tasks);
        migrated = true;
      }

      // Migrer les clients
      const oldClients = localStorage.getItem(oldKeys.clients);
      if (oldClients && this.getClientsRaw().length === 0) {
        this.setStorageData(this.BASE_KEYS.clients, JSON.parse(oldClients));
        localStorage.removeItem(oldKeys.clients);
        migrated = true;
      }

      if (migrated) {
        console.log(`📦 Migration des données vers le compte: ${user.email}`);
      }

      return migrated;
    } catch (error) {
      console.error("Erreur lors de la migration:", error);
      return false;
    }
  }

  // === UTILITAIRES ===

  updateInvoiceStatus(invoiceId: string, newStatus: Invoice["status"]): void {
    try {
      const invoices = this.getInvoices();
      const invoiceIndex = invoices.findIndex((inv) => inv.id === invoiceId);

      if (invoiceIndex >= 0) {
        const oldStatus = invoices[invoiceIndex].status;
        invoices[invoiceIndex].status = newStatus;

        this.setStorageData(this.BASE_KEYS.invoices, invoices);

        // Ajouter une tâche récente pour certains changements importants
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
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  }

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

  exportData(): string {
    const user = this.getCurrentUser();
    const data = {
      user: user,
      invoices: this.getInvoices(),
      recentTasks: this.getRecentTasks(),
      clients: this.getClientsRaw(),
      exportDate: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }
}

// Instance singleton
export const isolatedStorageService = new IsolatedStorageService();

// Fonctions utilitaires (inchangées)
export const generateInvoiceNumber = (): string => {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-4);
  return `FACT-${year}-${timestamp}`;
};

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
