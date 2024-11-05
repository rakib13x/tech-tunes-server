import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { QueryBuilder } from "../../builder";
import { AppError } from "../../errors";
import Follower from "../follower/follower.model";
import { IUser } from "./user.interface";
import User from "./user.model";

// get all users
const getAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find({}), query).search([
    "fullName",
    "email",
    "username",
  ]);

  // Await the filter() method
  await userQuery.filter();

  // Now you can safely call sort, paginate, and fields
  userQuery.sort().paginate().fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return { result, meta };
};

// get single user by username
const getSingleUserByUsername = async (username: string) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

// update user profile
const updateProfile = async (userData: JwtPayload, payload: IUser) => {
  const updatedUser = await User.findOneAndUpdate(
    { email: userData.email },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return updatedUser;
};

// Follow a user with transaction
const followUser = async (userData: JwtPayload, userIdToFollow: string) => {
  const session = await mongoose.startSession(); // Start a session

  try {
    session.startTransaction(); // Start a transaction

    // Find current logged-in user
    const currentLoggedInUser = await User.findOne({
      email: userData.email,
    }).session(session);

    if (!currentLoggedInUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Find the user to follow
    const userToFollow = await User.findById(userIdToFollow).session(session);
    if (!userToFollow) {
      throw new AppError(httpStatus.NOT_FOUND, "User to follow not found");
    }

    // Prevent self-following
    if (currentLoggedInUser._id.equals(userToFollow._id)) {
      throw new AppError(httpStatus.BAD_REQUEST, "You cannot follow yourself");
    }

    // Check if the follow relationship already exists
    const existingFollow = await Follower.findOne({
      follower: currentLoggedInUser._id,
      following: userToFollow._id,
    }).session(session);

    if (existingFollow) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You are already following this user",
      );
    }

    // Create a new follower relationship
    await Follower.create(
      [
        {
          follower: currentLoggedInUser._id,
          following: userToFollow._id,
          followedAt: new Date(),
        },
      ],
      { session },
    );

    // Update totalFollowers for userToFollow
    userToFollow.totalFollowers += 1;
    await userToFollow.save({ session, validateModifiedOnly: true });

    // Update totalFollowing for currentLoggedInUser
    currentLoggedInUser.totalFollowing += 1;
    await currentLoggedInUser.save({ session, validateModifiedOnly: true });

    // Commit the transaction
    await session.commitTransaction();
  } catch (err) {
    // Rollback transaction if any error occurs
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession(); // Always end the session
  }
};

// Unfollow a user with transaction
const unfollowUser = async (userData: JwtPayload, userIdToUnfollow: string) => {
  const session = await mongoose.startSession(); // Start a session

  try {
    session.startTransaction(); // Start a transaction

    // Find the current logged-in user
    const currentLoggedInUser = await User.findOne({
      email: userData.email,
    }).session(session);

    if (!currentLoggedInUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Find the user to unfollow
    const userToUnfollow =
      await User.findById(userIdToUnfollow).session(session);
    if (!userToUnfollow) {
      throw new AppError(httpStatus.NOT_FOUND, "User to unfollow not found");
    }

    // Prevent self-unfollowing
    if (currentLoggedInUser._id.equals(userToUnfollow._id)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You cannot unfollow yourself",
      );
    }

    // Check if the follow relationship exists
    const existingFollow = await Follower.findOne({
      follower: currentLoggedInUser._id,
      following: userToUnfollow._id,
    }).session(session);

    if (!existingFollow) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You are not following this user",
      );
    }

    // Remove the follower relationship
    await Follower.deleteOne({
      follower: currentLoggedInUser._id,
      following: userToUnfollow._id,
    }).session(session);

    // Decrement totalFollowers for userToUnfollow
    userToUnfollow.totalFollowers -= 1;
    await userToUnfollow.save({ session, validateModifiedOnly: true });

    // Decrement totalFollowing for currentLoggedInUser
    currentLoggedInUser.totalFollowing -= 1;
    await currentLoggedInUser.save({ session, validateModifiedOnly: true });

    // Commit the transaction
    await session.commitTransaction();
  } catch (err) {
    // Rollback the transaction if any error occurs
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession(); // Always end the session
  }
};

export const userService = {
  getAllUsers,
  getSingleUserByUsername,
  updateProfile,
  followUser,
  unfollowUser,
};
