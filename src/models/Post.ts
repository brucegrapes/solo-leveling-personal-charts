import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  userLevel: number;
  userTitle: string;
  content?: string;
  images: string[]; // Array of MinIO URLs
  videos: string[]; // Array of MinIO URLs
  mediaUrl: string; // Legacy field for backward compatibility
  mediaType: 'image' | 'video'; // Legacy field
  fileSize: number;
  mimeType: string;
  likes: mongoose.Types.ObjectId[];
  comments: {
    userId: mongoose.Types.ObjectId;
    username: string;
    content: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
    },
    userLevel: {
      type: Number,
      required: true,
      default: 1,
    },
    userTitle: {
      type: String,
      required: true,
      default: 'E-Rank Hunter',
    },
    content: {
      type: String,
      maxlength: 1000,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    videos: {
      type: [String],
      default: [],
    },
    mediaUrl: {
      type: String,
      required: false, // Make optional for backward compatibility
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      required: false, // Make optional for backward compatibility
    },
    fileSize: {
      type: Number,
      required: true,
      max: 20 * 1024 * 1024, // 20MB in bytes
    },
    mimeType: {
      type: String,
      required: true,
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    comments: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
        maxlength: 500,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
PostSchema.index({ createdAt: -1 });
PostSchema.index({ userId: 1, createdAt: -1 });

// Method to check if a user has liked the post
PostSchema.methods.isLikedBy = function(userId: mongoose.Types.ObjectId): boolean {
  return this.likes.some((id: mongoose.Types.ObjectId) => id.equals(userId));
};

// Static method to count user posts for a specific day
PostSchema.statics.countUserPostsToday = async function(userId: mongoose.Types.ObjectId): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.countDocuments({
    userId,
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });
};

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
