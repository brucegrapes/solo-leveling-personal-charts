import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscription extends Document {
  endpoint: string;
  p256dh: string;
  auth: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema<ISubscription> = new Schema({
  endpoint: {
    type: String,
    required: true,
    unique: true,
  },
  p256dh: {
    type: String,
    required: true,
  },
  auth: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    index: true,
  },
}, {
  timestamps: true,
});

// Create indexes
SubscriptionSchema.index({ endpoint: 1 });
SubscriptionSchema.index({ userId: 1 });

const Subscription: Model<ISubscription> = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;