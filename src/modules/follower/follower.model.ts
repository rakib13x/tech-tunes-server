import { model, Schema } from "mongoose";
import { IFollower } from "./follower.interface";

const followerSchema = new Schema<IFollower>(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Create a unique index to prevent duplicate follow relationships
// followerSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follower = model<IFollower>("Follower", followerSchema);
export default Follower;
