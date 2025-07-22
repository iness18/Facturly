"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectTo = "/connexion",
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Initialiser l'auth
      authService.initAuth();

      const isAuthenticated = authService.isAuthenticated();
      const isAdmin = authService.isAdmin();

      if (!isAuthenticated) {
        // Pas connecté, rediriger vers la connexion
        router.push(redirectTo);
        return;
      }

      if (requireAdmin && !isAdmin) {
        // Connecté mais pas admin, rediriger vers le dashboard
        router.push("/dashboard");
        return;
      }

      // Autorisé
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, requireAdmin, redirectTo]);

  // Écran de chargement
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "3px solid rgba(139, 92, 246, 0.3)",
              borderTop: "3px solid #8b5cf6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          />
          <p style={{ fontSize: "16px", color: "#d1d5db" }}>
            Vérification de l'authentification...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // Si pas autorisé, ne rien afficher (redirection en cours)
  if (!isAuthorized) {
    return null;
  }

  // Autorisé, afficher le contenu
  return <>{children}</>;
}
