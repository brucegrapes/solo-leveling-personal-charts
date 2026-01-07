import mongoose, { Schema, Document, Model } from 'mongoose';
import { ActivityData, UserStats } from '@/types';

export interface IPlayer extends Document {
  userId: string;
  activityData: ActivityData;
  userStats: UserStats;
  lifetimeXP: number;
  weeklyXP: number;
  monthlyXP: number;
  weekStartDate: Date;
  monthStartDate: Date;
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
  lifetimeXP: {
    type: Number,
    default: 0,
  },
  weeklyXP: {
    type: Number,
    default: 0,
  },
  monthlyXP: {
    type: Number,
    default: 0,
  },
  weekStartDate: {
    type: Date,
    default: () => {
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
      return new Date(now.setDate(diff));
    },
  },
  monthStartDate: {
    type: Date,
    default: () => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), 1);
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes for efficient leaderboard queries
PlayerSchema.index({ userId: 1 });
PlayerSchema.index({ lifetimeXP: -1 }); // All-time leaderboard
PlayerSchema.index({ weeklyXP: -1 }); // Weekly leaderboard
PlayerSchema.index({ monthlyXP: -1 }); // Monthly leaderboard
PlayerSchema.index({ 'userStats.currentStreak': -1 }); // Streak leaderboard

const Player: Model<IPlayer> = mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema);

export default Player;
