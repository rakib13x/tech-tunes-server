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

export const categoryService = {
  addCategory,
  fetchCategories,
};
