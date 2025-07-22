"use client";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradient: string;
  benefits: string[];
  className?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  gradient,
  benefits,
  className = "",
}: FeatureCardProps) {
  return (
    <div
      className={`feature-card hover-lift pulse-hover ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        padding: "clamp(20px, 4vw, 32px)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 25px 50px rgba(0, 0, 0, 0.4)";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          background: gradient,
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
          fontSize: "24px",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          marginBottom: "16px",
          color: "#ffffff",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "#d1d5db",
          lineHeight: "1.6",
          marginBottom: "24px",
        }}
      >
        {description}
      </p>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {benefits.map((benefit, index) => (
          <li
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
              color: "#9ca3af",
              fontSize: "14px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                background: "#10b981",
                borderRadius: "50%",
                marginRight: "12px",
              }}
            ></div>
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  );
}
