# Quick Start Guide 🚀

## Access URLs

### 🏠 Local Access
- HTTPS: **https://localhost:2026**
- HTTP: **http://localhost:2025** (redirects to HTTPS)

### 💪 Gym Access (VPN)
- HTTPS: **https://192.168.0.241:2026**
- HTTP: **http://192.168.0.241:2025** (redirects to HTTPS)

## 1. Start Production Server (Docker)
```bash
docker compose up -d
```

## 2. Open Browser
Navigate to one of the URLs above (https://localhost or https://192.168.0.241)

**⚠️ Browser Warning**: You'll see a security warning because we use self-signed SSL certificates.
- Click **"Advanced"**
- Click **"Continue to [address] (unsafe)"** or **"Accept Risk"**
- This is normal and safe for local/VPN usage

## 3. Create Your Account
- Click "Create Account"
- Choose username and password
- Start tracking!

## Features You Can Use Now:

✅ **Check/Uncheck Activities** - Click the checkbox to toggle tasks on/off  
✅ **Write Journal** - Add daily notes in the journal section  
✅ **View Charts** - See hexagon balance, 30-day trends, and totals  
✅ **Browse History** - View any past day's activities and notes  
✅ **Level Up** - Gain XP and unlock titles as you progress  
✅ **Multi-Device Access** - Login from anywhere to see your data  

## Quick Commands:

```bash
# Start production server
docker compose up -d

# Stop server
docker compose down

# View logs
docker compose logs -f

# Restart after changes
docker compose up --build -d

# Fresh start (delete all data)
docker compose down -v && docker compose up -d
```

## Troubleshooting

### Can't access from gym?
1. Ensure VPN is connected to home network
2. Check your IP hasn't changed: `hostname -I`
3. If changed, update `.env` NEXTAUTH_URL and `nginx.conf` server_name

### Containers not starting?
```bash
docker compose ps
docker compose logs
```

## Your Progress is Saved:
- **Cloud Database**: MongoDB running in Docker
- **Automatic Sync**: Every change saves instantly
- **Access Anywhere**: Login from any device
- **Private & Secure**: Encrypted passwords, JWT sessions

Start your journey from E-Rank to Shadow Monarch! ⚔️
