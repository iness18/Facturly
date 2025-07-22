// Service d'authentification avec gestion des sessions
import React from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
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
      // Simulation d'appel API (à remplacer par un vrai appel)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Vérification des identifiants de démo
      if (
        credentials.email === "demo@facturly.com" &&
        credentials.password === "demo123"
      ) {
        const user: User = {
          id: "demo-user-id",
          email: "demo@facturly.com",
          name: "Utilisateur Démo",
          role: "USER",
        };

        const token = "demo-jwt-token-" + Date.now();

        // Sauvegarder la session
        this.saveSession(user, token, credentials.rememberMe);

        return {
          success: true,
          user,
          token,
        };
      }

      // Vérification des identifiants admin
      if (
        credentials.email === "admin@facturly.com" &&
        credentials.password === "Admin123!"
      ) {
        const user: User = {
          id: "admin-user-id",
          email: "admin@facturly.com",
          name: "Administrateur Facturly",
          role: "ADMIN",
        };

        const token = "admin-jwt-token-" + Date.now();

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
      return {
        success: false,
        error: "Erreur de connexion",
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

    // Nettoyer toutes les données de session
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REMEMBER_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);

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
      // Session valide, on peut continuer
      console.log("Session utilisateur restaurée:", user.email);
    } else {
      // Pas de session valide, nettoyer les données corrompues
      this.logout();
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
