import { z } from "zod";

const commentOnPost = z.object({
  body: z.object({
    content: z
      .string({
        required_error: "Content is required",
      })
      .min(1, "Content cannot be empty"),
    images: z.array(z.string()).optional(),
  }),
});

const updateComment = z.object({
  body: z
    .object({
      content: z
        .string({
          required_error: "Content is required",
        })
        .min(1, "Content cannot be empty")
        .optional(),
      images: z.array(z.string()).optional(),
    })
    .strict(),
});

export const commentValidationSchema = {
  commentOnPost,
  updateComment,
};
