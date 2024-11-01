import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { QueryBuilder } from "../../builder";
import { AppError } from "../../errors";
import Category from "../category/category.model";
import { IComment } from "../comment/comment.interface";
import User from "../user/user.model";
import { searchablePostFields } from "./post.constant";
import { IPost } from "./post.interface";
import Post from "./post.model";
import { generateUniqueSlugForPost } from "./post.utils";

const createPost = async (userData: JwtPayload, postDetails: IPost) => {
  const user = await User.findOne({ email: userData.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!user.isPremiumUser && postDetails.isPremium) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only premium users can post premium content, please upgrade your membership",
    );
  }

  const category = await Category.findById(postDetails.category);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  postDetails.author = user._id;
  postDetails.category = category._id;

  postDetails.slug = await generateUniqueSlugForPost(
    postDetails.title,
    user.username,
  );

  const session = await Post.startSession();

  try {
    session.startTransaction();

    const newPost = await Post.create([postDetails], { session });
    if (newPost.length < 1) {
      throw new AppError(httpStatus.BAD_REQUEST, "Post creation failed");
    }

    await Category.findByIdAndUpdate(
      category._id,
      { $inc: { postCount: 1 } },
      { session },
    );
    await User.findByIdAndUpdate(
      user._id,
      { $inc: { totalPosts: 1 } },
      { session },
    );

    await session.commitTransaction();
    await session.endSession();

    return (
      await newPost[0].populate(
        "author",
        "fullName email username profilePicture",
      )
    ).populate("category", "name description postCount");
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

const fetchPosts = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(
    Post.find({}).populate("author").populate("category"),
    query,
  ).search(searchablePostFields);

  await postQuery.filter();

  postQuery.sort().paginate().fields();

  const posts = await postQuery.modelQuery;
  const meta = await postQuery.countTotal();

  return { posts, meta };
};

const commentOnPost = async (
  userData: JwtPayload,
  postId: string,
  payload: IComment,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find the current logged-in user
    const currentLoggedInUser = await User.findOne({
      email: userData.email,
    }).session(session);

    if (!currentLoggedInUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Fetch the post by its ID
    const post = await Post.findById(postId).session(session);
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, "Post not found");
    }

    // Create a new comment
    const comment = await Comment.create(
      [
        {
          ...payload,
          user: currentLoggedInUser._id,
          post: post._id,
        },
      ],
      { session },
    );

    // Increment the totalComments field on the post
    post.totalComments += 1;
    await post.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Find and populate the comment with specific fields from user and post
    return await Comment.findById(comment[0]._id)
      .populate({
        path: "user",
        select: "fullName email profilePicture",
      })
      .populate({
        path: "post",
        select: "title category slug",
      });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const postService = {
  createPost,
  fetchPosts,
  commentOnPost,
};
