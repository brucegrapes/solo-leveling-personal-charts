import mongoose, { Schema, Document, Model } from 'mongoose';
import type { UserConfig as ISettingsType } from '@/types';

export interface ISettings extends Document {
  userId: string;
  config: ISettingsType;
  updatedAt: Date;
}

const SettingsSchema: Schema<ISettings> = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  config: {
    type: Schema.Types.Mixed,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes
SettingsSchema.index({ userId: 1 });

const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
