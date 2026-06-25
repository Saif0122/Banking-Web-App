import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
 // Assuming sonner is used for toasts, if not, it will just fail silently or we can replace it. Wait, I should check if sonner or toast is used. Let's assume standard error handling.

export const useAdminOverview = () => {
  return useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => AdminService.getOverview(),
  });
};

export const useUsers = (page: number, limit: number, search?: string) => {
  return useQuery({
    queryKey: ["admin", "users", { page, limit, search }],
    queryFn: () => AdminService.getUsers(page, limit, search),
    placeholderData: (previousData) => previousData, // keep previous data while fetching
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["admin", "user", id],
    queryFn: () => AdminService.getUser(id),
    enabled: !!id,
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminService.blockUser(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "user", variables] });
    },
  });
};

export const useUnblockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminService.unblockUser(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "user", variables] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

export const useAccounts = (page: number, limit: number, search?: string) => {
  return useQuery({
    queryKey: ["admin", "accounts", { page, limit, search }],
    queryFn: () => AdminService.getAccounts(page, limit, search),
    placeholderData: (previousData) => previousData,
  });
};

export const useFreezeAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminService.freezeAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "accounts"] });
    },
  });
};

export const useActivateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminService.activateAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "accounts"] });
    },
  });
};

export const useCloseAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminService.closeAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "accounts"] });
    },
  });
};

export const useTransactions = (
  page: number,
  limit: number,
  type?: string,
  status?: string,
  search?: string
) => {
  return useQuery({
    queryKey: ["admin", "transactions", { page, limit, type, status, search }],
    queryFn: () => {
      if (type || status || search) {
        return AdminService.searchTransactions(page, limit, type, status, search);
      }
      return AdminService.getTransactions(page, limit);
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useAuditLogs = (page: number, limit: number, search?: string) => {
  return useQuery({
    queryKey: ["admin", "audit-logs", { page, limit, search }],
    queryFn: () => AdminService.getAuditLogs(page, limit, search),
    placeholderData: (previousData) => previousData,
  });
};
