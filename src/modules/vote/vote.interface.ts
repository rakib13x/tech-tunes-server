import { Document, Types } from "mongoose";

export type TVoteType = "upvote" | "downvote";

export interface IVote extends Document {
  user: Types.ObjectId;
  post: Types.ObjectId;
  type: TVoteType;
}
