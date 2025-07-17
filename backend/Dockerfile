# Étape 1: Installation des dépendances et build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Génère le client Prisma basé sur votre schema.prisma
RUN npx prisma generate
# Build l'application NestJS
RUN npm run build

# Étape 2: Image finale pour l'exécution
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copie uniquement le nécessaire pour l'exécution
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
# Copie package.json pour que Prisma sache où trouver le client
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
# La commande pour lancer le serveur NestJS en production
CMD ["node", "dist/main"]