import { format, startOfMonth, subMonths } from "date-fns";
import Comment from "../comment/comment.model";
import Payment from "../payment/payment.model";
import Post from "../post/post.model";
import User from "../user/user.model";
import View from "../view/view.model";
import Vote from "../vote/vote.model";

const dashboard = async () => {
  const currentMonthStart = startOfMonth(new Date());
  const currentYear = currentMonthStart.getFullYear();

  const calculatePercentageDiff = (current: number, previous: number) => {
    if (previous === 0) return "N/A";
    return `${(((current - previous) / previous) * 100).toFixed(2)}%`;
  };

  const determineType = (current: number, previous: number) => {
    if (current > previous) return "increase";
    if (current < previous) return "decrease";
    return "no change";
  };

  // Helper function to get monthly count for a model
  const getMonthlyCount = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: any,
    type: string | null,
    start: Date,
    end: Date,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { createdAt: { $gte: start, $lt: end } };
    if (type) filter.type = type;
    return model.countDocuments(filter);
  };

  // Fetch total and monthly data for each metric
  const totalUpvotes = await Vote.countDocuments({ type: "upvote" });
  const currentMonthUpvotes = await Vote.countDocuments({
    type: "upvote",
    createdAt: { $gte: currentMonthStart },
  });
  const lastMonthUpvotes = await Vote.countDocuments({
    type: "upvote",
    createdAt: {
      $gte: subMonths(currentMonthStart, 1),
      $lt: currentMonthStart,
    },
  });
  const upvotesData = {
    total: totalUpvotes,
    currentMonth: currentMonthUpvotes,
    lastMonthDiff: calculatePercentageDiff(
      currentMonthUpvotes,
      lastMonthUpvotes,
    ),
    type: determineType(currentMonthUpvotes, lastMonthUpvotes),
  };

  const totalDownvotes = await Vote.countDocuments({ type: "downvote" });
  const currentMonthDownvotes = await Vote.countDocuments({
    type: "downvote",
    createdAt: { $gte: currentMonthStart },
  });
  const lastMonthDownvotes = await Vote.countDocuments({
    type: "downvote",
    createdAt: {
      $gte: subMonths(currentMonthStart, 1),
      $lt: currentMonthStart,
    },
  });
  const downvotesData = {
    total: totalDownvotes,
    currentMonth: currentMonthDownvotes,
    lastMonthDiff: calculatePercentageDiff(
      currentMonthDownvotes,
      lastMonthDownvotes,
    ),
    type: determineType(currentMonthDownvotes, lastMonthDownvotes),
  };

  const totalComments = await Comment.countDocuments();
  const currentMonthComments = await Comment.countDocuments({
    createdAt: { $gte: currentMonthStart },
  });
  const lastMonthComments = await Comment.countDocuments({
    createdAt: {
      $gte: subMonths(currentMonthStart, 1),
      $lt: currentMonthStart,
    },
  });
  const commentsData = {
    total: totalComments,
    currentMonth: currentMonthComments,
    lastMonthDiff: calculatePercentageDiff(
      currentMonthComments,
      lastMonthComments,
    ),
    type: determineType(currentMonthComments, lastMonthComments),
  };

  const totalViews = await View.countDocuments();
  const currentMonthViews = await View.countDocuments({
    createdAt: { $gte: currentMonthStart },
  });
  const lastMonthViews = await View.countDocuments({
    createdAt: {
      $gte: subMonths(currentMonthStart, 1),
      $lt: currentMonthStart,
    },
  });
  const viewsData = {
    total: totalViews,
    currentMonth: currentMonthViews,
    lastMonthDiff: calculatePercentageDiff(currentMonthViews, lastMonthViews),
    type: determineType(currentMonthViews, lastMonthViews),
  };

  // Fetch total revenue where status is 'Paid'
  const totalRevenue = await Payment.aggregate([
    { $match: { status: "Paid" } }, // Filter for 'Paid' status
    { $group: { _id: null, total: { $sum: "$amount" } } }, // Sum the amount field
  ]);

  const totalRevenueAmount =
    totalRevenue.length > 0 ? totalRevenue[0].total : 0;

  // Current Month Revenue where status is 'Paid'
  const currentMonthRevenue = await Payment.aggregate([
    { $match: { status: "Paid", createdAt: { $gte: currentMonthStart } } }, // Filter for 'Paid' status
    { $group: { _id: null, total: { $sum: "$amount" } } }, // Sum the amount field
  ]);

  const currentMonthRevenueAmount =
    currentMonthRevenue.length > 0 ? currentMonthRevenue[0].total : 0;

  // Last Month Revenue where status is 'Paid'
  const lastMonthRevenue = await Payment.aggregate([
    {
      $match: {
        status: "Paid",
        createdAt: {
          $gte: subMonths(currentMonthStart, 1),
          $lt: currentMonthStart,
        },
      },
    }, // Filter for 'Paid' status
    { $group: { _id: null, total: { $sum: "$amount" } } }, // Sum the amount field
  ]);

  const lastMonthRevenueAmount =
    lastMonthRevenue.length > 0 ? lastMonthRevenue[0].total : 0;

  const revenueData = {
    total: totalRevenueAmount,
    currentMonth: currentMonthRevenueAmount,
    lastMonthDiff: calculatePercentageDiff(
      currentMonthRevenueAmount,
      lastMonthRevenueAmount,
    ),
    type: determineType(currentMonthRevenueAmount, lastMonthRevenueAmount),
  };

  const totalUsers = await User.countDocuments();
  const currentMonthUsers = await User.countDocuments({
    createdAt: { $gte: currentMonthStart },
  });
  const lastMonthUsers = await User.countDocuments({
    createdAt: {
      $gte: subMonths(currentMonthStart, 1),
      $lt: currentMonthStart,
    },
  });
  const usersData = {
    total: totalUsers,
    currentMonth: currentMonthUsers,
    lastMonthDiff: calculatePercentageDiff(currentMonthUsers, lastMonthUsers),
    type: determineType(currentMonthUsers, lastMonthUsers),
  };

  const totalPosts = await Post.countDocuments({ isDeleted: false });
  const currentMonthPosts = await Post.countDocuments({
    createdAt: { $gte: currentMonthStart },
    isDeleted: false,
  });
  const lastMonthPosts = await Post.countDocuments({
    createdAt: {
      $gte: subMonths(currentMonthStart, 1),
      $lt: currentMonthStart,
    },
  });
  const postsData = {
    total: totalPosts,
    currentMonth: currentMonthPosts,
    lastMonthDiff: calculatePercentageDiff(currentMonthPosts, lastMonthPosts),
    type: determineType(currentMonthPosts, lastMonthPosts),
  };

  // Generate chart data for each month of the current year
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const monthStart = new Date(currentYear, i, 1);
    return {
      name: format(monthStart, "MMM"), // Format month as Jan, Feb, etc.
      views: 0,
      posts: 0,
      comments: 0,
      users: 0,
      revenue: 0,
      upvotes: 0,
      downvotes: 0,
    };
  });

  // Fill in the chart data for the current year
  for (let i = 0; i < 12; i++) {
    const monthStart = new Date(currentYear, i, 1);
    const monthEnd = new Date(currentYear, i + 1, 1);

    const [
      monthlyViews,
      monthlyPosts,
      monthlyComments,
      monthlyUsers,
      monthlyRevenue,
      monthlyUpvotes,
      monthlyDownvotes,
    ] = await Promise.all([
      getMonthlyCount(View, null, monthStart, monthEnd),
      getMonthlyCount(Post, null, monthStart, monthEnd),
      getMonthlyCount(Comment, null, monthStart, monthEnd),
      getMonthlyCount(User, null, monthStart, monthEnd),
      // Fetch the total revenue for the month
      Payment.aggregate([
        {
          $match: {
            status: "Paid",
            createdAt: { $gte: monthStart, $lt: monthEnd },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      getMonthlyCount(Vote, "upvote", monthStart, monthEnd),
      getMonthlyCount(Vote, "downvote", monthStart, monthEnd),
    ]);

    // Extract revenue amount from the aggregation result
    const revenueAmount =
      monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0;

    chartData[i] = {
      name: format(monthStart, "MMM"), // Month name
      views: monthlyViews,
      posts: monthlyPosts,
      comments: monthlyComments,
      users: monthlyUsers,
      revenue: revenueAmount,
      upvotes: monthlyUpvotes,
      downvotes: monthlyDownvotes,
    };
  }

  const data = {
    upvotes: upvotesData,
    downvotes: downvotesData,
    comments: commentsData,
    views: viewsData,
    revenue: revenueData,
    users: usersData,
    posts: postsData,
    chartData: chartData,
  };

  return data;
};

export const metricsService = {
  dashboard,
};
