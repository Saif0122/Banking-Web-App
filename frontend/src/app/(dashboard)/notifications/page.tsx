"use client";

import React, { useMemo } from "react";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/useNotifications";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Loader2, Bell, CheckCheck } from "lucide-react";

export default function NotificationsPage() {
  const { data: notificationsData, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const notifications = useMemo(() => notificationsData?.data || [], [notificationsData]);
  const unreadCount = useMemo(() => notificationsData?.unreadCount || 0, [notificationsData]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Stay updated with your account activity and system alerts.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={markAllAsRead.isPending}
            className="flex items-center gap-2 rounded-lg bg-secondary text-secondary-foreground font-medium px-4 py-2 text-sm shadow-sm hover:bg-secondary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-fit"
          >
            {markAllAsRead.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            <span>Mark all as read ({unreadCount})</span>
          </button>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Bell className="h-8 w-8" />
            </div>
            <p className="font-medium text-foreground">You're all caught up!</p>
            <p className="text-sm">Check back later for new alerts.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            <div className="flex flex-col p-4 sm:p-6 space-y-4">
              {notifications.map((notification) => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                  onMarkRead={handleMarkAsRead}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
