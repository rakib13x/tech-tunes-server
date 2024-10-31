import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { AppError } from "../errors";

import { TUserRole } from "../modules/user/user.interface";
import User from "../modules/user/user.model";
import { catchAsync, sendResponse } from "../utils";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        message: "Unauthorized Access",
        data: undefined,
      });
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_token_secret as string,
    ) as JwtPayload;

    const { email, role, iat } = decoded;

    // check the use is exists or not
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // check the user is already deleted
    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "User is already deleted");
    }

    // check the is user status
    if (user.status === "Blocked") {
      throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
    }

    // check if the user password has been changed or not
    if (
      user.passwordChangeAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangeAt,
        iat as number,
      )
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Password has been changed. Please login again.",
      );
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.FORBIDDEN,
        message: "Access Forbidden",
        data: undefined,
      });
    }

    req.user = decoded;
    next();
  });
};

export default auth;
