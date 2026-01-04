import mongoose, { Schema, Document, Model } from 'mongoose';
import { ActivityData, UserStats } from '@/types';

export interface IPlayer extends Document {
  userId: string;
  activityData: ActivityData;
  userStats: UserStats;
  updatedAt: Date;
}

const PlayerSchema: Schema<IPlayer> = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  activityData: {
    type: Schema.Types.Mixed,
    default: {},
  },
  userStats: {
    level: {
      type: Number,
      default: 1,
    },
    experience: {
      type: Number,
      default: 0,
    },
    totalTasks: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: 'E-Rank Hunter',
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes
PlayerSchema.index({ userId: 1 });

const Player: Model<IPlayer> = mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema);

export default Player;
