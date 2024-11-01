import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils";
import { commentService } from "./comment.service";

const deleteComment = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await commentService.deleteComment(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment deleted successfully",
    data: result,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await commentService.updateComment(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment updated successfully",
    data: result,
  });
});

export const commentController = {
  deleteComment,
  updateComment,
};
