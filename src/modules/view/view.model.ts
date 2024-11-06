import { model, Schema } from "mongoose";
import { IView } from "./view.interface";

const viewSchema = new Schema<IView>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post Id is required"],
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

viewSchema.index({ post: 1, user: 1 }, { unique: true });

const View = model<IView>("View", viewSchema);

export default View;
