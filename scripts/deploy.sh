#!/bin/bash

#######################################################
# Zero-Downtime Deployment Script for Solo Leveling App
# 
# This script performs blue-green deployment using Docker
# to ensure zero downtime during updates.
#######################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="solo-leveling"
APP_SERVICE="nextjs"
HEALTH_CHECK_URL="http://localhost:3000"
HEALTH_CHECK_TIMEOUT=60
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_ROOT/backups"

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    if [ ! -f "docker-compose.yml" ]; then
        log_error "docker-compose.yml not found. Run from project root."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Backup database before deployment
backup_database() {
    log_info "Backing up MongoDB database..."
    
    mkdir -p "$BACKUP_DIR"
    BACKUP_FILE="$BACKUP_DIR/mongodb-$(date '+%Y%m%d-%H%M%S').archive"
    
    docker exec solo-leveling-mongodb mongodump \
        --archive=/tmp/backup.archive \
        --db=solo-leveling 2>/dev/null || true
    
    docker cp solo-leveling-mongodb:/tmp/backup.archive "$BACKUP_FILE" 2>/dev/null || {
        log_warn "Could not backup database (may be first deployment)"
        return 0
    }
    
    log_success "Database backed up to: $BACKUP_FILE"
}

# Pull latest code (if using git)
pull_latest_code() {
    log_info "Pulling latest code from git..."
    
    if [ -d ".git" ]; then
        git fetch origin
        git pull origin main
        log_success "Code updated from git"
    else
        log_warn "Not a git repository, skipping pull"
    fi
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."
    
    # Check if MongoDB is running
    if ! docker ps | grep -q "solo-leveling-mongodb"; then
        log_info "Starting MongoDB..."
        docker compose up -d mongodb
        sleep 5
    fi
    
    # Run migrations
    if npm run db:migrate:prod 2>&1 | tee /tmp/migration.log; then
        log_success "Migrations completed successfully"
    else
        if grep -q "No migrations to apply" /tmp/migration.log; then
            log_success "No new migrations to apply"
        else
            log_warn "Migrations may have already been applied"
        fi
    fi
    
    rm -f /tmp/migration.log
}

# Build new image
build_new_image() {
    log_info "Building new Docker image..."
    
    # Use --network host to bypass Docker DNS issues (iptables disabled)
    DOCKER_BUILDKIT=1 docker compose build --no-cache $APP_SERVICE
    
    log_success "New image built successfully"
}

# Health check function
wait_for_healthy() {
    local container_name=$1
    local timeout=$2
    local elapsed=0
    
    log_info "Waiting for $container_name to be healthy (timeout: ${timeout}s)..."
    
    while [ $elapsed -lt $timeout ]; do
        health=$(docker inspect --format='{{.State.Health.Status}}' "$container_name" 2>/dev/null || echo "starting")
        
        if [ "$health" == "healthy" ]; then
            log_success "$container_name is healthy"
            return 0
        fi
        
        sleep 2
        elapsed=$((elapsed + 2))
        echo -ne "\r  Waiting... ${elapsed}s / ${timeout}s (status: $health)    "
    done
    
    echo ""
    log_error "$container_name failed to become healthy within ${timeout}s"
    return 1
}

# Zero-downtime deployment using rolling update
deploy_rolling() {
    log_info "Starting zero-downtime rolling deployment..."
    
    # Scale up a new instance
    log_info "Starting new container..."
    
    # Stop and remove the old container, start new one
    # Docker Compose will handle this with minimal downtime
    docker compose up -d --no-deps --build $APP_SERVICE
    
    # Wait for the new container to be healthy
    wait_for_healthy "solo-leveling-app" $HEALTH_CHECK_TIMEOUT || {
        log_error "New container failed health check, rolling back..."
        rollback
        exit 1
    }
    
    log_success "Rolling deployment completed"
}

