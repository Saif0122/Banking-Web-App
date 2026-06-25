import { apiClient } from "./api-client";
import { PaginatedNotifications } from "@/types/notifications.types";

export const notificationsService = {
  getNotifications: async (): Promise<PaginatedNotifications> => {
    const { data } = await apiClient.get<PaginatedNotifications>("/notifications");
    return data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch("/notifications/read-all");
  }
};
