import { z } from "zod";

// Validation for creating a category
const createCategorySchema = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: "The category name is required.",
          invalid_type_error: "The name should be a valid string.",
        })
        .min(1, "Category name should have at least one character."),
      description: z
        .string({
          required_error: "The description is required.",
          invalid_type_error: "The description must be a valid string.",
        })
        .min(1, "Category description should have at least one character.")
        .optional(),
    })
    .strict(),
});

export const categoryValidationSchema = {
  createCategorySchema,
};
