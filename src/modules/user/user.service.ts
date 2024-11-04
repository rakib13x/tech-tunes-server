import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../builder";
import { AppError } from "../../errors";
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

export const userService = {
  getAllUsers,
  getSingleUserByUsername,
  updateProfile,
};
