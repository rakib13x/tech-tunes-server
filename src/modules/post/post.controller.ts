import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils";
import { postService } from "./post.service";

const createPost = catchAsync(async (req: Request, res: Response) => {
  const postData = await postService.createPost(req.user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Post successfully created",
    data: postData,
  });
});

const getPosts = catchAsync(async (req: Request, res: Response) => {
  const { meta, posts } = await postService.fetchPosts(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts fetched successfully",
    meta,
    data: posts,
  });
});
const commentOnPost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await postService.commentOnPost(req.user, id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Add comment successfully",
    data: result,
  });
});

const voteOnPost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { voteType } = req.query;

  const result = await postService.voteOnPost(
    req.user,
    id,
    voteType as "upvote" | "downvote",
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vote on post successfully updated",
    data: result,
  });
});

// get vote status
const getVoteStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await postService.getVoteStatus(req.user, id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vote status retrieved successfully",
    data: result,
  });
});

export const postController = {
  createPost,
  getPosts,
  commentOnPost,
  voteOnPost,
  getVoteStatus,
};
