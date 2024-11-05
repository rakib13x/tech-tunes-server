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

export const userController = {
  getAllUsers,
  getSingleUserByUsername,
  updateProfile,
  followUser,
  unfollowUser,
};
