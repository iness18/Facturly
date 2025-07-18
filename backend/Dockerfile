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

# Copions le contenu de dist DANS le dossier dist courant
COPY --from=builder /app/dist ./dist

# Copions les dépendances de production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copions le schéma Prisma nécessaire pour le client
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
# La commande est correcte si le build produit bien un dist/main.js
CMD ["node", "dist/main.js"]