import { Document, Types } from "mongoose";
import { TPaymentMethod } from "../payment/payment.interface";

export type TSubscriptionType = "Monthly" | "Annual";

export type TSubscriptionStatus = "Pending" | "Active" | "Expired" | "Canceled";

export type TSubScriptionCurrency = "USD" | "BDT";

export interface ISubscription extends Document {
  user: Types.ObjectId;
  type: TSubscriptionType;
  startDate: Date;
  endDate: Date;
  status: TSubscriptionStatus;
  price: number;
  currency: TSubScriptionCurrency;
  transactionId: string;
  paymentMethod: TPaymentMethod;
}