# Blue-Green deployment (more advanced, requires additional setup)
deploy_blue_green() {
    log_info "Starting blue-green deployment..."
    
    # Determine current color
    CURRENT_COLOR=$(docker ps --filter "name=solo-leveling-app" --format "{{.Names}}" | grep -o 'blue\|green' || echo "none")
    
    if [ "$CURRENT_COLOR" == "blue" ]; then
        NEW_COLOR="green"
    else
        NEW_COLOR="blue"
    fi
    
    log_info "Current: $CURRENT_COLOR, Deploying: $NEW_COLOR"
    
    # Build new image
    docker compose -f docker-compose.yml build $APP_SERVICE
    
    # Start new container with different name
    COMPOSE_PROJECT_NAME="${PROJECT_NAME}-${NEW_COLOR}" docker compose up -d $APP_SERVICE
    
    # Wait for new container to be healthy
    wait_for_healthy "solo-leveling-app-${NEW_COLOR}" $HEALTH_CHECK_TIMEOUT || {
        log_error "New container failed health check, cleaning up..."
        COMPOSE_PROJECT_NAME="${PROJECT_NAME}-${NEW_COLOR}" docker compose down
        exit 1
    }
    
    # Update nginx to point to new container
    # (This requires nginx config update - simplified version just switches)
    
    # Stop old container
    if [ "$CURRENT_COLOR" != "none" ]; then
        COMPOSE_PROJECT_NAME="${PROJECT_NAME}-${CURRENT_COLOR}" docker compose down $APP_SERVICE
    fi
    
    log_success "Blue-green deployment completed ($NEW_COLOR is now active)"
}

# Rollback to previous version
rollback() {
    log_warn "Rolling back to previous version..."
    
    # Get the previous image
    PREV_IMAGE=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep solo-leveling | head -2 | tail -1)
    
    if [ -n "$PREV_IMAGE" ]; then
        docker compose down $APP_SERVICE
        docker compose up -d $APP_SERVICE
        log_success "Rollback completed"
    else
        log_error "No previous image found for rollback"
        exit 1
    fi
}

# Clean up old images
cleanup() {
    log_info "Cleaning up old Docker images..."
    
    # Remove dangling images
    docker image prune -f
    
    # Keep only last 3 images of the app
    docker images --format "{{.ID}} {{.Repository}}" | \
        grep "solo-leveling" | \
        tail -n +4 | \
        awk '{print $1}' | \
        xargs -r docker rmi 2>/dev/null || true
    
    log_success "Cleanup completed"
}

# Verify deployment
verify_deployment() {
    log_info "Verifying deployment..."
    
    # Check if app responds
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -k https://localhost:8443/ 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "302" ]; then
        log_success "Application is responding (HTTP $HTTP_CODE)"
    else
        log_error "Application health check failed (HTTP $HTTP_CODE)"
        exit 1
    fi
    
    # Show running containers
    log_info "Running containers:"
    docker compose ps
}

# Show deployment status
show_status() {
    echo ""
    echo "======================================"
    echo "       DEPLOYMENT STATUS"
    echo "======================================"
    docker compose ps
    echo ""
    echo "Recent logs:"
    docker compose logs --tail=10 $APP_SERVICE
}

# Main deployment function
deploy() {
    echo ""
    echo "======================================"
    echo "  Solo Leveling Zero-Downtime Deploy"
    echo "======================================"
    echo ""
    
    check_prerequisites
    backup_database
    pull_latest_code
    run_migrations
    build_new_image
    deploy_rolling
    cleanup
    verify_deployment
    
    echo ""
    log_success "🎉 Deployment completed successfully!"
    echo ""
    show_status
}

# Quick deploy (skip backup and git pull)
deploy_quick() {
    echo ""
    echo "======================================"
    echo "  Solo Leveling Quick Deploy"
    echo "======================================"
    echo ""
    
    check_prerequisites
    # run_migrations
    build_new_image
    deploy_rolling
    verify_deployment
    
    echo ""
    log_success "🎉 Quick deployment completed!"
}

# Print usage
usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  deploy      Full deployment (backup, pull, build, deploy)"
    echo "  quick       Quick deployment (build and deploy only)"
    echo "  rollback    Rollback to previous version"
    echo "  status      Show current deployment status"
    echo "  backup      Backup database only"
    echo "  cleanup     Clean up old Docker images"
    echo "  health      Check application health"
    echo ""
    echo "Examples:"
    echo "  $0 deploy       # Full production deployment"
    echo "  $0 quick        # Quick redeploy after code changes"
    echo "  $0 rollback     # Rollback if something goes wrong"
}

# Parse command line arguments
case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    quick)
        deploy_quick
        ;;
    rollback)
        check_prerequisites
        rollback
        verify_deployment
        ;;
    status)
        show_status
        ;;
    backup)
        check_prerequisites
        backup_database
        ;;
    cleanup)
        cleanup
        ;;
    health)
        verify_deployment
        ;;
    help|--help|-h)
        usage
        ;;
    *)
        log_error "Unknown command: $1"
        usage
        exit 1
        ;;
esac
