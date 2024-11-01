import { z } from "zod";
import { UserGender } from "./user.constant";

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

export const userValidationSchema = {
  updateProfile,
};
