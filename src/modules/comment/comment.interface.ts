import { Document, Types } from "mongoose";

export interface IComment extends Document {
  post: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  isDeleted: boolean;
  images?: string[];
  upVotes?: number;
  downVotes?: number;
}
