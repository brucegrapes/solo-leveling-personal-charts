#!/usr/bin/env node

/**
 * Database Query Helper
 * 
 * Usage: node scripts/db-query.js [collection] [query]
 * Example: node scripts/db-query.js users "{}"
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

const args = process.argv.slice(2);
const collection = args[0] || 'users';
const query = args[1] ? JSON.parse(args[1]) : {};

async function queryDatabase() {
  try {
    console.log(`📡 Connecting to: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const results = await db.collection(collection).find(query).toArray();

    console.log(`📊 Collection: ${collection}`);
    console.log(`🔍 Query: ${JSON.stringify(query)}`);
    console.log(`📝 Found ${results.length} document(s)\n`);

    if (results.length > 0) {
      results.forEach((doc, index) => {
        console.log(`Document ${index + 1}:`);
        console.log(JSON.stringify(doc, null, 2));
        console.log('---');
      });
    } else {
      console.log('No documents found.');
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

queryDatabase();
