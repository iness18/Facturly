"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService, type LoginCredentials } from "@/services/auth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const credentials: LoginCredentials = {
        email,
        password,
        rememberMe,
      };

      const result = await authService.login(credentials);

      if (result.success && result.user) {
        // Connexion réussie - rediriger vers l'admin
        router.push("/admin");
      } else {
        setError(result.error || "Email ou mot de passe incorrect");
      }
    } catch (error) {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)",
        color: "#ffffff",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "40px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              background: "rgba(139, 92, 246, 0.2)",
              borderRadius: "50%",
              marginBottom: "16px",
            }}
          >
            <span style={{ fontSize: "24px" }}>🛡️</span>
          </div>
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              marginBottom: "8px",
              background:
                "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #ef4444 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Administration Facturly
          </h1>
          <p style={{ color: "#d1d5db", fontSize: "1rem" }}>
            Connectez-vous avec vos identifiants administrateur
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "24px",
                textAlign: "center",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Email Field */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#ffffff",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              Email administrateur
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@facturly.com"
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#ffffff",
                fontSize: "16px",
                outline: "none",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#8b5cf6";
                e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#ffffff",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              Mot de passe
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "14px 48px 14px 16px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "#ffffff",
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#8b5cf6";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(139, 92, 246, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#9ca3af",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "32px",
              gap: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                accentColor: "#8b5cf6",
                width: "16px",
                height: "16px",
              }}
            />
            <label style={{ color: "#d1d5db", fontSize: "14px" }}>
              Se souvenir de moi
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading
                ? "rgba(139, 92, 246, 0.5)"
                : "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
              color: "#ffffff",
              padding: "16px 32px",
              borderRadius: "12px",
              fontSize: "1.125rem",
              fontWeight: "600",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              marginBottom: "24px",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(139, 92, 246, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Demo Credentials */}
        <div
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "1.5rem", marginBottom: "12px" }}>💡</div>
          <h3
            style={{
              color: "#3b82f6",
              marginBottom: "8px",
              fontSize: "1.125rem",
              fontWeight: "600",
            }}
          >
            Identifiants de démonstration
          </h3>
          <p
            style={{
              color: "#d1d5db",
              fontSize: "14px",
              marginBottom: "12px",
            }}
          >
            Utilisez ces identifiants pour tester l'administration :
          </p>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              padding: "12px",
              borderRadius: "8px",
              fontFamily: "monospace",
              fontSize: "14px",
            }}
          >
            <div style={{ marginBottom: "4px" }}>
              <strong>Email:</strong> admin@facturly.com
            </div>
            <div>
              <strong>Mot de passe:</strong> Admin123!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
