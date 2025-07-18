import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // 1. Importer les polices
import "./globals.css";

// 2. Configurer les polices
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Facturly - Votre Application",
  description: "Généré avec une stack moderne",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 3. Appliquer les variables de police au HTML
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
