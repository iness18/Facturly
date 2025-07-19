import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // 1. Importer les polices
import "./globals.css";

// 2. Configurer les polices
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Facturly - Votre Facturation Réinventée",
  description:
    "Générez des factures professionnelles en quelques clics. Simple, puissant et conçu pour les créatifs comme vous.",
  keywords: ["facturation", "factures", "freelance", "entreprise", "gestion"],
  authors: [{ name: "Facturly Team" }],
  openGraph: {
    title: "Facturly - Votre Facturation Réinventée",
    description:
      "Générez des factures professionnelles en quelques clics. Simple, puissant et conçu pour les créatifs comme vous.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Facturly - Votre Facturation Réinventée",
    description:
      "Générez des factures professionnelles en quelques clics. Simple, puissant et conçu pour les créatifs comme vous.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 3. Appliquer les variables de police au HTML
    <html
      lang="fr"
      className={`${inter.variable} ${outfit.variable} scroll-smooth`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
