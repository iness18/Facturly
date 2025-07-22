"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage = "" }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navItems = [
    { href: "/", label: "Accueil" },
    { href: "/fonctionnalites", label: "Fonctionnalités" },
    { href: "#", label: "Tarifs" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 50,
        background: "rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            Facturly
          </span>
        </Link>

        {/* Desktop Menu */}
        <div
          className="desktop-menu"
          style={{
            display: "none",
            alignItems: "center",
            gap: "32px",
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color: currentPage === item.href ? "#ffffff" : "#d1d5db",
                textDecoration: "none",
                fontWeight: currentPage === item.href ? "600" : "400",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div
          className="desktop-menu"
          style={{
            display: "none",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Link
            href="/admin/login"
            style={{
              background: "transparent",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              color: "#a78bfa",
              cursor: "pointer",
              textDecoration: "none",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              display: "inline-block",
            }}
            title="Administration"
          >
            🔐
          </Link>
          <Link
            href="/connexion"
            style={{
              background: "transparent",
              border: "none",
              color: "#d1d5db",
              cursor: "pointer",
              textDecoration: "none",
              padding: "8px 16px",
            }}
          >
            Connexion
          </Link>
          <Link
            href="/inscription"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
              color: "#ffffff",
              padding: "8px 24px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            S'inscrire
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          style={{
            display: "none",
            background: "transparent",
            border: "none",
            color: "#ffffff",
            cursor: "pointer",
          }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && isMobile && (
        <div
          style={{
            background: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(10px)",
            padding: "16px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  color: currentPage === item.href ? "#ffffff" : "#d1d5db",
                  textDecoration: "none",
                  fontWeight: currentPage === item.href ? "600" : "400",
                  padding: "8px 0",
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Link
                href="/connexion"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#d1d5db",
                  padding: "12px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  textAlign: "center",
                  display: "block",
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                style={{
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                  color: "#ffffff",
                  padding: "12px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  textAlign: "center",
                  display: "block",
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                S'inscrire
              </Link>
              <Link
                href="/admin/login"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  color: "#a78bfa",
                  padding: "8px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  textAlign: "center",
                  display: "block",
                  fontSize: "12px",
                  marginTop: "8px",
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                🔐 Administration
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
