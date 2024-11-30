import { z } from "zod";

const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine(
        (value) =>
          /[A-Z]/.test(value) && // Ensure at least one uppercase letter
          /\d/.test(value), // Ensure at least one number
        "Password must contain at least one uppercase letter and one number"
      ),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string(),
});

export { registerSchema, loginSchema };
