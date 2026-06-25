import { UserProfile, UpdateProfileRequest, UpdateSecurityRequest, UserPreferences, UpdatePreferencesRequest } from "@/types/settings.types";
import { apiClient } from "./api-client";

export const settingsService = {
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await apiClient.get<{ success: boolean; user: UserProfile }>("/users/me");
    return data.user;
  },

  updateProfile: async (payload: UpdateProfileRequest): Promise<UserProfile> => {
    const { data } = await apiClient.put<{ success: boolean; user: UserProfile }>("/users/me", payload);
    return data.user;
  },

  updateSecurity: async (payload: UpdateSecurityRequest): Promise<void> => {
    await apiClient.put("/users/security", payload);
  },

  getPreferences: async (): Promise<UserPreferences> => {
    const { data } = await apiClient.get<{ success: boolean; preferences: UserPreferences }>("/users/preferences");
    return data.preferences;
  },

  updatePreferences: async (payload: UpdatePreferencesRequest): Promise<UserPreferences> => {
    const { data } = await apiClient.put<{ success: boolean; preferences: UserPreferences }>("/users/preferences", payload);
    return data.preferences;
  }
};
