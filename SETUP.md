# Database & Authentication Setup Guide

## 🔐 Authentication & Cloud Database

Your app now has secure authentication and cloud database storage! You can access your data from any device.

## Quick Setup Options

### Option 1: Docker MongoDB (Recommended - Easiest Local Setup)

1. **Install Docker** (if not already installed)
   - Ubuntu/Debian: `sudo apt-get install docker.io docker-compose`
   - macOS: Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
   - Windows: Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)

2. **Start MongoDB Container**
   ```bash
   npm run docker:up
   ```
   This will:
   - Pull MongoDB 7.0 image
   - Start MongoDB on port 27017
   - Create persistent data volumes
   - Run in background

3. **Update .env.local** (already configured for Docker MongoDB)
   ```bash
   MONGODB_URI=mongodb://localhost:27017/solo-leveling
   NEXTAUTH_SECRET=change-this-to-a-random-secret-key-at-least-32-characters-long
   NEXTAUTH_URL=http://localhost:2026
   ```

4. **Stop MongoDB when done** (optional)
   ```bash
   npm run docker:down
   ```

### Option 2: MongoDB Atlas (Cloud - Free & Access Anywhere)

1. **Create MongoDB Atlas Account** (Free Tier)
   - Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" M0 cluster
   - Select a cloud provider & region close to you
   - Click "Create"

3. **Setup Database Access**
   - Go to "Database Access" in sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and strong password (save these!)
   - Set "Database User Privileges" to "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**
   - Go to "Network Access" in sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for now)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/...`)

6. **Update .env.local**
   ```bash
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/solo-leveling?retryWrites=true&w=majority
   NEXTAUTH_SECRET=your-very-secret-random-key-at-least-32-characters-long
   NEXTAUTH_URL=http://localhost:2026
   ```
   - Replace `your-username` and `your-password` with credentials from step 3
   - Replace `your-cluster` with your actual cluster name
   - Generate a random secret for NEXTAUTH_SECRET (use a password generator)

### Option 3: Local MongoDB (Manual Installation)

1. **Install MongoDB Locally**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb
   
   # macOS
   brew install mongodb-community
   ```

2. **Start MongoDB**
   ```bash
   sudo systemctl start mongodb  # Ubuntu/Debian
   brew services start mongodb-community  # macOS
   ```

3. **Update .env.local**
   ```bash
   MONGODB_URI=mongodb://localhost:27017/solo-leveling
   NEXTAUTH_SECRET=your-very-secret-random-key-at-least-32-characters-long
   NEXTAUTH_URL=http://localhost:2026
   ```

## 🚀 Running the App

1. **Install dependencies** (if not done already):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   - Navigate to [http://localhost:2026](http://localhost:2026)
   - You'll be redirected to the sign-in page

4. **Create your account**:
   - Click "Register"
   - Choose a username and password
   - Start tracking your progress!

## 🐳 Docker Commands

```bash
# Start MongoDB
npm run docker:up

# Stop MongoDB
npm run docker:down

# View MongoDB logs
docker logs solo-leveling-mongodb

# Access MongoDB shell
docker exec -it solo-leveling-mongodb mongosh

# Remove all data (fresh start)
docker-compose down -v
```

## 🌍 Deploy to Production

### Deploy to Vercel (Recommended)

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com)

3. Import your repository

4. Add environment variables in Vercel dashboard:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `NEXTAUTH_SECRET` - Your secret key
   - `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)

5. Deploy!

Now you can access your progress tracker from any device, anywhere! 🎉

## 🔒 Security Notes

- **Never commit .env.local** to git (it's already in .gitignore)
- **Use strong passwords** for your database and user accounts
- **Change NEXTAUTH_SECRET** to a random, secure value
- For production, restrict MongoDB network access to your deployment IP

## 📱 Multi-Device Access

Once deployed:
- Access from phone, tablet, laptop, work computer
- All data syncs automatically to the cloud
- Secure login protects your progress
- Journal entries and activity data are private to your account

## Features

✅ Secure authentication with username/password  
✅ Cloud database storage (MongoDB)  
✅ Access from any device  
✅ Automatic data synchronization  
✅ Protected routes with middleware  
✅ Encrypted passwords (bcrypt)  
✅ Session management (JWT)  

Start your leveling journey from anywhere! 🔥
