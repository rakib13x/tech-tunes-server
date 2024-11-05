import { Document, Types } from "mongoose";

export type ContentTypeEnum = "html" | "markdown" | "text";

export interface IPost extends Document {
  author: Types.ObjectId;
  title: string;
  slug: string;
  contentType: ContentTypeEnum;
  content: string;
  coverImage: string;
  images: string[];
  category: Types.ObjectId;
  tags: string[];
  isPremium: boolean;
  upVotes: number;
  downVotes: number;
  totalViews: number;
  totalComments: number;
  isDeleted: boolean;
}
