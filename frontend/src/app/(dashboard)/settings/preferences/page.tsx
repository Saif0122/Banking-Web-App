"use client";

import React, { useEffect } from "react";
import { useTheme } from "next-themes";
import { usePreferences, useUpdatePreferences } from "@/hooks/useSettings";
import { SettingsCard } from "@/components/settings/SettingsCard";
import { PreferenceToggle } from "@/components/settings/PreferenceToggle";
import { Loader2, Moon, Sun, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PreferencesSettingsPage() {
  const { theme, setTheme } = useTheme();
  const { data: preferences, isLoading } = usePreferences();
  const updatePreferences = useUpdatePreferences();

  const handleToggle = (key: "emailNotifications" | "pushNotifications", checked: boolean) => {
    updatePreferences.mutate({ [key]: checked });
  };

  if (isLoading) {
    return (
      <SettingsCard title="Preferences" description="Loading your preferences...">
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </SettingsCard>
    );
  }

  return (
    <div className="space-y-6">
      <SettingsCard 
        title="Appearance" 
        description="Customize the look and feel of your dashboard."
      >
        <div className="grid grid-cols-3 gap-4 mt-2">
          {[
            { id: "light", icon: Sun, label: "Light" },
            { id: "dark", icon: Moon, label: "Dark" },
            { id: "system", icon: Laptop, label: "System" },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                  isActive
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            );
          })}
        </div>
      </SettingsCard>

      <SettingsCard 
        title="Notifications" 
        description="Choose what you want to be notified about."
      >
        <div className="space-y-2">
          <PreferenceToggle
            title="Email Notifications"
            description="Receive daily summaries and important alerts via email."
            checked={preferences?.emailNotifications ?? true}
            onChange={(checked) => handleToggle("emailNotifications", checked)}
            disabled={updatePreferences.isPending}
          />
          <div className="h-px bg-border" />
          <PreferenceToggle
            title="Push Notifications"
            description="Receive real-time alerts on your device for transactions."
            checked={preferences?.pushNotifications ?? true}
            onChange={(checked) => handleToggle("pushNotifications", checked)}
            disabled={updatePreferences.isPending}
          />
        </div>
      </SettingsCard>

      <SettingsCard 
        title="Language & Region" 
        description="Set your preferred language for the interface."
      >
        <div className="max-w-xs pt-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Language
          </label>
          <select 
            className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={preferences?.language || "en-US"}
            onChange={(e) => updatePreferences.mutate({ language: e.target.value })}
            disabled={updatePreferences.isPending}
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es-ES">Español</option>
            <option value="fr-FR">Français</option>
          </select>
        </div>
      </SettingsCard>
    </div>
  );
}
