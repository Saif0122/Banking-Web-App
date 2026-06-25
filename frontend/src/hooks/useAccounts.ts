import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";
import { Account, CreateAccountPayload } from "@/types";

interface AccountsResponse {
  success: boolean;
  count: number;
  accounts: Account[];
}

interface AccountResponse {
  success: boolean;
  account: Account;
}

export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const { data } = await apiClient.get<AccountsResponse>("/accounts");
      return data.accounts;
    },
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: ["account", id],
    queryFn: async () => {
      const { data } = await apiClient.get<AccountResponse>(`/accounts/${id}`);
      return data.account;
    },
    enabled: !!id,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAccountPayload) => {
      const { data } = await apiClient.post<AccountResponse>("/accounts", payload);
      return data.account;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}
