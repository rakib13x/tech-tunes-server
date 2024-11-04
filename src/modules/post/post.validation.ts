import mongoose from "mongoose";
import { z } from "zod";
import { PostContentTypes } from "./post.constant";

const create = z.object({
  body: z
    .object({
      title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string",
      }),
      contentType: z.enum([...PostContentTypes] as [string, ...string[]], {
        required_error: "Content Type is required",
        invalid_type_error: "Content Type must be a string",
      }),
      content: z.string({
        required_error: "Content is required",
        invalid_type_error: "Content must be a string",
      }),
      coverImage: z.string({
        required_error: "Cover Image is required",
        invalid_type_error: "Cover Image must be a string",
      }),
      category: z
        .string({
          required_error: "Category Id is required",
          invalid_type_error: "Category Id must be a string",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "Invalid Category Id",
        }),
      images: z
        .array(
          z.string({
            required_error: "Image is required",
            invalid_type_error: "Image must be a string",
          }),
          {
            required_error: "Images is required",
            invalid_type_error: "Images must be an array string",
          },
        )
        .min(1, "Images must be at least one image url")
        .optional(),
      tags: z.array(
        z.string({
          required_error: "Tag is required",
          invalid_type_error: "Tag must be a string",
        }),
        {
          required_error: "Tags is required",
          invalid_type_error: "Tags must be an array of string",
        },
      ),
      isPremium: z.boolean({
        required_error: "Is Premium is required",
        invalid_type_error: "Is Premium must be a boolean",
      }),
    })
    .strict(),
});

export const postValidationSchema = {
  create,
};
