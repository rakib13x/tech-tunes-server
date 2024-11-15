import axios from "axios";
import { uid } from "uid";
import config from "../../config";

import { TPaymentData } from "./payment.interface";
import Payment from "./payment.model";

export const generateUniqueTransactionId = async () => {
  let isUnique = false;
  let transactionId: string;

  do {
    // Generate a new transaction ID
    transactionId = `txn-tth-${uid(12)}`;

    // Check if this transaction ID already exists in the Payment collection
    const existingPayment = await Payment.findOne({ transactionId });

    if (!existingPayment) {
      isUnique = true; // If no existing payment found, it's unique
    }
  } while (!isUnique);

  // Return the unique transaction ID
  return transactionId;
};

export const initiatePayment = async ({
  address,
  customerPhone,
  amount,
  customerEmail,
  customerName,
  transactionId,
  currency,
}: TPaymentData) => {
  const paymentData = {
    store_id: config.aamarpay_store_id,
    signature_key: config.aamarpay_signature_key,
    cus_name: customerName,
    cus_email: customerEmail,
    cus_phone: customerPhone,
    cus_add1: address,
    cus_add2: "N/A",
    cus_city: "N/A",
    cus_country: "Bangladesh",
    amount: amount,
    tran_id: transactionId,
    currency: currency,

    // it will hit the server /api/v1/payments/confirmation route
    success_url: `${config.api_base_url}/api/v1/payments/confirmation?transactionId=${transactionId}`,

    // it will hit the server /api/v1/payments/failed route
    fail_url: `${config.api_base_url}/api/v1/payments/failed?transactionId=${transactionId}`,

    // it will hit the server /api/v1/payments/cancelled
    cancel_url: `${config.api_base_url}/api/v1/payments/canceled?transactionId=${transactionId}`,
    desc: "Lend Money",
    type: "json",
  };

  const response = await axios.post(
    `${config.aamarpay_gateway_base_url}/jsonpost.php`,
    paymentData,
  );

  return response.data;
};

// verify the payment is successful or failed
export const verifyPayment = async (paymentId: string) => {
  const response = await axios.get(
    `${config.aamarpay_gateway_base_url}/api/v1/trxcheck/request.php`,
    {
      params: {
        store_id: config.aamarpay_store_id,
        signature_key: config.aamarpay_signature_key,
        request_id: paymentId,
        type: "json",
      },
    },
  );

  return response.data;
};
