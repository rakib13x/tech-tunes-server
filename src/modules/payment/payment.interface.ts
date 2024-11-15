import { Document, Types } from "mongoose";

export type TPaymentMethod = "Aamarpay" | "Stripe";
export type TPaymentCurrency = "USD" | "BDT";
export type TPaymentStatus = "Pending" | "Paid" | "Failed" | "Canceled";

export interface IPayment extends Document {
  transactionId: string;
  user: Types.ObjectId;
  subscription: Types.ObjectId;
  paymentMethod: TPaymentMethod;
  amount: number;
  currency: TPaymentCurrency;
  status: TPaymentStatus;
  paidAt: Date;
}

export type TPaymentData = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: string;
  address: string;
  currency: string;
  transactionId: string;
};
