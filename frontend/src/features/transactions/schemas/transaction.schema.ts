import { z } from "zod";

export const depositSchema = z.object({
  accountId: z.string().min(1, "Account selection is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  description: z.string().min(1, "Description is required").max(100, "Description is too long"),
});

export type DepositFormData = z.infer<typeof depositSchema>;

export const withdrawSchema = z.object({
  accountId: z.string().min(1, "Account selection is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  description: z.string().min(1, "Description is required").max(100, "Description is too long"),
});

export type WithdrawFormData = z.infer<typeof withdrawSchema>;

export const transferSchema = z.object({
  fromAccountId: z.string().min(1, "Source account is required"),
  toAccountId: z.string().min(1, "Destination account is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  description: z.string().min(1, "Description is required").max(100, "Description is too long"),
}).refine((data) => data.fromAccountId !== data.toAccountId, {
  message: "Cannot transfer to the same account",
  path: ["toAccountId"],
});

export type TransferFormData = z.infer<typeof transferSchema>;
