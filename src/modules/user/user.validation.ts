import { z } from "zod";
import { SocialPlatform, UserGender } from "./user.constant";

const updateProfile = z.object({
  body: z
    .object({
      fullName: z
        .string({
          invalid_type_error: "Full Name must be a string",
          required_error: "Full Name is required",
        })
        .optional(),
      bio: z
        .string({
          invalid_type_error: "Bio must be a string",
          required_error: "Bio is required",
        })
        .optional(),
      designation: z
        .string({
          invalid_type_error: "Designation must be a string",
          required_error: "Designation is required",
        })
        .optional(),
      phone: z
        .string({
          invalid_type_error: "Phone must be a string",
          required_error: "Phone is required",
        })
        .optional(),
      location: z
        .string({
          invalid_type_error: "Location must be a string",
          required_error: "Location is required",
        })
        .optional(),
      dateOfBirth: z
        .string({
          invalid_type_error: "Date of birth must be a string",
          required_error: "Date of birth is required",
        })
        .optional(),
      gender: z
        .enum([...UserGender] as [string, ...string[]], {
          required_error: "Gender is required",
          invalid_type_error: "Gender must be string",
        })
        .optional(),
      profilePicture: z
        .string({
          invalid_type_error: "Profile picture must be a string",
          required_error: "Profile picture is required",
        })
        .optional(),
    })
    .strict(),
});

const socialLinkSchema = z
  .object({
    platform: z.enum([...SocialPlatform] as [string, ...string[]], {
      required_error: "Social Platform is required",
      invalid_type_error: "Social Platform must be string",
    }),
    url: z.string().url("Invalid URL"),
  })
  .optional();

const updateSocialLinks = z.object({
  body: z
    .object({
      socialLinks: z
        .array(socialLinkSchema)
        .min(1, "At least one social link is required")
        .max(6, "No more than 6 social links are allowed")
        .refine(
          (socialLinks) => {
            const platforms = socialLinks.map((link) => link?.platform);
            return new Set(platforms).size === platforms.length;
          },
          {
            message: "Social platforms must be unique",
          },
        )
        .optional(),
    })
    .strict(),
});
export const userValidationSchema = {
  updateProfile,
  updateSocialLinks
};
