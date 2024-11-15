import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils";
import { subscriptionService } from "./subscription.service";

const subscribe = catchAsync(async (req, res) => {
  const result = await subscriptionService.subscribe(req.user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subscription initiate successfully",
    data: result,
  });
});

// get all subscriptions (admin only)
const getAllSubscriptions = catchAsync(async (req, res) => {
  const { result, meta } = await subscriptionService.getAllSubscriptions(
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subscriptions retrieved successfully",
    meta,
    data: result,
  });
});

export const subscriptionController = {
  subscribe,
  getAllSubscriptions,
};
