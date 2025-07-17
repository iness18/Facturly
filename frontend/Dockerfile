# Étape 1 : build
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install && npm run build

# Étape 2 : Serveur léger
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
