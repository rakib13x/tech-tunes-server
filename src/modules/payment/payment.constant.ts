import {
    TPaymentCurrency,
    TPaymentMethod,
    TPaymentStatus,
  } from "./payment.interface";
  
  export const PaymentMethods: TPaymentMethod[] = ["Aamarpay", "Stripe"];
  
  export const PaymentCurrencies: TPaymentCurrency[] = ["BDT", "USD"];
  
  export const PaymentStatus: TPaymentStatus[] = [
    "Pending",
    "Paid",
    "Failed",
    "Canceled",
  ];
  
  export const PAYMENT_STATUS = {
    PENDING: "Pending",
    PAID: "Paid",
    FAILED: "Failed",
    CANCELED: "Canceled",
  } as const;
  