"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { handleFormError } from "@/utils/error-handling";
import { useCreateAccount } from "@/hooks/useAccounts";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AccountType } from "@/types";
import { Loader2, AlertCircle } from "lucide-react";

const createAccountSchema = z.object({
  name: z.string().min(1, "Account name is required").max(100),
  accountType: z.enum(["savings", "checking", "credit"]),
  initialDeposit: z.number().min(0, "Initial deposit cannot be negative"),
});

type CreateAccountValues = z.infer<typeof createAccountSchema>;

export function CreateAccountForm() {
  const router = useRouter();
  const { mutateAsync: createAccount, isPending } = useCreateAccount();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateAccountValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: "",
      accountType: "checking",
      initialDeposit: 0,
    },
  });

  async function onSubmit(data: CreateAccountValues) {
    try {
      setError(null);
      const account = await createAccount({
        name: data.name,
        accountType: data.accountType as AccountType,
        initialDeposit: data.initialDeposit,
      });
      router.push(`/accounts/${account._id}`);
    } catch (err) {
      const message = handleFormError(err, form.setError);
      setError(message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive mb-6">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. My Personal Checking" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Type</FormLabel>
              <div className="grid grid-cols-3 gap-4">
                {(["checking", "savings", "credit"] as const).map((type) => (
                  <label
                    key={type}
                    className={`
                      cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-2 text-sm font-medium transition-all
                      ${
                        field.value === type
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50 text-muted-foreground"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      {...field}
                      value={type}
                      checked={field.value === type}
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="initialDeposit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Deposit ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Minimum deposit required is $0.00.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full font-semibold" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Open Account
        </Button>
      </form>
    </Form>
  );
}
