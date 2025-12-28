# Production Deployment with Docker & HTTPS 🚀

## Overview

Your Solo Leveling Progress Tracker now runs as a complete Docker stack with:
- ✅ Next.js application in production mode
- ✅ MongoDB database
- ✅ Nginx reverse proxy with HTTPS
- ✅ Self-signed SSL certificates
- ✅ Detached mode (runs in background)

## Quick Start

### 1. Generate SSL Certificates (First Time Only)
```bash
./generate-ssl.sh
```

### 2. Build and Start Production
```bash
docker compose up --build -d
```

### 3. Access Your Application
Open your browser: **https://localhost**

**Note**: Your browser will show a security warning because we're using self-signed SSL certificates. This is normal for local development.

To proceed:
- Click "Advanced"
- Click "Continue to localhost (unsafe)" or "Accept Risk"

## Docker Commands

### Start the Application
```bash
docker compose up -d
```

### Stop the Application
```bash
docker compose down
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f nextjs
docker compose logs -f mongodb
docker compose logs -f nginx
```

### Restart Services
```bash
# All services
docker compose restart

# Specific service
docker compose restart nextjs
```

### Rebuild After Code Changes
```bash
docker compose up --build -d
```

### Clean Everything (Delete All Data)
```bash
docker compose down -v
rm -rf .next ssl
```

## NPM Scripts

```bash
# Production Docker
npm run docker:prod      # Build & start with HTTPS
npm run docker:logs      # View logs
npm run docker:restart   # Restart all containers
npm run docker:clean     # Stop & remove everything

# Development (no Docker)
npm run dev             # Local development on port 2026
```

## Container Architecture

```
┌─────────────────────────────────────┐
│  Browser (HTTPS)                    │
│  https://localhost                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  Nginx (Container)                   │
│  - Port 443 (HTTPS)                  │
│  - Port 80 → redirects to 443        │
│  - SSL termination                   │
│  - Reverse proxy                     │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  Next.js App (Container)             │
│  - Production build                  │
│  - Standalone output                 │
│  - Internal port 3000                │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  MongoDB (Container)                 │
│  - Port 27017                        │
│  - Persistent volumes                │
│  - Database: solo-leveling           │
└──────────────────────────────────────┘
```

## Configuration Files

- **Dockerfile**: Next.js production build
- **docker-compose.yml**: Multi-container orchestration
- **nginx.conf**: Reverse proxy & SSL configuration
- **.env**: Production environment variables

## Volumes & Data Persistence

Your data is stored in Docker volumes:
- `mongodb_data`: Database files
- `mongodb_config`: MongoDB configuration

**Data survives container restarts** but will be deleted if you run:
```bash
docker compose down -v
```

## SSL Certificates

Self-signed certificates are stored in `./ssl/`:
- `cert.pem`: SSL certificate
- `key.pem`: Private key

**Valid for**: 365 days

To regenerate:
```bash
./generate-ssl.sh
docker compose restart nginx
```

## Production Best Practices

### For Internet Deployment:

1. **Use Real SSL Certificates**:
   - Get free certificates from [Let's Encrypt](https://letsencrypt.org/)
   - Use [Certbot](https://certbot.eff.org/) for automatic renewal
   
2. **Environment Variables**:
   - Generate strong `NEXTAUTH_SECRET`:
     ```bash
     openssl rand -base64 32
     ```
   - Update `NEXTAUTH_URL` to your domain

3. **Domain Setup**:
   - Point your domain to your server IP
   - Update `server_name` in [nginx.conf](nginx.conf)
   - Update `NEXTAUTH_URL` in [.env](.env)

4. **Security**:
   - Never commit `.env` files
   - Use strong MongoDB passwords
   - Configure firewall rules
   - Keep Docker images updated

## Troubleshooting

### Container Not Starting?
```bash
docker compose ps
docker compose logs nextjs
```

### Port Already in Use?
```bash
# Check what's using port 443
sudo lsof -i :443

# Or change ports in docker-compose.yml
```

### Database Connection Issues?
```bash
# Check MongoDB is running
docker exec -it solo-leveling-mongodb mongosh

# View MongoDB logs
docker logs solo-leveling-mongodb
```

### SSL Certificate Issues?
```bash
# Regenerate certificates
./generate-ssl.sh
docker compose restart nginx
```

## Monitoring

### Check Container Health
```bash
docker compose ps
```

### View Resource Usage
```bash
docker stats
```

### Access MongoDB Shell
```bash
docker exec -it solo-leveling-mongodb mongosh
```

## Backup & Restore

### Backup Database
```bash
docker exec solo-leveling-mongodb mongodump \
  --out=/data/backup \
  --db=solo-leveling
```

### Restore Database
```bash
docker exec solo-leveling-mongodb mongorestore \
  --db=solo-leveling \
  /data/backup/solo-leveling
```

Your Solo Leveling Progress Tracker is now running in production mode with HTTPS! 🎉

Access it at: **https://localhost**
