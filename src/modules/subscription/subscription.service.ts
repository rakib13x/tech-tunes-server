import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../builder";
import { AppError } from "../../errors";

import Payment from "../payment/payment.model";
import {
  generateUniqueTransactionId,
  initiatePayment,
} from "../payment/payment.utils";
import User from "../user/user.model";
import { SUBSCRIPTION_STATUS } from "./subscription.constant";
import { ISubscription } from "./subscription.interface";
import Subscription from "./subscription.model";

const subscribe = async (userData: JwtPayload, payload: ISubscription) => {
  const currentLoggedInUser = await User.findOne({ email: userData.email });

  if (!currentLoggedInUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if the user is deleted
  if (currentLoggedInUser.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is already deleted");
  }

  // Check if the user is blocked
  if (currentLoggedInUser.status === "Blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
  }

  // Check if the user is already a premium user
  if (currentLoggedInUser.isPremiumUser) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "User is already a premium member",
    );
  }
  //@ts-ignore
  payload.user = currentLoggedInUser._id;

  // Check if there is an existing subscription with a failed or canceled status
  let subscription = await Subscription.findOne({
    user: currentLoggedInUser._id,
    status: {
      $in: [
        SUBSCRIPTION_STATUS.PENDING,
        SUBSCRIPTION_STATUS.CANCELED,
        SUBSCRIPTION_STATUS.EXPIRED,
      ],
    },
  });

  const transactionId = await generateUniqueTransactionId();
  payload.transactionId = transactionId;

  const checkoutDetails = await initiatePayment({
    customerName: currentLoggedInUser.fullName,
    customerEmail: currentLoggedInUser.email,
    customerPhone: currentLoggedInUser?.phone || "N/A",
    address: currentLoggedInUser.location || "N/A",
    amount: payload.price.toString(),
    currency: payload.currency,
    transactionId: transactionId,
  });

  const paymentData = {
    transactionId,
    user: currentLoggedInUser._id,
    paymentMethod: payload.paymentMethod,
    currency: payload.currency,
    amount: payload.price,
  };

  const session = await Subscription.startSession();

  try {
    session.startTransaction();

    // If subscription exists, update it
    if (subscription) {
      subscription = await Subscription.findOneAndUpdate(
        { _id: subscription._id },
        {
          ...payload,
          status: SUBSCRIPTION_STATUS.PENDING, // Reset status for new payment attempt
        },
        { session, new: true, runValidators: true },
      );
    } else {
      // If no previous failed/canceled subscription, create a new one
      const createdSubscription = await Subscription.create([{ ...payload }], {
        session,
      });

      if (!createdSubscription || createdSubscription.length < 1) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Failed to create subscription",
        );
      }

      subscription = createdSubscription[0]; // Use the newly created subscription
    }

    // Create payment for the subscription
    const payment = await Payment.create(
      [{ ...paymentData, subscription: subscription?._id }],
      { session },
    );

    if (!payment || payment.length < 1) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create payment");
    }

    await session.commitTransaction();
    session.endSession();

    return checkoutDetails;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// get all subscriptions (admin only)
const getAllSubscriptions = async (query: Record<string, unknown>) => {
  const paymentQuery = new QueryBuilder(
    Subscription.find({}).populate("user"),
    query,
  );

  // Await the filter() method
  await paymentQuery.filter();

  // Now you can safely call sort, paginate, and fields
  paymentQuery.sort().paginate().fields();

  const result = await paymentQuery.modelQuery;
  const meta = await paymentQuery.countTotal();

  return { result, meta };
};

export const subscriptionService = {
  subscribe,
  getAllSubscriptions,
};
