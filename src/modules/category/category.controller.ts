import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils";
import { categoryService } from "./category.service";

const createCategoryHandler = catchAsync(
  async (req: Request, res: Response) => {
    const createdCategory = await categoryService.addCategory(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "New category successfully created.",
      data: createdCategory,
    });
  },
);

const fetchAllCategoriesHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { categories, metaData } = await categoryService.fetchCategories(
      req.query,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Categories retrieved successfully.",
      data: categories,
      meta: metaData,
    });
  },
);

export const categoryController = {
  createCategoryHandler,
  fetchAllCategoriesHandler,
};
