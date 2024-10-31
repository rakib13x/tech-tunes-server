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

const login = z.object({
  body: z
    .object({
      email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be string",
      }),
      password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be string",
      }),
    })
    .strict(),
});

const socialLogin = z.object({
  body: z
    .object({
      fullName: z.string({
        required_error: "Full Name is required",
        invalid_type_error: "Full Name must be a string",
      }),
      email: z
        .string({
          required_error: "Email is required",
          invalid_type_error: "Email must be a string",
        })
        .email("Provide a valid email address"),
      profilePicture: z
        .string({
          required_error: "Profile picture is required",
          invalid_type_error: "Profile Picture must be a string",
        })
        .optional(),
    })
    .strict(),
});
const changePassword = z.object({
  body: z
    .object({
      oldPassword: z.string({
        invalid_type_error: "Old password must be a string",
        required_error: "Old password is required",
      }),
      newPassword: z
        .string({
          invalid_type_error: "New password must be a string",
          required_error: "New password is required",
        })
        .min(6, "New password must be at least 8 characters"),
    })
    .strict(),
});

const forgetPassword = z.object({
  body: z
    .object({
      email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      }),
    })
    .strict(),
});

const resetPassword = z.object({
  body: z
    .object({
      email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      }),
      newPassword: z
        .string({
          required_error: "New password is required",
          invalid_type_error: "New password must be a string",
        })
        .min(6, "New password must be at least 8 characters"),
    })
    .strict(),
});

const refreshToken = z.object({
  cookies: z
    .object({
      refreshToken: z.string({
        invalid_type_error: "Refresh token must be a string",
        required_error: "Refresh token is required",
      }),
    })
    .strict(),
});

export const authValidationSchema = {
  register,
  login,
  socialLogin,
  changePassword,
  forgetPassword,
  resetPassword,
  refreshToken,
};
