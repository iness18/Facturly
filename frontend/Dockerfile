# Étape 1: Installation des dépendances
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm ci

# Étape 2: Build de l'application
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# S'assurer que la configuration de next est bien présente pour le build
COPY next.config.ts .
RUN npm run build

# Étape 3: Image finale pour l'exécution (Approche plus robuste)
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# On copie d'abord TOUTES les dépendances de production
COPY --from=deps /app/package.json ./package.json
RUN npm install --omit=dev

# Ensuite, on copie les fichiers buildés par-dessus
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./next.config.ts

# La commande de démarrage standard de Next.js en production
EXPOSE 3000
CMD ["npm", "start"]