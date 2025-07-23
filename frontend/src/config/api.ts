// Configuration de l'API backend
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  ENDPOINTS: {
    ADMIN: {
      DASHBOARD: "/admin/dashboard",
      USERS: "/admin/users",
      PACKS: "/admin/packs",
      PAYMENTS: "/admin/payments",
      MARKETING: "/admin/marketing",
      TICKETS: "/admin/tickets",
      SETTINGS: "/admin/settings",
    },
  },
};

// Helper function pour construire les URLs complètes
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
