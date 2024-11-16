import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils";
import { userService } from "./user.service";

// get all users (admin only)
const getAllUsers = catchAsync(async (req, res) => {
  const { result, meta } = await userService.getAllUsers(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All users retrieved successfully",
    meta,
    data: result,
  });
});

const getSingleUserByUsername = catchAsync(async (req, res) => {
  const { username } = req.params;
  const result = await userService.getSingleUserByUsername(username);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const result = await userService.updateProfile(req.user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile updated successfully",
    data: result,
  });
});

// update user profile social links
const updateSocialLinks = catchAsync(async (req, res) => {
  const result = await userService.updateSocialLinks(req.user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User social links updated successfully",
    data: result,
  });
});

// block user (only admin)
const blockUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await userService.blockUser(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User blocked successfully",
    data: result,
  });
});

// unblock user (only admin)
const unBlockUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await userService.unBlockUser(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User unblock successfully",
    data: result,
  });
});

// make a user to admin (admin only)
const makeAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await userService.makeAdmin(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User role updated successfully: User is now an Admin.",
    data: result,
  });
});

// delete user account (admin only)
const deleteUserAccount = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await userService.deleteUserAccount(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User account deleted successfully",
    data: result,
  });
});

// follow user
const followUser = catchAsync(async (req, res) => {
  const { id } = req.params; // user id want's to follow
  const result = await userService.followUser(req.user, id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully followed the user",
    data: result,
  });
});

// unfollow user
const unfollowUser = catchAsync(async (req, res) => {
  const { id } = req.params; // user id want's to follow
  const result = await userService.unfollowUser(req.user, id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully unfollowed the user",
    data: result,
  });
});

// get follow status
const getFollowStatus = catchAsync(async (req, res) => {
  const { id } = req.params; // user id want's to follow
  const isFollowing = await userService.getFollowStatus(req.user, id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Follow status retrieved successfully",
    data: { isFollowing },
  });
});

// get current logged in user followers
const getLoggedInUserFollowers = catchAsync(async (req, res) => {
  const { result, meta } = await userService.getLoggedInUserFollowers(
    req.user,
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Followers retrieved successfully",
    meta,
    data: result,
  });
});

// get current logged in user following
const getLoggedInUserFollowing = catchAsync(async (req, res) => {
  const { result, meta } = await userService.getLoggedInUserFollowing(
    req.user,
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Following retrieved successfully",
    meta,
    data: result,
  });
});

// get followers by user id
const getFollowersByUserId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { result, meta } = await userService.getFollowersByUserId(
    id,
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Followers retrieved successfully",
    meta,
    data: result,
  });
});

// get following by user id
const getFollowingByUserId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { result, meta } = await userService.getFollowingByUserId(
    id,
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Following retrieved successfully",
    meta,
    data: result,
  });
});

export const userController = {
  getAllUsers,
  updateProfile,
  updateSocialLinks,
  blockUser,
  unBlockUser,
  followUser,
  unfollowUser,
  getLoggedInUserFollowers,
  getLoggedInUserFollowing,
  getFollowersByUserId,
  getFollowingByUserId,
  getSingleUserByUsername,
  getFollowStatus,
  makeAdmin,
  deleteUserAccount,
};
