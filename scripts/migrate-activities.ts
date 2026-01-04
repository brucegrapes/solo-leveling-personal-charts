/**
 * Migration Script: Migrate legacy activity IDs to new game-themed names
 * 
 * This script updates the MongoDB database to convert old activity IDs to new ones:
 * - gym -> strength
 * - books -> knowledge  
 * - office -> productivity
 * - mental -> mind
 * - coolness -> coolness (no change)
 * - notes -> notes (no change)
 * 
 * Usage: 
 *   Development: npm run migrate
 *   Production (Docker): Run inside Docker container or use:
 *     MONGODB_URI=mongodb://localhost:27017/solo-leveling npm run migrate:prod
 * 
 * For Docker deployments, you can run this via:
 *   docker exec -it <container_name> npm run migrate
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables (can be overridden by passing MONGODB_URI directly)
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Also load .env as fallback
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const LEGACY_ACTIVITY_MAP: Record<string, string> = {
  'gym': 'strength',
  'books': 'knowledge',
  'office': 'productivity',
  'mental': 'mind',
  // These stay the same
  'coolness': 'coolness',
  'notes': 'notes',
};

async function migrateActivities() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    console.error(`   Looked for ${envFile}`);
    process.exit(1);
  }

  console.log(`🚀 Starting migration...`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Connecting to MongoDB...`);

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const Player = mongoose.model('Player');

    // Get all player data documents
    const users = await Player.find({}).lean();
    console.log(`📊 Found ${users.length} user(s) to migrate`);

    let totalMigrated = 0;
    let totalSkipped = 0;

    for (const user of users) {
      const userId = (user as any).userId;
      const activityData = (user as any).activityData || {};
      let hasChanges = false;
      const migratedActivityData: Record<string, Record<string, any>> = {};

      console.log(`\n👤 Processing user: ${userId}`);

      // Process each date's data
      for (const [date, dayData] of Object.entries(activityData)) {
        const migratedDayData: Record<string, any> = {};
        const originalDayData = dayData as Record<string, any>;

        for (const [key, value] of Object.entries(originalDayData)) {
          // Check if this is a legacy activity ID that needs migration
          if (LEGACY_ACTIVITY_MAP[key] && LEGACY_ACTIVITY_MAP[key] !== key) {
            const newKey = LEGACY_ACTIVITY_MAP[key];
            migratedDayData[newKey] = value;
            // Also keep the old key for backward compatibility during transition
            migratedDayData[key] = value;
            hasChanges = true;
            console.log(`   📅 ${date}: ${key} -> ${newKey}`);
          } else {
            // Keep unchanged
            migratedDayData[key] = value;
          }
        }

        migratedActivityData[date] = migratedDayData;
      }

      if (hasChanges) {
        // Update the document
        await Player.updateOne(
          { userId },
          {
            $set: {
              activityData: migratedActivityData,
              migratedAt: new Date(),
              migrationVersion: '2.0-game-themed-activities',
            },
          }
        );
        totalMigrated++;
        console.log(`   ✅ User ${userId} migrated successfully`);
      } else {
        totalSkipped++;
        console.log(`   ⏭️  User ${userId} - no changes needed`);
      }
    }

    console.log(`\n📈 Migration Summary:`);
    console.log(`   - Users migrated: ${totalMigrated}`);
    console.log(`   - Users skipped (no changes): ${totalSkipped}`);
    console.log(`   - Total processed: ${users.length}`);
    console.log(`\n✅ Migration completed successfully!`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the migration
migrateActivities();
