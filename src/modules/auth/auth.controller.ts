import httpStatus from "http-status";
import config from "../../config";
import { AppError } from "../../errors";
import { catchAsync, sendResponse } from "../../utils";
import { authService } from "./auth.service";

const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Registered successfully",
    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await authService.login(req.body);

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 60 * 365,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Logged in successfully",
    data: { accessToken, refreshToken },
  });
});
const socialLogin = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await authService.socialLogin(req.body);

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 60 * 365,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Logged in successfully",
    data: { accessToken, refreshToken },
  });
});

// get me (current logged in user)
const getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User fetched successfully",
    data: user,
  });
});

// change password (current logged in user)
const changePassword = catchAsync(async (req, res) => {
  const result = await authService.changePassword(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

// forget password
const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgetPassword(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset link sent successfully",
    data: result,
  });
});

// reset password
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) {
    throw new AppError(httpStatus.FORBIDDEN, "Access Forbidden");
  }
  const result = await authService.resetPassword(req.body, token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully",
    data: result,
  });
});

// generate access token via refresh token
const generateNewAccessToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const newAccessToken = await authService.generateNewAccessToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token retrieved successfully",
    data: { token: newAccessToken },
  });
});

export const authController = {
  register,
  login,
  getMe,
  changePassword,
  forgetPassword,
  resetPassword,
  generateNewAccessToken,
  socialLogin
};
