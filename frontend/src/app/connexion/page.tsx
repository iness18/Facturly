"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import { authService, type LoginCredentials } from "@/services/auth";

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function ConnexionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Validation mot de passe
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Effacer l'erreur du champ modifié
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const credentials: LoginCredentials = {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      };

      const result = await authService.login(credentials);

      if (result.success && result.user) {
        // Connexion réussie - rediriger selon le rôle
        if (result.user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        // Identifiants incorrects
        setErrors({
          general: result.error || "Email ou mot de passe incorrect",
        });
      }
    } catch (error) {
      setErrors({
        general: "Une erreur s'est produite lors de la connexion",
      });
    } finally {
      setIsSubmitting(false);
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
      }}
    >
      {/* Navigation */}
      <Navigation currentPage="/connexion" />

      {/* Hero Section */}
      <section
        style={{
          paddingTop: "128px",
          paddingBottom: "40px",
          padding: "128px 16px 40px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 16px",
              borderRadius: "50px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              marginBottom: "32px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "#ffffff",
              }}
            >
              ⚡ Connexion • Sécurisée • Rapide
            </span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: "clamp(2.5rem, 8vw, 3.5rem)",
              fontWeight: "bold",
              marginBottom: "clamp(16px, 3vw, 24px)",
              lineHeight: "1.1",
            }}
          >
            <span style={{ color: "#ffffff" }}>Bon retour sur</span>
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #ef4444 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Facturly
            </span>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              color: "#d1d5db",
              marginBottom: "clamp(32px, 5vw, 48px)",
              lineHeight: "1.6",
            }}
          >
            Connectez-vous à votre compte pour accéder à votre tableau de bord
            et gérer vos factures.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section
        style={{
          padding: "40px 16px 80px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "clamp(24px, 5vw, 40px)",
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* Erreur générale */}
              {errors.general && (
                <div
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "24px",
                    textAlign: "center",
                    color: "#ef4444",
                  }}
                >
                  ❌ {errors.general}
                </div>
              )}

              {/* Email */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#ffffff",
                    fontWeight: "500",
                  }}
                >
                  Adresse email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre@email.com"
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: "8px",
                    border: `1px solid ${
                      errors.email ? "#ef4444" : "rgba(255, 255, 255, 0.2)"
                    }`,
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "#ffffff",
                    fontSize: "16px",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    if (!errors.email) {
                      e.target.style.borderColor = "#8b5cf6";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(139, 92, 246, 0.1)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.email) {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                />
                {errors.email && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: "14px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Mot de passe */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#ffffff",
                    fontWeight: "500",
                  }}
                >
                  Mot de passe
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Votre mot de passe"
                    style={{
                      width: "100%",
                      padding: "14px 48px 14px 16px",
                      borderRadius: "8px",
                      border: `1px solid ${
                        errors.password ? "#ef4444" : "rgba(255, 255, 255, 0.2)"
                      }`,
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "#ffffff",
                      fontSize: "16px",
                      outline: "none",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      if (!errors.password) {
                        e.target.style.borderColor = "#8b5cf6";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(139, 92, 246, 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.password) {
                        e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                        e.target.style.boxShadow = "none";
                      }
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
                {errors.password && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: "14px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Options */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "32px",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    style={{
                      accentColor: "#8b5cf6",
                    }}
                  />
                  <label style={{ color: "#d1d5db", fontSize: "14px" }}>
                    Se souvenir de moi
                  </label>
                </div>

                <Link
                  href="#"
                  style={{
                    color: "#8b5cf6",
                    textDecoration: "underline",
                    fontSize: "14px",
                  }}
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  background: isSubmitting
                    ? "rgba(139, 92, 246, 0.5)"
                    : "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                  color: "#ffffff",
                  padding: "16px 32px",
                  borderRadius: "12px",
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginBottom: "24px",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(139, 92, 246, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                {isSubmitting ? "Connexion en cours..." : "Se connecter"}
                {!isSubmitting && " →"}
              </button>

              {/* Lien vers inscription */}
              <div
                style={{
                  textAlign: "center",
                  paddingTop: "24px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <p style={{ color: "#9ca3af", fontSize: "14px" }}>
                  Pas encore de compte ?{" "}
                  <Link
                    href="/inscription"
                    style={{
                      color: "#8b5cf6",
                      textDecoration: "underline",
                      fontWeight: "500",
                    }}
                  >
                    Créer un compte gratuitement
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Liens utiles */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              marginTop: "32px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/"
              style={{
                color: "#9ca3af",
                textDecoration: "underline",
                fontSize: "14px",
              }}
            >
              ← Retour à l'accueil
            </Link>
            <Link
              href="/contact"
              style={{
                color: "#9ca3af",
                textDecoration: "underline",
                fontSize: "14px",
              }}
            >
              Besoin d'aide ?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
