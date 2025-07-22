/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour Netlify (pas d'export statique pour garder les fonctionnalités dynamiques)
  // output: 'export',

  // Configuration des images pour Netlify
  images: {
    unoptimized: true,
    domains: ["localhost"],
  },

  // Configuration du chemin de base (si nécessaire)
  // basePath: '',

  // Configuration pour les assets
  assetPrefix: "",

  // Note: telemetry est désactivé par défaut dans Next.js 15

  // Configuration pour les redirections et rewrites
  async redirects() {
    return [];
  },

  async rewrites() {
    return [];
  },

  // Configuration pour les headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Configuration pour les variables d'environnement
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Configuration pour webpack (si nécessaire)
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimisations webpack personnalisées si nécessaire
    return config;
  },

  // Désactiver les vérifications TypeScript et ESLint pendant le build pour Netlify
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
