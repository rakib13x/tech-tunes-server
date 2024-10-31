import httpStatus from "http-status";
import config from "../../config";
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

export const authController = {
  register,
  login,
};
