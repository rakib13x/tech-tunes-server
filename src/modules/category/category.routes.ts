import { Router } from "express";
import { USER_ROLE } from "../../constant";
import { auth, validateRequest } from "../../middlewares";
import { categoryController } from "./category.controller";
import { categoryValidationSchema } from "./category.validation";

const router = Router();

router
  .route("/")
  .get(categoryController.fetchAllCategoriesHandler)
  .post(
    auth(USER_ROLE.ADMIN),
    validateRequest(categoryValidationSchema.createCategorySchema),
    categoryController.createCategoryHandler,
  );

router
  .route("/:id")
  .get(categoryController.fetchCategoryByIdHandler)
  .delete(categoryController.removeCategoryHandler);

export default router;
