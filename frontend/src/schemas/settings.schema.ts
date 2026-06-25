import * as z from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email().optional(), // Usually readonly, but keeping it in schema
  avatarUrl: z.any().optional(), // For file upload handling or URL
});

export const securitySchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const preferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  language: z.string().min(1, "Language is required"),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
});
