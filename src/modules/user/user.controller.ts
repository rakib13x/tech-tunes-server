import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils";
import { userService } from "./user.service";

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
export const userController = {
  getAllUsers,
  getSingleUserByUsername,
  updateProfile,
  followUser,
  unfollowUser,
  makeAdmin,
  unBlockUser,
  blockUser,
  updateSocialLinks
};
