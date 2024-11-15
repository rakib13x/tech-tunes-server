import { model, Schema } from "mongoose";
import { ISubscription } from "./subscription.interface";
import { SubscriptionCurrency, SubscriptionStatus, SubscriptionTypes } from "./subscription.constant";


const subscriptionSchema = new Schema<ISubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: {
        values: SubscriptionTypes,
        message: "{VALUE} is not a valid subscription type",
      },
      default: "Monthly",
      required: [true, "Subscription type is required"],
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: SubscriptionStatus,
        message: "{VALUE} is not a valid subscription status",
      },
      default: "Pending",
      required: [true, "Subscription status is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    currency: {
      type: String,
      enum: {
        values: SubscriptionCurrency,
        message: "{VALUE} is not a valid currency",
      },
      default: "USD",
      required: [true, "Currency is required"],
    },
    transactionId: {
      type: String,
      required: [true, "Transaction Id is required"],
    },
  },
  {
    timestamps: true,
  },
);

const Subscription = model<ISubscription>("Subscription", subscriptionSchema);

export default Subscription;
