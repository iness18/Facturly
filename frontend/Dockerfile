# Étape 1: Installation des dépendances
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Étape 2: Build de l'application
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# La variable NEXT_PUBLIC_API_URL sera passée en argument au build si nécessaire
RUN npm run build

# Étape 3: Image finale pour l'exécution
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copie des fichiers buildés depuis l'étape précédente
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000

# La commande finale pour lancer le serveur Next.js optimisé
CMD ["node", "server.js"]