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

export const postController = {
  createPost,
  getPosts,
};
