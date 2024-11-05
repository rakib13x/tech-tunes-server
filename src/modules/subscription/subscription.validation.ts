import { z } from "zod";

import { PaymentMethods } from "../payment/payment.constant";
import {
  SubscriptionCurrency,
  SubscriptionTypes,
} from "./subscription.constant";

const subscribe = z.object({
  body: z
    .object({
      type: z.enum([...SubscriptionTypes] as [string, ...string[]], {
        required_error: "Subscription Type is required",
        invalid_type_error: "Subscription Type must be a string",
      }),
      currency: z.enum([...SubscriptionCurrency] as [string, ...string[]], {
        required_error: "Subscription Currency is required",
        invalid_type_error: "Subscription Currency must be a string",
      }),
      paymentMethod: z.enum([...PaymentMethods] as [string, ...string[]], {
        required_error: "Payment Method is required",
        invalid_type_error: "Payment Method must be a string",
      }),
      price: z.number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number",
      }),
    })
    .strict(),
});

export const subscriptionValidationSchema = {
  subscribe,
};
