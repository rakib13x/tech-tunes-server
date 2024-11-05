import { Document, Types } from "mongoose";

export interface IView extends Document {
  user: Types.ObjectId;
  post: Types.ObjectId;
  viewedAt: Date;
}
