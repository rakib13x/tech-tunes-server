import mongoose from "mongoose";
import slugify from "slugify";

import Post from "./post.model";
import Subscription from "../subscription/subscription.model";

// Function to generate slug with potential suffix
export const generateUniqueSlugForPost = async (title: string, username: string) => {
  const baseSlug = slugify(`${title}-${username}`, {
    lower: true,
    trim: true,
    remove: /[*+~.()'"!?:@#$%^&\\]/g,
    replacement: "-",
  });

  let slug = baseSlug;
  let suffix = 1;

  // Check for slug existence and generate a unique one
  while (await Post.findOne({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
};

// Helper function to check if the user has an active premium subscription
export const isPremiumSubscriptionActive = async (
  userId: mongoose.Types.ObjectId,
) => {
  const subscription = await Subscription.findOne({ user: userId });

  if (!subscription) return false;

  const currentDate = new Date();
  return (
    subscription.status === "Active" &&
    currentDate >= new Date(subscription.startDate) &&
    currentDate <= new Date(subscription.endDate)
  );
};
