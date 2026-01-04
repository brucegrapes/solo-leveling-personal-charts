#!/bin/bash

#######################################################
# Production Deployment Script for Solo Leveling App
# 
# This script:
# 1. Stops and cleans up old containers
# 2. Starts fresh production database
# 3. Runs database migrations
# 4. Builds and starts the application
#######################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

log_info "Starting production deployment..."

# Step 1: Stop existing containers
log_info "Step 1/6: Stopping existing containers..."
docker compose down || log_warn "No containers to stop"
log_success "Containers stopped"

# Step 2: Clean up old data (optional - commented out for safety)
# Uncomment if you want to start fresh with database
# log_warn "Cleaning up old volumes..."
# docker compose down -v
# log_success "Volumes cleaned"

# Step 3: Start MongoDB first
log_info "Step 2/6: Starting MongoDB..."
docker compose up -d mongodb
log_success "MongoDB started"

# Wait for MongoDB to be ready
log_info "Waiting for MongoDB to be healthy..."
MAX_WAIT=60
WAITED=0
while [ $WAITED -lt $MAX_WAIT ]; do
    if docker inspect solo-leveling-mongodb | grep -q '"Status": "healthy"'; then
        log_success "MongoDB is healthy"
        break
    fi
    sleep 2
    WAITED=$((WAITED + 2))
    echo -n "."
done
echo ""

if [ $WAITED -ge $MAX_WAIT ]; then
    log_error "MongoDB failed to become healthy within ${MAX_WAIT} seconds"
    exit 1
fi

# Step 4: Run database migrations
log_info "Step 3/6: Running database migrations..."
if npm run db:migrate; then
    log_success "Migrations completed"
else
    log_warn "Migrations may have already been applied or failed"
fi

# Step 5: Generate SSL certificates (if needed)
log_info "Step 4/6: Checking SSL certificates..."
if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
    log_info "Generating SSL certificates..."
    bash generate-ssl.sh
    log_success "SSL certificates generated"
else
    log_success "SSL certificates already exist"
fi

# Step 6: Build and start all services
log_info "Step 5/6: Building and starting all services..."
docker compose up -d --build
log_success "Services started"

# Step 7: Show status
log_info "Step 6/6: Checking deployment status..."
sleep 5
docker compose ps

log_success "================================"
log_success "Deployment completed!"
log_success "================================"
log_info ""
log_info "Services running:"
log_info "  - App: https://localhost (HTTPS)"
log_info "  - App: http://localhost (HTTP redirects to HTTPS)"
log_info "  - MongoDB: Internal (mongodb:27017)"
log_info ""
log_info "Check logs with: docker compose logs -f"
log_info "Check status with: docker compose ps"
log_info ""
log_warn "Remember to:"
log_warn "  1. Ensure .env file has production MongoDB URI"
log_warn "  2. Check that all services are healthy"
log_warn "  3. Test the application is working"
