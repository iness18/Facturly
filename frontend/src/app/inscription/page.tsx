"use client";

import { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import { authService } from "@/services/auth";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string;
  phone: string;
  acceptTerms: boolean;
  acceptNewsletter: boolean;
  // Nouvelles informations d'entreprise
  companyAddress: string;
  companyPostalCode: string;
  companyCity: string;
  companySiret: string;
  companyLegalForm: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  company?: string;
  companyAddress?: string;
  companyPostalCode?: string;
  companyCity?: string;
  companySiret?: string;
}

export default function InscriptionPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    phone: "",
    acceptTerms: false,
    acceptNewsletter: false,
    // Nouvelles informations d'entreprise
    companyAddress: "",
    companyPostalCode: "",
    companyCity: "",
    companySiret: "",
    companyLegalForm: "Micro-entrepreneur",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validation prénom
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "Le prénom doit contenir au moins 2 caractères";
    }

    // Validation nom
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Le nom doit contenir au moins 2 caractères";
    }

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
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre";
    }

    // Validation confirmation mot de passe
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "La confirmation du mot de passe est requise";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    // Validation entreprise
    if (!formData.company.trim()) {
      newErrors.company = "Le nom de l'entreprise est requis";
    }

    // Validation adresse entreprise
    if (!formData.companyAddress.trim()) {
      newErrors.companyAddress = "L'adresse de l'entreprise est requise";
    }

    // Validation code postal
    if (!formData.companyPostalCode.trim()) {
      newErrors.companyPostalCode = "Le code postal est requis";
    } else if (!/^\d{5}$/.test(formData.companyPostalCode)) {
      newErrors.companyPostalCode = "Le code postal doit contenir 5 chiffres";
    }

    // Validation ville
    if (!formData.companyCity.trim()) {
      newErrors.companyCity = "La ville est requise";
    }

    // Validation SIRET
    if (!formData.companySiret.trim()) {
      newErrors.companySiret = "Le SIRET est requis";
    } else if (!/^\d{14}$/.test(formData.companySiret)) {
      newErrors.companySiret = "Le SIRET doit contenir 14 chiffres";
    }

    // Validation conditions d'utilisation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms =
        "Vous devez accepter les conditions d'utilisation";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = "checked" in e.target ? e.target.checked : false;

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

    try {
      // Appel au service d'authentification pour l'inscription
      const result = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        company: formData.company,
        companyAddress: formData.companyAddress,
        companyPostalCode: formData.companyPostalCode,
        companyCity: formData.companyCity,
        companySiret: formData.companySiret,
        companyLegalForm: formData.companyLegalForm,
        phone: formData.phone,
      });

      if (result.success) {
        setSubmitStatus("success");

        // Redirection vers le dashboard après 2 secondes
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (
    password: string
  ): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: "Faible", color: "#ef4444" };
    if (strength <= 3) return { strength, label: "Moyen", color: "#f97316" };
    if (strength <= 4) return { strength, label: "Fort", color: "#10b981" };
    return { strength, label: "Très fort", color: "#10b981" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
      <Navigation currentPage="/inscription" />

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
            maxWidth: "600px",
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
              🚀 Inscription • Gratuite • Instantanée
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
            <span style={{ color: "#ffffff" }}>Rejoignez</span>
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
            Créez votre compte gratuitement et commencez à générer des factures
            professionnelles en quelques minutes.
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
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {submitStatus === "success" && (
            <div
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "32px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "16px" }}>🎉</div>
              <h3
                style={{
                  color: "#10b981",
                  marginBottom: "8px",
                  fontSize: "1.25rem",
                }}
              >
                Inscription réussie !
              </h3>
              <p style={{ color: "#d1d5db" }}>
                Redirection vers votre tableau de bord...
              </p>
            </div>
          )}

          {submitStatus === "error" && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "32px",
                textAlign: "center",
                color: "#ef4444",
              }}
            >
              ❌ Une erreur s'est produite lors de l'inscription. Veuillez
              réessayer.
            </div>
          )}

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
              {/* Nom et Prénom */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "20px",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#ffffff",
                      fontWeight: "500",
                    }}
                  >
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: `1px solid ${
                        errors.firstName
                          ? "#ef4444"
                          : "rgba(255, 255, 255, 0.2)"
                      }`,
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "#ffffff",
                      fontSize: "16px",
                      outline: "none",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      if (!errors.firstName) {
                        e.target.style.borderColor = "#8b5cf6";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(139, 92, 246, 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.firstName) {
                        e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                        e.target.style.boxShadow = "none";
                      }
                    }}
                  />
                  {errors.firstName && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "14px",
                        marginTop: "4px",
                      }}
                    >
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#ffffff",
                      fontWeight: "500",
                    }}
                  >
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: `1px solid ${
                        errors.lastName ? "#ef4444" : "rgba(255, 255, 255, 0.2)"
                      }`,
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "#ffffff",
                      fontSize: "16px",
                      outline: "none",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      if (!errors.lastName) {
                        e.target.style.borderColor = "#8b5cf6";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(139, 92, 246, 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.lastName) {
                        e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                        e.target.style.boxShadow = "none";
                      }
                    }}
                  />
                  {errors.lastName && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "14px",
                        marginTop: "4px",
                      }}
                    >
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

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
                  Adresse email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
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
                  Mot de passe *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px 48px 12px 16px",
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

                {/* Indicateur de force du mot de passe */}
                {formData.password && (
                  <div style={{ marginTop: "8px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: "4px",
                          background: "rgba(255, 255, 255, 0.1)",
                          borderRadius: "2px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${(passwordStrength.strength / 5) * 100}%`,
                            height: "100%",
                            background: passwordStrength.color,
                            transition: "all 0.3s ease",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "12px",
                          color: passwordStrength.color,
                          fontWeight: "500",
                        }}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}

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

              {/* Confirmation mot de passe */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#ffffff",
                    fontWeight: "500",
                  }}
                >
                  Confirmer le mot de passe *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px 48px 12px 16px",
                      borderRadius: "8px",
                      border: `1px solid ${
                        errors.confirmPassword
                          ? "#ef4444"
                          : "rgba(255, 255, 255, 0.2)"
                      }`,
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "#ffffff",
                      fontSize: "16px",
                      outline: "none",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      if (!errors.confirmPassword) {
                        e.target.style.borderColor = "#8b5cf6";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(139, 92, 246, 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.confirmPassword) {
                        e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                        e.target.style.boxShadow = "none";
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: "14px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Informations entreprise */}
              <div style={{ marginBottom: "32px" }}>
                <h3
                  style={{
                    color: "#ffffff",
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  🏢 Informations de votre entreprise
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#ffffff",
                        fontWeight: "500",
                      }}
                    >
                      Nom de l'entreprise *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: `1px solid ${
                          errors.company
                            ? "#ef4444"
                            : "rgba(255, 255, 255, 0.2)"
                        }`,
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "#ffffff",
                        fontSize: "16px",
                        outline: "none",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => {
                        if (!errors.company) {
                          e.target.style.borderColor = "#8b5cf6";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(139, 92, 246, 0.1)";
                        }
                      }}
                      onBlur={(e) => {
                        if (!errors.company) {
                          e.target.style.borderColor =
                            "rgba(255, 255, 255, 0.2)";
                          e.target.style.boxShadow = "none";
                        }
                      }}
                    />
                    {errors.company && (
                      <p
                        style={{
                          color: "#ef4444",
                          fontSize: "14px",
                          marginTop: "4px",
                        }}
                      >
                        {errors.company}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#ffffff",
                        fontWeight: "500",
                      }}
                    >
                      Forme juridique *
                    </label>
                    <select
                      name="companyLegalForm"
                      value={formData.companyLegalForm}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "#ffffff",
                        fontSize: "16px",
                        outline: "none",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <option
                        value="Micro-entrepreneur"
                        style={{ background: "#1a1a2e" }}
                      >
                        Micro-entrepreneur
                      </option>
                      <option value="EI" style={{ background: "#1a1a2e" }}>
                        Entreprise Individuelle (EI)
                      </option>
                      <option value="EURL" style={{ background: "#1a1a2e" }}>
                        EURL
                      </option>
                      <option value="SARL" style={{ background: "#1a1a2e" }}>
                        SARL
                      </option>
                      <option value="SAS" style={{ background: "#1a1a2e" }}>
                        SAS
                      </option>
                      <option value="SASU" style={{ background: "#1a1a2e" }}>
                        SASU
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#ffffff",
                        fontWeight: "500",
                      }}
                    >
                      SIRET *
                    </label>
                    <input
                      type="text"
                      name="companySiret"
                      value={formData.companySiret}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 14);
                        setFormData((prev) => ({
                          ...prev,
                          companySiret: value,
                        }));
                        if (errors.companySiret) {
                          setErrors((prev) => ({
                            ...prev,
                            companySiret: undefined,
                          }));
                        }
                      }}
                      placeholder="12345678901234"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: `1px solid ${
                          errors.companySiret
                            ? "#ef4444"
                            : "rgba(255, 255, 255, 0.2)"
                        }`,
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "#ffffff",
                        fontSize: "16px",
                        outline: "none",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => {
                        if (!errors.companySiret) {
                          e.target.style.borderColor = "#8b5cf6";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(139, 92, 246, 0.1)";
                        }
                      }}
                      onBlur={(e) => {
                        if (!errors.companySiret) {
                          e.target.style.borderColor =
                            "rgba(255, 255, 255, 0.2)";
                          e.target.style.boxShadow = "none";
                        }
                      }}
                    />
                    {errors.companySiret && (
                      <p
                        style={{
                          color: "#ef4444",
                          fontSize: "14px",
                          marginTop: "4px",
                        }}
                      >
                        {errors.companySiret}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#ffffff",
                        fontWeight: "500",
                      }}
                    >
                      Téléphone (optionnel)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "#ffffff",
                        fontSize: "16px",
                        outline: "none",
                        transition: "all 0.3s ease",
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
                  </div>
                </div>

                {/* Adresse de l'entreprise */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#ffffff",
                      fontWeight: "500",
                    }}
                  >
                    Adresse de l'entreprise *
                  </label>
                  <input
                    type="text"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                    placeholder="Adresse complète de l'entreprise"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: `1px solid ${
                        errors.companyAddress
                          ? "#ef4444"
                          : "rgba(255, 255, 255, 0.2)"
                      }`,
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "#ffffff",
                      fontSize: "16px",
                      outline: "none",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      if (!errors.companyAddress) {
                        e.target.style.borderColor = "#8b5cf6";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(139, 92, 246, 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.companyAddress) {
                        e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                        e.target.style.boxShadow = "none";
                      }
                    }}
                  />
                  {errors.companyAddress && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "14px",
                        marginTop: "4px",
                      }}
                    >
                      {errors.companyAddress}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: "20px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#ffffff",
                        fontWeight: "500",
                      }}
                    >
                      Code postal *
                    </label>
                    <input
                      type="text"
                      name="companyPostalCode"
                      value={formData.companyPostalCode}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 5);
                        setFormData((prev) => ({
                          ...prev,
                          companyPostalCode: value,
                        }));
                        if (errors.companyPostalCode) {
                          setErrors((prev) => ({
                            ...prev,
                            companyPostalCode: undefined,
                          }));
                        }
                      }}
                      placeholder="75001"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: `1px solid ${
                          errors.companyPostalCode
                            ? "#ef4444"
                            : "rgba(255, 255, 255, 0.2)"
                        }`,
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "#ffffff",
                        fontSize: "16px",
                        outline: "none",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => {
                        if (!errors.companyPostalCode) {
                          e.target.style.borderColor = "#8b5cf6";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(139, 92, 246, 0.1)";
                        }
                      }}
                      onBlur={(e) => {
                        if (!errors.companyPostalCode) {
                          e.target.style.borderColor =
                            "rgba(255, 255, 255, 0.2)";
                          e.target.style.boxShadow = "none";
                        }
                      }}
                    />
                    {errors.companyPostalCode && (
                      <p
                        style={{
                          color: "#ef4444",
                          fontSize: "14px",
                          marginTop: "4px",
                        }}
                      >
                        {errors.companyPostalCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#ffffff",
                        fontWeight: "500",
                      }}
                    >
                      Ville *
                    </label>
                    <input
                      type="text"
                      name="companyCity"
                      value={formData.companyCity}
                      onChange={handleInputChange}
                      placeholder="Paris"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: `1px solid ${
                          errors.companyCity
                            ? "#ef4444"
                            : "rgba(255, 255, 255, 0.2)"
                        }`,
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "#ffffff",
                        fontSize: "16px",
                        outline: "none",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => {
                        if (!errors.companyCity) {
                          e.target.style.borderColor = "#8b5cf6";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(139, 92, 246, 0.1)";
                        }
                      }}
                      onBlur={(e) => {
                        if (!errors.companyCity) {
                          e.target.style.borderColor =
                            "rgba(255, 255, 255, 0.2)";
                          e.target.style.boxShadow = "none";
                        }
                      }}
                    />
                    {errors.companyCity && (
                      <p
                        style={{
                          color: "#ef4444",
                          fontSize: "14px",
                          marginTop: "4px",
                        }}
                      >
                        {errors.companyCity}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div style={{ marginBottom: "32px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    style={{
                      marginTop: "2px",
                      accentColor: "#8b5cf6",
                    }}
                  />
                  <label
                    style={{
                      color: "#d1d5db",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                  >
                    J'accepte les{" "}
                    <Link
                      href="#"
                      style={{ color: "#8b5cf6", textDecoration: "underline" }}
                    >
                      conditions d'utilisation
                    </Link>{" "}
                    et la{" "}
                    <Link
                      href="#"
                      style={{ color: "#8b5cf6", textDecoration: "underline" }}
                    >
                      politique de confidentialité
                    </Link>{" "}
                    de Facturly *
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: "14px",
                      marginBottom: "16px",
                    }}
                  >
                    {errors.acceptTerms}
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <input
                    type="checkbox"
                    name="acceptNewsletter"
                    checked={formData.acceptNewsletter}
                    onChange={handleInputChange}
                    style={{
                      marginTop: "2px",
                      accentColor: "#8b5cf6",
                    }}
                  />
                  <label
                    style={{
                      color: "#d1d5db",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                  >
                    Je souhaite recevoir les actualités et conseils de Facturly
                    par email (optionnel)
                  </label>
                </div>
              </div>

              {/* Boutons */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
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
                    minWidth: "200px",
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
                  {isSubmitting ? "Création du compte..." : "Créer mon compte"}
                  {!isSubmitting && " 🚀"}
                </button>
              </div>

              {/* Lien vers connexion */}
              <div
                style={{
                  textAlign: "center",
                  marginTop: "24px",
                  paddingTop: "24px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <p style={{ color: "#9ca3af", fontSize: "14px" }}>
                  Vous avez déjà un compte ?{" "}
                  <Link
                    href="/connexion"
                    style={{
                      color: "#8b5cf6",
                      textDecoration: "underline",
                      fontWeight: "500",
                    }}
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
