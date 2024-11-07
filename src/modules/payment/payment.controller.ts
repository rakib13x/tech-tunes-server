import config from "../../config";
import { catchAsync } from "../../utils";
import { paymentService } from "./payment.service";

const paymentConfirmation = catchAsync(async (req, res) => {
  const { transactionId } = req.query;

  // verify the transaction
  const result = await paymentService.paymentConfirmation(
    transactionId as string,
  );

  if (result) {
    return res
      .status(200)
      .redirect(
        `${config.client_base_url}/subscriptions/payment/success?transactionId=${transactionId}`,
      );
  } else {
    res
      .status(400)
      .redirect(
        `${config.client_base_url}/subscriptions/payment/failed?transactionId=${transactionId}`,
      );
  }
});

const paymentFailed = catchAsync(async (req, res) => {
  const { transactionId } = req.query;

  // update the payment status and subscription status
  await paymentService.paymentFailed(transactionId as string);

  res
    .status(200)
    .redirect(
      `${config.client_base_url}/subscriptions/payment/failed?transactionId=${transactionId}`,
    );
});

const paymentCancelled = catchAsync(async (req, res) => {
  const { transactionId } = req.query;

  // update the payment status and subscription status
  await paymentService.paymentCancelled(transactionId as string);

  res
    .status(200)
    .redirect(
      `${config.client_base_url}/subscriptions/payment/cancel?transactionId=${transactionId}`,
    );
});

export const paymentController = {
  paymentConfirmation,
  paymentFailed,
  paymentCancelled,
};
