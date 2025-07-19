#!/bin/bash

echo "🚀 Configuration de Facturly..."

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Docker détecté"

# Copier le fichier d'environnement si nécessaire
if [ ! -f .env ]; then
    echo "📋 Création du fichier .env..."
    cp .env.example .env
    echo "✅ Fichier .env créé. Vous pouvez le modifier si nécessaire."
else
    echo "✅ Fichier .env existant"
fi

# Installer les dépendances du backend
echo "📦 Installation des dépendances backend..."
cd backend
if [ -f package.json ]; then
    npm install
    echo "✅ Dépendances backend installées"
else
    echo "❌ package.json non trouvé dans backend/"
    exit 1
fi
cd ..

# Installer les dépendances du frontend
echo "📦 Installation des dépendances frontend..."
cd frontend
if [ -f package.json ]; then
    npm install
    echo "✅ Dépendances frontend installées"
else
    echo "❌ package.json non trouvé dans frontend/"
    exit 1
fi
cd ..

# Démarrer les services Docker
echo "🐳 Démarrage des services Docker..."
docker-compose up -d

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
sleep 10

# Générer le client Prisma et exécuter les migrations
echo "🗄️ Configuration de la base de données..."
cd backend
npx prisma generate
npx prisma migrate dev --name init
echo "✅ Base de données configurée"
cd ..

echo ""
echo "🎉 Configuration terminée !"
echo ""
echo "📍 URLs d'accès :"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   Database: localhost:5432"
echo ""
echo "🔧 Commandes utiles :"
echo "   docker-compose logs -f backend   # Logs du backend"
echo "   docker-compose logs -f frontend  # Logs du frontend"
echo "   docker-compose down              # Arrêter les services"
echo ""
echo "📚 Consultez le README.md pour plus d'informations"