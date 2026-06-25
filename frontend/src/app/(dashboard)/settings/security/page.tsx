"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { securitySchema } from "@/schemas/settings.schema";
import { useUpdateSecurity } from "@/hooks/useSettings";
import { SettingsCard } from "@/components/settings/SettingsCard";
import { PasswordStrengthMeter } from "@/components/settings/PasswordStrengthMeter";
import { handleFormError } from "@/utils/error-handling";
import { Check, Loader2, Save, AlertCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type SecurityFormValues = z.infer<typeof securitySchema>;

export default function SecuritySettingsPage() {
  const updateSecurity = useUpdateSecurity();
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SecurityFormValues) => {
    setError(null);
    try {
      await updateSecurity.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      form.reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const message = handleFormError(err, form.setError);
      setError(message);
    }
  };

  return (
    <div className="space-y-6">
      <SettingsCard 
        title="Change Password" 
        description="Ensure your account is using a long, random password to stay secure."
      >
        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive mb-6">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      disabled={updateSecurity.isPending} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      disabled={updateSecurity.isPending} 
                      {...field} 
                    />
                  </FormControl>
                  <PasswordStrengthMeter password={field.value} className="mt-3" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      disabled={updateSecurity.isPending} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <button
                type="submit"
                disabled={updateSecurity.isPending || !form.formState.isDirty}
                className="flex items-center justify-center w-full sm:w-auto gap-2 rounded-lg bg-primary text-primary-foreground font-semibold px-5 py-2.5 text-sm shadow hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateSecurity.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : success ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>
                  {updateSecurity.isPending
                    ? "Updating Password..."
                    : success
                    ? "Password Updated!"
                    : "Update Password"}
                </span>
              </button>
            </div>
          </form>
        </Form>
      </SettingsCard>
    </div>
  );
}
