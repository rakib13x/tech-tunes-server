import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils";
import { metricsService } from "./metrics.service";


const dashboard = catchAsync(async (req, res) => {
  const result = await metricsService.dashboard();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Dashboard Metrics retrieved successfully",
    data: result,
  });
});

export const metricsController = {
  dashboard,
};
