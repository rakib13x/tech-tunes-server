import {
  TSubScriptionCurrency,
  TSubscriptionStatus,
  TSubscriptionType,
} from "./subscription.interface";

export const SubscriptionTypes: TSubscriptionType[] = ["Monthly", "Annual"];

export const SubscriptionStatus: TSubscriptionStatus[] = [
  "Pending",
  "Active",
  "Expired",
  "Canceled",
];

export const SubscriptionCurrency: TSubScriptionCurrency[] = ["USD", "BDT"];

export const SUBSCRIPTION_STATUS = {
  PENDING: "Pending",
  ACTIVE: "Active",
  EXPIRED: "Expired",
  CANCELED: "Canceled",
} as const;
