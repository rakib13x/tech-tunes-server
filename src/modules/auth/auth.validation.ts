import { z } from "zod";
import { UserGender } from "../user/user.constant";

const register = z.object({
  body: z
    .object({
      fullName: z.string({
        required_error: "Full Name is required",
        invalid_type_error: "Full Name must be string",
      }),
      username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be string",
      }),
      email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be string",
      }),
      password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be string",
      }),
      gender: z.enum([...UserGender] as [string, ...string[]], {
        required_error: "Gender is required",
        invalid_type_error: "Gender must be string",
      }),
      dateOfBirth: z
        .string({
          required_error: "Date of Birth is required",
          invalid_type_error: "Date of Birth must be string",
        })
        .date("Invalid Date, Expected format: YYYY-MM-DD"),
      profilePicture: z
        .string({
          required_error: "Profile picture is required",
          invalid_type_error: "Profile Picture must be string",
        })
        .optional(),
    })
    .strict(),
});

export const authValidationSchema = {
  register,
};
