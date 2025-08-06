// Service d'authentification avec gestion des sessions
import React from "react";
import { apiService } from "./api";
import { isolatedStorageService } from "../utils/storage-isolated";

interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  // Informations d'entreprise
  company?: string;
  companyAddress?: string;
  companyPostalCode?: string;
  companyCity?: string;
  companySiret?: string;
  companyLegalForm?: string;
  phone?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

class AuthService {
  private readonly TOKEN_KEY = "facturly_token";
  private readonly USER_KEY = "facturly_user";
  private readonly REMEMBER_KEY = "facturly_remember";

  // Connexion utilisateur
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Appel à l'API backend pour la connexion
      const response = await apiService.login({
        email: credentials.email,
        password: credentials.password,
      });

      if (response.error) {
        return {
          success: false,
          error: response.error,
        };
      }

      if (response.data && response.data.success) {
        const user: User = {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
          company: response.data.user.company,
        };

        const token = response.data.token; // Utiliser le vrai JWT du backend

        // Sauvegarder la session
        this.saveSession(user, token, credentials.rememberMe);

        return {
          success: true,
          user,
          token,
        };
      }

      return {
        success: false,
        error: "Email ou mot de passe incorrect",
      };
    } catch (error) {
      let errorMessage = "Erreur de connexion";

      if (error instanceof Error) {
        if (error.message.includes("Impossible de se connecter")) {
          errorMessage =
            "Impossible de se connecter au serveur. Vérifiez que le serveur est démarré.";
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Échec de la connexion au serveur. Vérifiez votre connexion.";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Inscription utilisateur
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    company: string;
    companyAddress: string;
    companyPostalCode: string;
    companyCity: string;
    companySiret: string;
    companyLegalForm: string;
    phone?: string;
  }): Promise<AuthResponse> {
    try {
      // Appel à l'API backend pour l'inscription
      const response = await apiService.register({
        email: userData.email,
        password: userData.password,
        name: `${userData.firstName} ${userData.lastName}`,
        company: userData.company,
      });

      if (response.error) {
        return {
          success: false,
          error: response.error,
        };
      }

      if (response.data && response.data.success) {
        const user: User = {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
          company: response.data.user.company,
          // Informations d'entreprise (stockées côté frontend pour l'instant)
          companyAddress: userData.companyAddress,
          companyPostalCode: userData.companyPostalCode,
          companyCity: userData.companyCity,
          companySiret: userData.companySiret,
          companyLegalForm: userData.companyLegalForm,
          phone: userData.phone,
        };

        const token = response.data.token; // Utiliser le vrai JWT du backend

        // Sauvegarder la session (par défaut, on se souvient de l'utilisateur après inscription)
        this.saveSession(user, token, true);

        return {
          success: true,
          user,
          token,
        };
      }

      return {
        success: false,
        error: "Erreur lors de l'inscription",
      };
    } catch (error) {
      let errorMessage = "Erreur lors de l'inscription";

      if (error instanceof Error) {
        if (error.message.includes("Impossible de se connecter")) {
          errorMessage =
            "Impossible de se connecter au serveur. Vérifiez que le serveur est démarré.";
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Échec de la connexion au serveur. Vérifiez votre connexion.";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Sauvegarder la session
  private saveSession(user: User, token: string, rememberMe: boolean): void {
    if (typeof window === "undefined") return;

    const storage = rememberMe ? localStorage : sessionStorage;

    // Sauvegarder les données utilisateur
    storage.setItem(this.USER_KEY, JSON.stringify(user));
    storage.setItem(this.TOKEN_KEY, token);

    // Marquer si l'utilisateur veut être "remembered"
    if (rememberMe) {
      localStorage.setItem(this.REMEMBER_KEY, "true");
    } else {
      localStorage.removeItem(this.REMEMBER_KEY);
    }

    // Nettoyer l'autre storage si nécessaire
    const otherStorage = rememberMe ? sessionStorage : localStorage;
    otherStorage.removeItem(this.USER_KEY);
    otherStorage.removeItem(this.TOKEN_KEY);

    // 🔐 Configurer le stockage isolé pour cet utilisateur
    this.setupIsolatedStorage(user);
  }

  // 🔐 Configurer le stockage isolé pour un utilisateur
  private setupIsolatedStorage(user: User): void {
    try {
      // Définir l'utilisateur actuel dans le service de stockage isolé
      isolatedStorageService.setCurrentUser({
        userId: user.id,
        email: user.email,
        name: user.name,
        isActive: true,
      });

      // Tenter une migration depuis l'ancien système si nécessaire
      const migrated = isolatedStorageService.migrateFromOldStorage();
      if (migrated) {
        console.log("📦 Migration des données effectuée pour:", user.email);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la configuration du stockage isolé:",
        error
      );
    }
  }

  // Récupérer l'utilisateur connecté
  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;

    try {
      // Vérifier d'abord localStorage (remember me)
      let userStr = localStorage.getItem(this.USER_KEY);
      if (userStr) {
        return JSON.parse(userStr);
      }

      // Puis sessionStorage (session temporaire)
      userStr = sessionStorage.getItem(this.USER_KEY);
      if (userStr) {
        return JSON.parse(userStr);
      }

      return null;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      return null;
    }
  }

  // Récupérer le token
  getToken(): string | null {
    if (typeof window === "undefined") return null;

    // Vérifier localStorage puis sessionStorage
    return (
      localStorage.getItem(this.TOKEN_KEY) ||
      sessionStorage.getItem(this.TOKEN_KEY)
    );
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null && this.getToken() !== null;
  }

  // Vérifier si l'utilisateur est admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === "ADMIN";
  }

  // Déconnexion
  logout(): void {
    if (typeof window === "undefined") return;

    // 🧹 Nettoyer la session du stockage isolé
    isolatedStorageService.logout();

    // Nettoyer toutes les données de session
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REMEMBER_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);

    console.log("🚪 Déconnexion complète effectuée");

    // Rediriger vers la page de connexion
    window.location.href = "/connexion";
  }

  // Vérifier si "Se souvenir de moi" était activé
  wasRemembered(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(this.REMEMBER_KEY) === "true";
  }

  // Rafraîchir le token (simulation)
  async refreshToken(): Promise<boolean> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return false;

      // Simulation d'appel API pour rafraîchir le token
      const newToken = "refreshed-token-" + Date.now();
      const wasRemembered = this.wasRemembered();

      this.saveSession(currentUser, newToken, wasRemembered);
      return true;
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du token:", error);
      return false;
    }
  }

  // Initialiser l'authentification au démarrage de l'app
  initAuth(): void {
    if (typeof window === "undefined") return;

    // Vérifier si l'utilisateur a une session valide
    const user = this.getCurrentUser();
    const token = this.getToken();

    if (user && token) {
      // Session valide, restaurer le stockage isolé
      this.setupIsolatedStorage(user);
      console.log("🔄 Session utilisateur restaurée:", user.email);
    } else {
      // Pas de session valide, nettoyer les données corrompues
      this.logout();
    }
  }

  // 🧹 Nettoyer les données de l'utilisateur actuel
  clearCurrentUserData(): void {
    isolatedStorageService.clearCurrentUserData();
  }

  // 🧹 Nettoyer toutes les données Facturly
  clearAllData(): void {
    isolatedStorageService.clearAllUsersData();
    this.logout();
  }

  // 🔄 Restaurer la session (méthode publique)
  restoreSession(): void {
    const user = this.getCurrentUser();
    if (user && this.isAuthenticated()) {
      this.setupIsolatedStorage(user);
      console.log("🔄 Session restaurée pour:", user.email);
    }
  }
}

// Instance singleton
export const authService = new AuthService();

// Hook React pour utiliser l'authentification
export function useAuth() {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Initialiser l'auth au montage
    authService.initAuth();
    setUser(authService.getCurrentUser());
    setIsLoading(false);

    // Écouter les changements de storage (multi-onglets)
    const handleStorageChange = () => {
      setUser(authService.getCurrentUser());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const result = await authService.login(credentials);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: authService.isAuthenticated(),
    isAdmin: authService.isAdmin(),
    login,
    logout,
  };
}

// Types exportés
export type { User, LoginCredentials, AuthResponse };
