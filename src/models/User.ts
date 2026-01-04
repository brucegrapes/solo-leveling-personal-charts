import mongoose, { Schema, Document, Model } from 'mongoose';

export enum UserRole {
  PLAYER = 'Player',
  SYSTEM_DESIGNER = 'System Designer',
}

export interface IUser extends Document {
  username: string;
  password: string;
  email?: string;
  role: UserRole;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.PLAYER,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes
UserSchema.index({ username: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
