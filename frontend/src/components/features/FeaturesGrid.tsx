"use client";

import { useState, useEffect } from "react";
import FeatureCard from "./FeatureCard";

interface Feature {
  icon: string;
  title: string;
  description: string;
  gradient: string;
  benefits: string[];
}

interface FeaturesGridProps {
  features: Feature[];
}

export default function FeaturesGrid({ features }: FeaturesGridProps) {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    // Animation en cascade pour les cartes
    const timer = setTimeout(() => {
      features.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards((prev) => [...prev, index]);
        }, index * 150);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [features]);

  return (
    <div
      className="grid-responsive"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(350px, 100%), 1fr))",
        gap: "clamp(16px, 4vw, 32px)",
      }}
    >
      {features.map((feature, index) => (
        <div
          key={index}
          style={{
            opacity: visibleCards.includes(index) ? 1 : 0,
            transform: visibleCards.includes(index)
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s ease-out",
          }}
        >
          <FeatureCard
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            gradient={feature.gradient}
            benefits={feature.benefits}
          />
        </div>
      ))}
    </div>
  );
}
