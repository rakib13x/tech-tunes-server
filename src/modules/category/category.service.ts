import httpStatus from "http-status";
import { QueryBuilder } from "../../builder";
import { AppError } from "../../errors";
import { categorySearchableFields } from "./category.constant";
import { ICategory } from "./category.interface";
import CategoryModel from "./category.model";

// Service to add a new category into the database
const addCategory = async (categoryData: ICategory) => {
  // Check if the category already exists
  const existingCategory = await CategoryModel.findOne({
    name: categoryData.name,
  });
  if (existingCategory) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A category with this name already exists.",
    );
  }

  // Create and save the new category
  const newCategory = await CategoryModel.create(categoryData);
  return newCategory;
};

// Service to fetch all categories with optional filters, sorting, and pagination
const fetchCategories = async (queryParams: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(
    CategoryModel.find({}),
    queryParams,
  ).search(categorySearchableFields);

  await queryBuilder.filter();
  queryBuilder.sort().paginate().fields();

  const categories = await queryBuilder.modelQuery;
  const metaData = await queryBuilder.countTotal();

  return { categories, metaData };
};

// Service to get a specific category by ID
const getCategoryById = async (categoryId: string) => {
  const category = await CategoryModel.findById(categoryId);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found.");
  }

  return category;
};

// Service to soft-delete a category (mark as deleted)
const softDeleteCategory = async (categoryId: string) => {
  const updatedCategory = await CategoryModel.findByIdAndUpdate(
    categoryId,
    { isDeleted: true },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedCategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found.");
  }

  return updatedCategory;
};

export const categoryService = {
  addCategory,
  fetchCategories,
  getCategoryById,
  softDeleteCategory,
};
