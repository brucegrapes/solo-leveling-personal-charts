# Zero-Downtime Deployment Guide

This guide covers how to deploy the Solo Leveling Progress Tracker to production with zero downtime.

## Quick Start

```bash
# Make the deploy script executable (first time only)
chmod +x scripts/deploy.sh

# Full deployment
./scripts/deploy.sh deploy

# Quick deployment (after code changes)
./scripts/deploy.sh quick
```

---

## Deployment Options

### Option 1: Using the Deploy Script (Recommended)

The deploy script handles everything automatically:

```bash
# Full deployment with backup, git pull, build, and deploy
./scripts/deploy.sh deploy

# Quick deploy (skip backup and git pull)
./scripts/deploy.sh quick

# Check status
./scripts/deploy.sh status

# Rollback if needed
./scripts/deploy.sh rollback
```

### Option 2: Manual Deployment

If you prefer manual control:

```bash
# 1. Pull latest code
git pull origin main

# 2. Build new image (does not affect running container)
docker compose build --no-cache nextjs

# 3. Rolling update (minimal downtime)
docker compose up -d --no-deps nextjs

# 4. Verify deployment
curl -k https://localhost/
docker compose ps
```

### Option 3: GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /path/to/solo-leveling-personal-charts
            ./scripts/deploy.sh deploy
```

---

## How Zero-Downtime Works

### Rolling Update Strategy

1. **New container starts** while old container keeps running
2. **Health check passes** on the new container
3. **Traffic switches** to the new container
4. **Old container stops** gracefully

```
Timeline:
─────────────────────────────────────────────────────►
│ Old Container ████████████████████░░░░░░░░░░░░░░░░│
│ New Container ░░░░░░░░░░░░░░░░████████████████████│
│                              ▲
│                        Traffic Switch
```

### Health Checks

The deployment script waits for the container to be healthy before switching traffic:

```yaml
# In docker-compose.yml
healthcheck:
  test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000"]
  interval: 30s
  timeout: 10s
  retries: 3
```

---

## Pre-Deployment Checklist

- [ ] Backup database (script does this automatically)
- [ ] Check available disk space: `df -h`
- [ ] Ensure environment variables are set in `.env`
- [ ] Test locally first: `npm run dev`
- [ ] Review changes: `git log -5 --oneline`

---

## Environment Setup

### Required Environment Variables

Create a `.env` file in the project root:

```bash
# Generate a secure secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Production URL
NEXTAUTH_URL=https://yourdomain.com

# MongoDB (internal Docker network)
MONGODB_URI=mongodb://mongodb:27017/solo-leveling
```

### SSL Certificates

For the first deployment, generate SSL certificates:

```bash
# Self-signed (development/internal)
./generate-ssl.sh

# Let's Encrypt (production)
# See the "Production SSL" section below
```

---

## Deployment Commands Reference

| Command | Description |
|---------|-------------|
| `./scripts/deploy.sh deploy` | Full deployment with backup |
| `./scripts/deploy.sh quick` | Quick deployment (no backup/pull) |
| `./scripts/deploy.sh rollback` | Rollback to previous version |
| `./scripts/deploy.sh status` | Show current status |
| `./scripts/deploy.sh backup` | Backup database only |
| `./scripts/deploy.sh cleanup` | Remove old Docker images |
| `./scripts/deploy.sh health` | Check application health |

---

## Monitoring After Deployment

### View Logs

```bash
# All services
docker compose logs -f

# Just the app
docker compose logs -f nextjs

# Last 100 lines
docker compose logs --tail=100 nextjs
```

### Check Health

```bash
# Container status
docker compose ps

# Health endpoint
curl -k https://localhost/

# Detailed health
docker inspect solo-leveling-app | jq '.[0].State.Health'
```

### Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df
```

---

## Troubleshooting

### Deployment Failed

```bash
# Check logs for errors
docker compose logs --tail=50 nextjs

# Rollback to previous version
./scripts/deploy.sh rollback

# Check container status
docker compose ps -a
```

### Container Won't Start

```bash
# Check build logs
docker compose build nextjs 2>&1 | tail -50

# Check for port conflicts
sudo lsof -i :3000
sudo lsof -i :443

# Restart Docker
sudo systemctl restart docker
```

### Database Connection Issues

```bash
# Check MongoDB is running
docker compose ps mongodb

# Test connection
docker exec solo-leveling-mongodb mongosh --eval "db.stats()"

# Check network
docker network inspect solo-leveling-personal-charts_solo-leveling-network
```

### Out of Disk Space

```bash
# Clean up Docker
docker system prune -a --volumes

# Remove old backups
ls -la /var/lib/solo-leveling/backups/
rm /var/lib/solo-leveling/backups/mongodb-old-*.archive
```

---

## Production SSL with Let's Encrypt

For production, replace self-signed certificates with Let's Encrypt:

### Using Certbot

```bash
# Install certbot
sudo apt install certbot

# Get certificate (stop nginx first)
docker compose stop nginx
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/key.pem

# Restart nginx
docker compose up -d nginx
```

### Auto-Renewal

```bash
# Add to crontab
sudo crontab -e

# Add this line (renews at 3am daily)
0 3 * * * certbot renew --quiet && docker compose restart nginx
```

---

## Backup & Restore

### Create Backup

```bash
./scripts/deploy.sh backup
# Backup saved to: /var/lib/solo-leveling/backups/
```

### Restore from Backup

```bash
# Find your backup
ls /var/lib/solo-leveling/backups/

# Restore
docker cp /var/lib/solo-leveling/backups/mongodb-YYYYMMDD-HHMMSS.archive solo-leveling-mongodb:/tmp/restore.archive
docker exec solo-leveling-mongodb mongorestore --archive=/tmp/restore.archive --drop
```

---

## Scaling (Future)

For higher traffic, consider:

1. **Multiple app instances** with load balancer
2. **MongoDB replica set** for database redundancy
3. **Redis** for session storage and caching
4. **CDN** for static assets

```yaml
# Example: Scale to 3 instances
docker compose up -d --scale nextjs=3
```

---

## Emergency Procedures

### Complete System Down

```bash
# 1. Check what's running
docker compose ps -a

# 2. Restart everything
docker compose down
docker compose up -d

# 3. Check logs
docker compose logs -f
```

### Rollback to Specific Version

```bash
# List available images
docker images | grep solo-leveling

# Tag old image as latest
docker tag <old-image-id> solo-leveling-app:latest

# Restart
docker compose up -d --force-recreate nextjs
```

### Nuclear Option (Start Fresh)

```bash
# ⚠️ WARNING: This deletes everything except database
docker compose down
docker system prune -a
./scripts/deploy.sh deploy
```
