import { model, Schema } from "mongoose";
import {
  PaymentCurrencies,
  PaymentMethods,
  PaymentStatus,
} from "./payment.constant";
import { IPayment } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    transactionId: {
      type: String,
      required: [true, "Transaction Id is required"],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: [true, "Subscription Id is required"],
    },
    paymentMethod: {
      type: String,
      enum: {
        values: PaymentMethods,
        message: "{VALUE} is not a valid payment method",
      },
      required: [true, "Payment Method is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    currency: {
      type: String,
      enum: {
        values: PaymentCurrencies,
        message: "{VALUE} is not a valid currency",
      },
      required: [true, "Payment currency is required"],
    },
    status: {
      type: String,
      enum: {
        values: PaymentStatus,
        message: "{VALUE} is not a valid payment status",
      },
      default: "Pending",
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Payment = model<IPayment>("Payment", paymentSchema);

export default Payment;
