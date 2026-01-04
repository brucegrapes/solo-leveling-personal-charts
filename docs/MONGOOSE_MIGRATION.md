# Mongoose Migration Guide

## Overview

The codebase has been migrated from using the native MongoDB driver to Mongoose for better schema validation, type safety, and easier data modeling.

## What Changed

### 1. Database Connection

**Before** ([lib/mongodb.ts](../src/lib/mongodb.ts)):
```typescript
import { MongoClient } from 'mongodb';
const client = await getDatabase();
const db = client.db('solo-leveling');
```

**After**:
```typescript
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
await connectDB();
```

### 2. Models Created

Three Mongoose models have been created in the `src/models/` directory:

#### User Model ([models/User.ts](../src/models/User.ts))
- `username`: String (required, unique, min 3 chars)
- `password`: String (required)
- `email`: String (optional)
- `createdAt`: Date (default: now)

#### Player Model ([models/Player.ts](../src/models/Player.ts))
- `userId`: String (required, unique)
- `activityData`: Mixed (default: {})
- `userStats`: Object with level, experience, totalTasks, currentStreak, title
- `updatedAt`: Date (default: now)

#### Settings Model ([models/Settings.ts](../src/models/Settings.ts))
- `userId`: String (required, unique)
- `config`: Mixed (required)
- `updatedAt`: Date (default: now)

### 3. API Routes Updated

All API routes have been updated to use Mongoose models:

- [api/activities/route.ts](../src/app/api/activities/route.ts)
- [api/settings/route.ts](../src/app/api/settings/route.ts)
- [api/auth/register/route.ts](../src/app/api/auth/register/route.ts)
- [lib/auth.ts](../src/lib/auth.ts)

### 4. Migration Script Updated

The activity migration script ([scripts/migrate-activities.ts](../scripts/migrate-activities.ts)) has been updated to use Mongoose.

## Benefits of Mongoose

1. **Schema Validation**: Automatic validation of data before saving
2. **Type Safety**: Better TypeScript integration with typed models
3. **Middleware**: Pre/post hooks for operations
4. **Query Building**: More intuitive query API
5. **Virtuals**: Add computed properties to documents
6. **Plugins**: Extensible with plugins for common functionality

## Usage Examples

### Creating a Document
```typescript
import { User } from '@/models';
await connectDB();

const user = await User.create({
  username: 'hunter',
  password: hashedPassword,
  email: 'hunter@example.com'
});
```

### Finding Documents
```typescript
import { Player } from '@/models';
await connectDB();

// Find one
const playerData = await Player.findOne({ userId: '123' });

// Find many
const allPlayers = await Player.find({});

// With lean() for plain objects
const players = await Player.find({}).lean();
```

### Updating Documents
```typescript
import { Settings } from '@/models';
await connectDB();

// Update one with upsert
await Settings.findOneAndUpdate(
  { userId: '123' },
  { config: newConfig, updatedAt: new Date() },
  { upsert: true, new: true }
);
```

## Migration Checklist

- [x] Install mongoose package
- [x] Create mongoose models (User, Player, Settings)
- [x] Update database connection utility
- [x] Migrate all API routes to use models
- [x] Update authentication logic
- [x] Update migration scripts
- [x] Remove native mongodb driver
- [x] Test all CRUD operations

## Next Steps

1. Add schema validation middleware
2. Implement pre-save hooks for data transformation
3. Add indexes for better query performance
4. Consider adding mongoose plugins (e.g., mongoose-paginate)
5. Add virtual properties for computed fields

## Troubleshooting

### Connection Issues
If you see connection errors, ensure:
- `MONGODB_URI` is set in your environment variables
- MongoDB is running and accessible
- Connection string includes database name

### Model Issues
If models don't update:
- Clear Next.js cache: `rm -rf .next`
- Restart development server
- Check model is imported correctly

### Type Issues
Mongoose includes its own TypeScript types. If you see type errors:
- Remove `@types/mongoose` if installed
- Ensure mongoose version is 6.0.0 or higher
- Check model interfaces extend `Document`

## Resources

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Mongoose TypeScript Guide](https://mongoosejs.com/docs/typescript.html)
- [Next.js with Mongoose](https://github.com/vercel/next.js/tree/canary/examples/with-mongodb-mongoose)
