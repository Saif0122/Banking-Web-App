"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { profileSchema } from "@/schemas/settings.schema";
import { useProfile, useUpdateProfile } from "@/hooks/useSettings";
import { SettingsCard } from "@/components/settings/SettingsCard";
import { AvatarUpload } from "@/components/settings/AvatarUpload";
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

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileSettingsPage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        email: profile.email,
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    setError(null);
    try {
      await updateProfile.mutateAsync(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const message = handleFormError(err, form.setError);
      setError(message);
    }
  };

  if (isLoading) {
    return (
      <SettingsCard title="Profile Details" description="Loading your personal information...">
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </SettingsCard>
    );
  }

  return (
    <SettingsCard 
      title="Profile Details" 
      description="Update your personal information and how others see you on the platform."
    >
      <div className="space-y-8">
        <AvatarUpload 
          name={profile?.name || ""} 
          currentAvatarUrl={profile?.avatarUrl}
          onUpload={(file) => {
            // Handle file upload and set avatarUrl in form or state
            console.log("File selected:", file.name);
          }}
        />

        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" disabled={updateProfile.isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" disabled className="bg-muted/50 cursor-not-allowed" {...field} />
                    </FormControl>
                    <p className="text-[13px] text-muted-foreground mt-1.5">
                      Your email cannot be changed. Contact support for help.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <button
                type="submit"
                disabled={updateProfile.isPending || !form.formState.isDirty}
                className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground font-semibold px-5 py-2.5 text-sm shadow hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateProfile.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : success ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>
                  {updateProfile.isPending
                    ? "Saving Changes..."
                    : success
                    ? "Changes Saved!"
                    : "Save Changes"}
                </span>
              </button>
            </div>
          </form>
        </Form>
      </div>
    </SettingsCard>
  );
}
