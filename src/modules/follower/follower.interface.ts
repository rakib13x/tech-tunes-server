import { Document, Types } from "mongoose";

export interface IFollower extends Document {
  follower: Types.ObjectId;
  following: Types.ObjectId;
  followedAt: Date;
}
