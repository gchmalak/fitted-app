import { z } from "zod";

const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

// Algerian phone number
const algerianPhoneRegex =
  /^(?:(?:\+213|00213)[5-7]\d{8}|0[5-7]\d{8})$/;

export const loginSchema = z.object({
  email: z
    .email("Email must be valid")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(1, "Password is required"),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters")
    .trim(),

  email: z
    .email("Email must be valid")
    .trim()
    .toLowerCase(),

  phoneNumber: z
    .string()
    .trim()
    .refine(
      (value) =>
        algerianPhoneRegex.test(value.replace(/[\s-]/g, "")),
      "Please enter a valid Algerian phone number",
    ),

  password: z
    .string()
    .regex(
      passwordRegex,
      "Password must have an uppercase letter, lowercase letter, and a number, min 8 characters",
    ),
});

export const forgotPasswordSchema = z.object({
  email: z
    .email("Email must be valid")
    .trim()
    .toLowerCase(),
});

export const resetPasswordFormSchema = z
  .object({
    newPassword: z
      .string()
      .regex(
        passwordRegex,
        "Password must have an uppercase letter, lowercase letter, and a number, min 8 characters",
      ),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormInput = z.infer<
  typeof resetPasswordFormSchema
>;