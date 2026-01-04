#!/bin/sh
set -e

echo "Waiting for MongoDB to be ready..."
# Wait for MongoDB to be available
until node -e "const { MongoClient } = require('mongodb'); const client = new MongoClient(process.env.MONGODB_URI); client.connect().then(() => { console.log('MongoDB connected'); client.close(); }).catch(() => process.exit(1));" 2>/dev/null; do
  echo "MongoDB is unavailable - sleeping"
  sleep 2
done

echo "MongoDB is up - running migrations..."
# Install migrate-mongo if needed (it's in node_modules from build)
npx migrate-mongo up || echo "Migrations completed or already applied"

echo "Starting application..."
exec "$@"
