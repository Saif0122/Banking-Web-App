import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "@/services/settings.service";
import { UpdateProfileRequest, UpdateSecurityRequest, UpdatePreferencesRequest } from "@/types/settings.types";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: settingsService.getProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => settingsService.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
    },
  });
}

export function useUpdateSecurity() {
  return useMutation({
    mutationFn: (data: UpdateSecurityRequest) => settingsService.updateSecurity(data),
  });
}

export function usePreferences() {
  return useQuery({
    queryKey: ["preferences"],
    queryFn: settingsService.getPreferences,
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePreferencesRequest) => settingsService.updatePreferences(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["preferences"], data);
    },
  });
}
