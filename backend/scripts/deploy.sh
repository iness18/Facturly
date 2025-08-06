#!/bin/bash

# Script de déploiement Facturly - Migration MongoDB
# Usage: ./scripts/deploy.sh [staging|production]

set -e  # Arrêter en cas d'erreur

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction de logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Vérifier les arguments
ENVIRONMENT=${1:-staging}

if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    error "Environnement invalide. Utilisez 'staging' ou 'production'"
fi

log "🚀 Démarrage du déploiement Facturly - Environnement: $ENVIRONMENT"

# Vérifier que nous sommes dans le bon répertoire
if [[ ! -f "package.json" ]]; then
    error "Ce script doit être exécuté depuis le répertoire backend"
fi

# Charger les variables d'environnement
if [[ -f ".env.$ENVIRONMENT" ]]; then
    log "📄 Chargement des variables d'environnement pour $ENVIRONMENT"
    export $(cat .env.$ENVIRONMENT | grep -v '^#' | xargs)
    success "Variables d'environnement chargées"
else
    warning "Fichier .env.$ENVIRONMENT non trouvé, utilisation des variables système"
fi

# Vérifier les variables critiques
log "🔍 Vérification des variables d'environnement critiques..."

if [[ -z "$MONGODB_URI" ]]; then
    error "MONGODB_URI non définie"
fi

if [[ -z "$JWT_SECRET" ]]; then
    error "JWT_SECRET non définie"
fi

if [[ ${#JWT_SECRET} -lt 32 ]]; then
    error "JWT_SECRET doit contenir au moins 32 caractères"
fi

success "Variables d'environnement validées"

# Vérifier la connexion MongoDB
log "🔗 Test de connexion MongoDB..."
if npm run mongodb:test:atlas; then
    success "Connexion MongoDB Atlas réussie"
else
    error "Échec de la connexion MongoDB Atlas"
fi

# Installation des dépendances
log "📦 Installation des dépendances..."
npm ci --only=production
success "Dépendances installées"

# Build de l'application
log "🏗️  Build de l'application..."
npm run build
success "Application buildée"

# Tests MongoDB complets
log "🧪 Exécution des tests MongoDB..."
if npm run mongodb:test; then
    success "Tests MongoDB réussis"
else
    error "Échec des tests MongoDB"
fi

# Backup de sécurité (si en production)
if [[ "$ENVIRONMENT" == "production" ]]; then
    log "💾 Création d'un backup de sécurité..."
    BACKUP_DIR="./backups/pre-deploy-$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    if command -v mongodump &> /dev/null; then
        mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR" || warning "Backup automatique échoué"
        success "Backup créé dans $BACKUP_DIR"
    else
        warning "mongodump non disponible, backup manuel recommandé"
    fi
fi

# Vérification finale de l'application
log "🔍 Vérification finale de l'application..."
timeout 30s npm run start:prod &
APP_PID=$!

sleep 10

# Test de santé de l'API
if curl -f http://localhost:${PORT:-3001}/health > /dev/null 2>&1; then
    success "API répond correctement"
    kill $APP_PID 2>/dev/null || true
else
    kill $APP_PID 2>/dev/null || true
    error "L'API ne répond pas correctement"
fi

# Résumé du déploiement
log "📋 Résumé du déploiement:"
echo "  • Environnement: $ENVIRONMENT"
echo "  • MongoDB URI: ${MONGODB_URI%%@*}@***"
echo "  • Port: ${PORT:-3001}"
echo "  • Node ENV: ${NODE_ENV:-development}"
echo "  • Frontend URL: ${FRONTEND_URL:-non définie}"

success "🎉 Déploiement $ENVIRONMENT terminé avec succès!"

# Instructions post-déploiement
log "📝 Instructions post-déploiement:"
echo "  1. Vérifiez les logs de l'application"
echo "  2. Testez les endpoints critiques"
echo "  3. Surveillez les métriques MongoDB Atlas"
echo "  4. Configurez les alertes de monitoring"

if [[ "$ENVIRONMENT" == "production" ]]; then
    echo "  5. Planifiez les backups automatiques"
    echo "  6. Configurez la rotation des logs"
    echo "  7. Vérifiez les certificats SSL"
fi

log "🚀 Application prête à être démarrée avec: npm run start:prod"