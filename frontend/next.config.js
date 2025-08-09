/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour Netlify - export statique pour compatibilité
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  trailingSlash: true,
  distDir: ".next",

  // Configuration des images pour Netlify
  images: {
    unoptimized: true,
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Configuration pour les assets
  assetPrefix: "",

  // Désactiver la télémétrie
  telemetry: false,

  // Configuration pour les redirections et rewrites
  async redirects() {
    return [];
  },

  async rewrites() {
    // Rediriger les appels API vers le backend Heroku en production
    if (process.env.NODE_ENV === "production") {
      return [
        {
          source: "/api/:path*",
          destination: `${
            process.env.NEXT_PUBLIC_API_URL ||
            "https://votre-backend-heroku.herokuapp.com"
          }/api/:path*`,
        },
      ];
    }
    return [];
  },

  // Configuration pour les headers de sécurité
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
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },

  // Configuration pour les variables d'environnement
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NODE_ENV,
  },

  // Configuration pour webpack
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimisations pour la production
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = "all";
    }

    // Résoudre les problèmes de modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },

  // Configuration pour TypeScript et ESLint
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === "production",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === "production",
  },

  // Configuration expérimentale pour les performances
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react"],
  },

  // Configuration pour la compression
  compress: true,

  // Configuration pour les pages statiques
  trailingSlash: false,
};

module.exports = nextConfig;
