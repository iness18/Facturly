// Service API pour communiquer avec le backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error("Erreur API:", error);

      // Traduire les erreurs de fetch en français
      let errorMessage = "Une erreur est survenue";

      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Impossible de se connecter au serveur. Vérifiez votre connexion.";
        } else if (error.message.includes("NetworkError")) {
          errorMessage = "Erreur de réseau. Vérifiez votre connexion internet.";
        } else if (error.message.includes("HTTP error")) {
          errorMessage = "Erreur du serveur. Veuillez réessayer plus tard.";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        error: errorMessage,
      };
    }
  }

  // === GESTION DES FACTURES ===

  async getInvoices() {
    return this.request<any[]>("/invoices");
  }

  async getInvoiceById(id: string) {
    return this.request<any>(`/invoices/${id}`);
  }

  async createInvoice(invoiceData: any) {
    return this.request<any>("/invoices", {
      method: "POST",
      body: JSON.stringify(invoiceData),
    });
  }

  async updateInvoice(id: string, invoiceData: any) {
    return this.request<any>(`/invoices/${id}`, {
      method: "PUT",
      body: JSON.stringify(invoiceData),
    });
  }

  async deleteInvoice(id: string) {
    return this.request<void>(`/invoices/${id}`, {
      method: "DELETE",
    });
  }

  // === GESTION DES CLIENTS ===

  async getClients() {
    return this.request<any[]>("/clients");
  }

  async getClientById(id: string) {
    return this.request<any>(`/clients/${id}`);
  }

  async createClient(clientData: any) {
    return this.request<any>("/clients", {
      method: "POST",
      body: JSON.stringify(clientData),
    });
  }

  async updateClient(id: string, clientData: any) {
    return this.request<any>(`/clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(clientData),
    });
  }

  async deleteClient(id: string) {
    return this.request<void>(`/clients/${id}`, {
      method: "DELETE",
    });
  }

  // === GESTION DES UTILISATEURS ===

  async getCurrentUser() {
    return this.request<any>("/users/profile");
  }

  async updateProfile(userData: any) {
    return this.request<any>("/users/profile", {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  }

  // === AUTHENTIFICATION ===

  async register(userData: {
    email: string;
    password: string;
    name: string;
    company?: string;
  }) {
    return this.request<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  // === ADMINISTRATION ===

  async getAdminStats() {
    return this.request<any>("/admin/stats");
  }

  async getAllUsers() {
    return this.request<any[]>("/admin/users");
  }

  async getAllClients() {
    return this.request<any[]>("/admin/clients");
  }

  async getAllInvoices() {
    return this.request<any[]>("/admin/invoices");
  }

  async toggleUserStatus(userId: string) {
    return this.request<any>(`/admin/users/${userId}/toggle-status`, {
      method: "PATCH",
    });
  }

  async promoteToAdmin(userId: string) {
    return this.request<any>(`/admin/users/${userId}/promote`, {
      method: "PATCH",
    });
  }

  async createAdminUser(adminData: {
    email: string;
    password: string;
    name: string;
  }) {
    return this.request<any>("/admin/create-admin", {
      method: "POST",
      body: JSON.stringify(adminData),
    });
  }

  async checkAdminStatus() {
    return this.request<{ isAdmin: boolean }>("/admin/check-admin");
  }
}

// Instance singleton
export const apiService = new ApiService();

// Types pour les données
export interface Invoice {
  id: string;
  invoiceNumber: string;
  title?: string;
  description?: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  clientId: string;
  client: {
    id: string;
    name: string;
    email: string;
  };
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  invoiceId: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  siret?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
