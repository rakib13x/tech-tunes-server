import { model, Schema } from "mongoose";
import { IVote } from "./vote.interface";

const voteSchema = new Schema<IVote>(
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
    type: {
      type: String,
      enum: ["upvote", "downvote"],
      required: [true, "Vote type is required"],
    },
  },
  { timestamps: true },
);

// Ensure a user can vote on a post only once (either upvote or downvote)
// voteSchema.index({ post: 1, user: 1 }, { unique: true });

const Vote = model<IVote>("Vote", voteSchema);
export default Vote;
