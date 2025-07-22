"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// Composant StatusSelect personnalisé avec portail
const StatusSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);
  const [mounted, setMounted] = useState(false);

  const statusOptions = [
    { value: "", label: "Tous les statuts", icon: "📋", color: "#9ca3af" },
    { value: "draft", label: "Brouillon", icon: "📝", color: "#9ca3af" },
    { value: "sent", label: "Envoyée", icon: "📧", color: "#3b82f6" },
    { value: "paid", label: "Payée", icon: "✅", color: "#10b981" },
    { value: "overdue", label: "En retard", icon: "⚠️", color: "#ef4444" },
  ];

  const selectedOption =
    statusOptions.find((option) => option.value === value) || statusOptions[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef && !buttonRef.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isOpen, buttonRef]);

  const getDropdownPosition = () => {
    if (!buttonRef) return { top: 0, left: 0, width: 200 };

    const rect = buttonRef.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      width: rect.width,
    };
  };

  const dropdownPosition = getDropdownPosition();

  return (
    <>
      {/* Bouton principal */}
      <button
        ref={setButtonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{
          width: "100%",
          padding: "8px 12px",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "6px",
          color: "#ffffff",
          fontSize: "14px",
          outline: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px" }}>{selectedOption.icon}</span>
          <span style={{ color: selectedOption.color }}>
            {selectedOption.label}
          </span>
        </div>
        <span
          style={{
            fontSize: "12px",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          ▼
        </span>
      </button>

      {/* Menu déroulant avec portail */}
      {isOpen &&
        mounted &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "8px",
              padding: "4px",
              zIndex: 999999,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background:
                    value === option.value
                      ? "rgba(255, 255, 255, 0.1)"
                      : "transparent",
                  border: "none",
                  borderRadius: "6px",
                  color: "#ffffff",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <span style={{ fontSize: "12px" }}>{option.icon}</span>
                <span style={{ color: option.color }}>{option.label}</span>
                {value === option.value && (
                  <span
                    style={{
                      marginLeft: "auto",
                      color: "#10b981",
                      fontSize: "12px",
                    }}
                  >
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};

export default StatusSelect;
