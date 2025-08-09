#!/bin/bash

# 🚀 Script de déploiement automatisé pour Facturly
# Usage: ./scripts/deploy.sh [environment]
# Environments: staging, production

set -e  # Arrêter en cas d'erreur

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction de log
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

# Vérifier les prérequis
check_prerequisites() {
    log "Vérification des prérequis..."
    
    # Vérifier Git
    if ! command -v git &> /dev/null; then
        error "Git n'est pas installé"
    fi
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js n'est pas installé"
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        error "npm n'est pas installé"
    fi
    
    # Vérifier Heroku CLI
    if ! command -v heroku &> /dev/null; then
        warning "Heroku CLI n'est pas installé. Installation recommandée pour le déploiement backend."
    fi
    
    success "Prérequis vérifiés"
}

# Vérifier que nous sommes sur la branche main
check_branch() {
    local current_branch=$(git branch --show-current)
    if [ "$current_branch" != "main" ]; then
        error "Vous devez être sur la branche 'main' pour déployer. Branche actuelle: $current_branch"
    fi
    success "Branche 'main' confirmée"
}

# Vérifier l'état du repository
check_git_status() {
    log "Vérification de l'état Git..."
    
    # Vérifier s'il y a des modifications non commitées
    if ! git diff-index --quiet HEAD --; then
        error "Il y a des modifications non commitées. Veuillez commiter ou stasher vos changements."
    fi
    
    # Vérifier s'il y a des fichiers non trackés
    if [ -n "$(git ls-files --others --exclude-standard)" ]; then
        warning "Il y a des fichiers non trackés. Assurez-vous qu'ils ne sont pas importants."
    fi
    
    success "État Git vérifié"
}

# Mettre à jour depuis origin
update_from_origin() {
    log "Mise à jour depuis origin/main..."
    git fetch origin
    git pull origin main
    success "Repository mis à jour"
}

# Installer les dépendances
install_dependencies() {
    log "Installation des dépendances..."
    
    # Backend
    log "Installation des dépendances backend..."
    cd backend
    npm ci --only=production
    cd ..
    
    # Frontend
    log "Installation des dépendances frontend..."
    cd frontend
    npm ci --only=production
    cd ..
    
    success "Dépendances installées"
}

# Tester le build
test_build() {
    log "Test des builds..."
    
    # Test build backend
    log "Test build backend..."
    cd backend
    npm run build
    cd ..
    
    # Test build frontend
    log "Test build frontend..."
    cd frontend
    npm run build
    cd ..
    
    success "Builds testés avec succès"
}

# Déployer sur Heroku
deploy_heroku() {
    local app_name=$1
    
    if ! command -v heroku &> /dev/null; then
        warning "Heroku CLI non disponible. Déploiement manuel requis."
        return
    fi
    
    log "Déploiement sur Heroku ($app_name)..."
    
    # Vérifier que l'app existe
    if ! heroku apps:info $app_name &> /dev/null; then
        error "L'application Heroku '$app_name' n'existe pas"
    fi
    
    # Déployer
    git push heroku main
    
    # Vérifier le déploiement
    heroku ps:scale web=1 -a $app_name
    
    success "Déploiement Heroku terminé"
}

# Vérifier le déploiement
verify_deployment() {
    local frontend_url=$1
    local backend_url=$2
    
    log "Vérification du déploiement..."
    
    # Vérifier le backend
    if command -v curl &> /dev/null; then
        log "Test du backend..."
        if curl -f -s "$backend_url" > /dev/null; then
            success "Backend accessible"
        else
            warning "Backend non accessible à $backend_url"
        fi
        
        # Test de l'API d'authentification
        log "Test de l'API d'authentification..."
        if curl -f -s -X POST "$backend_url/auth/login" \
           -H "Content-Type: application/json" \
           -d '{"email":"admin@facturly.com","password":"Admin123!"}' > /dev/null; then
            success "API d'authentification fonctionnelle"
        else
            warning "API d'authentification non accessible"
        fi
    fi
    
    log "Vérification manuelle recommandée:"
    log "- Frontend: $frontend_url"
    log "- Backend: $backend_url"
    log "- Test de connexion avec: admin@facturly.com / Admin123!"
}

# Fonction principale
main() {
    local environment=${1:-production}
    
    echo "🚀 Déploiement Facturly - Environnement: $environment"
    echo "=================================================="
    
    # Configuration selon l'environnement
    case $environment in
        "staging")
            HEROKU_APP="facturly-backend-staging"
            FRONTEND_URL="https://staging--facturly.netlify.app"
            BACKEND_URL="https://facturly-backend-staging.herokuapp.com"
            ;;
        "production")
            HEROKU_APP="facturly-backend-prod"
            FRONTEND_URL="https://facturly.netlify.app"
            BACKEND_URL="https://facturly-backend-prod.herokuapp.com"
            ;;
        *)
            error "Environnement non supporté: $environment. Utilisez 'staging' ou 'production'"
            ;;
    esac
    
    # Étapes de déploiement
    check_prerequisites
    check_branch
    check_git_status
    update_from_origin
    install_dependencies
    test_build
    
    # Déploiement Heroku (si disponible)
    if command -v heroku &> /dev/null; then
        deploy_heroku $HEROKU_APP
    else
        warning "Déploiement Heroku manuel requis"
    fi
    
    # Vérification
    verify_deployment $FRONTEND_URL $BACKEND_URL
    
    echo ""
    success "🎉 Déploiement terminé !"
    echo ""
    log "Prochaines étapes:"
    log "1. Vérifiez Netlify pour le déploiement frontend automatique"
    log "2. Testez l'application sur: $FRONTEND_URL"
    log "3. Vérifiez les logs Heroku: heroku logs --tail -a $HEROKU_APP"
    log "4. Configurez les variables d'environnement si nécessaire"
}

# Exécuter le script
main "$@"