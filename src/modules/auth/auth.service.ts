import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { AppError } from "../../errors";
import { IUser } from "../user/user.interface";
import User from "../user/user.model";

const register = async (payload: IUser) => {
  const existedEmail = await User.findOne({
    email: payload.email,
  })
    .lean()
    .setOptions({ bypassMiddleware: true });

  if (existedEmail) {
    if (existedEmail.isDeleted) {
      throw new AppError(
        409,
        "Email linked to a deleted account. Recover or try a different email.",
      );
    }
    throw new AppError(409, "User already registered");
  }

  const existedUsername = await User.findOne({ username: payload.username })
    .lean()
    .setOptions({ bypassMiddleware: true });
  if (existedUsername) {
    if (existedUsername.isDeleted) {
      throw new AppError(
        409,
        "Username linked to a deleted account. Recover or try a different username.",
      );
    }
    throw new AppError(409, "Username already exists");
  }

  const newUser = await User.create(payload);

  // generate jwt verify token
  const jwtPayload = {
    email: newUser.email,
    role: newUser.role,
  };

  const verifyToken = User.createToken(
    jwtPayload,
    config.jwt_reset_password_secret as string,
    config.jwt_reset_password_expires_in as string,
  );
};

const login = async (payload: IUser) => {
  const user = await User.findOne({ email: payload.email }).select("+password");

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (!user.password) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect credentials");
    // throw new AppError(
    //   httpStatus.UNAUTHORIZED,
    //   "User register or logged in by social account",
    // );
  }

  if (!(await User.isPasswordMatch(payload.password, user.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect credentials");
  }

  if (user.status === "Blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
  }

  const jwtPayload = {
    _id: user._id,
    profilePicture: user.profilePicture,
    username: user.username,
    name: user.fullName,
    email: user.email,
    role: user.role,
    isPremiumUser: user.isPremiumUser,
  };

  const accessToken = User.createToken(
    jwtPayload,
    config.jwt_access_token_secret as string,
    config.jwt_access_token_expires_in as string,
  );

  const refreshToken = User.createToken(
    jwtPayload,
    config.jwt_refresh_token_secret as string,
    config.jwt_refresh_token_expires_in as string,
  );

  return { accessToken, refreshToken };
};

// const socialLogin = async (payload: IUser) => {
//   let user = await User.findOne({ email: payload.email });
//   if (!user) {
//     // create a new user (if not found the user by email)
//     payload.username = payload.fullName.toLowerCase().split(" ").join("");
//     user = await register(payload);
//   }
//   const jwtPayload = {
//     _id: user._id,
//     profilePicture: user.profilePicture,
//     username: user.username,
//     name: user.fullName,
//     email: user.email,
//     role: user.role,
//     isPremiumUser: user.isPremiumUser,
//   };

//   const accessToken = User.createToken(
//     jwtPayload,
//     config.jwt_access_token_secret as string,
//     config.jwt_access_token_expires_in as string,
//   );

//   const refreshToken = User.createToken(
//     jwtPayload,
//     config.jwt_refresh_token_secret as string,
//     config.jwt_refresh_token_expires_in as string,
//   );

//   return { accessToken, refreshToken };
// };

// get me (current logged in user)
const getMe = async (payload: JwtPayload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

// change-password
const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.findOne({ email: userData.email }).select(
    "+password",
  );

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

  // check the password is correct
  const isPasswordMatch = await User.isPasswordMatch(
    payload.oldPassword,
    user?.password,
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password did not match");
  }

  // hash new password
  const newHashedPassword = await User.generateHashPassword(
    payload.newPassword,
  );

  return await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangeAt: new Date(),
    },
    { new: true, runValidators: true },
  );
};

// forget password
const forgetPassword = async (email: string) => {
  // check the user is exist
  const user = await User.findOne({ email });
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

  // generate jwt token
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const resetToken = User.createToken(
    jwtPayload,
    config.jwt_reset_password_secret as string,
    config.jwt_reset_password_expires_in as string,
  );

  // generate reset link
  const resetUILink = `${config.reset_password_ui_url}?email=${user?.email}&token=${resetToken}`;

  // send reset link to user email

  // eslint-disable-next-line no-console
  console.log(`Password reset link sent to ${user.email}`);
};

// reset password
const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  // check the use is exist or not
  const user = await User.findOne({ email: payload.email });
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

  const decoded = User.verifyToken(
    token,
    config.jwt_reset_password_secret as string,
  );

  if (payload.email !== decoded.email) {
    throw new AppError(httpStatus.FORBIDDEN, "Access forbidden");
  }

  // generate new password
  const newHashedPassword = await User.generateHashPassword(
    payload.newPassword,
  );

  return await User.findOneAndUpdate(
    {
      email: decoded.email,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      passwordChangeAt: new Date(),
    },
    {
      new: true,
      runValidators: true,
    },
  );
};

// generate access token using refresh token
const generateNewAccessToken = async (refreshToken: string) => {
  const decoded = User.verifyToken(
    refreshToken,
    config.jwt_refresh_token_secret as string,
  );

  // check the use is exist or not
  const user = await User.findOne({ email: decoded.email });
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

  if (
    user.passwordChangeAt &&
    User.isJWTIssuedBeforePasswordChanged(
      user.passwordChangeAt,
      decoded.iat as number,
    )
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
  }

  const jwtPayload = {
    _id: user._id,
    profilePicture: user.profilePicture,
    username: user.username,
    name: user.fullName,
    email: user.email,
    role: user.role,
    isPremiumUser: user.isPremiumUser,
  };

  const accessToken = User.createToken(
    jwtPayload,
    config.jwt_access_token_secret as string,
    config.jwt_access_token_expires_in as string,
  );

  return accessToken;
};

export const authService = {
  register,
  login,
  getMe,
  changePassword,
  forgetPassword,
  resetPassword,
  generateNewAccessToken,
};
