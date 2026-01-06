import { NextRequest, NextResponse } from 'next/server';
import { requireSystemDesigner } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireSystemDesigner();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    // If collection is specified, return its data
    if (collection) {
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Database connection not established');
      }

      const collectionObj = db.collection(collection);
      const total = await collectionObj.countDocuments();
      const documents = await collectionObj.find({}).skip(skip).limit(limit).toArray();

      return NextResponse.json({
        collection,
        total,
        documents,
        skip,
        limit,
      });
    }

    // Otherwise, list all collections
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const collections = await db.listCollections().toArray();
    const collectionsWithCounts = await Promise.all(
      collections.map(async (col) => {
        const count = await db.collection(col.name).countDocuments();
        return {
          name: col.name,
          count,
        };
      })
    );

    return NextResponse.json({
      collections: collectionsWithCounts,
    });
  } catch (error) {
    console.error('Database browser error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to browse database' },
      { status: 403 }
    );
  }
}
