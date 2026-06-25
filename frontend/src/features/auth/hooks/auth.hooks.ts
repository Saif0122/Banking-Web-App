import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { LoginPayload, RegisterPayload, User } from "../types/auth.types";
import { setToken, removeToken } from "@/services/api-client";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
    onSuccess: (data) => {
      console.log("LOGIN SUCCESS");
      setToken(data.token);
      queryClient.setQueryData(["currentUser"], data.user);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterPayload) => authApi.register(data),
    onSuccess: (data) => {
      console.log("REGISTER SUCCESS");
      setToken(data.token);
      queryClient.setQueryData(["currentUser"], data.user);
    },
  });
};

export const useCurrentUser = (enabled: boolean = true) => {
  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry if failing (e.g. 401)
    enabled,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      removeToken();
      queryClient.setQueryData(["currentUser"], null);
    },
    onError: () => {
      // Even if API call fails, clear local state
      removeToken();
      queryClient.setQueryData(["currentUser"], null);
    }
  });
};
