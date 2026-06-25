import React from "react";
import { Notification } from "@/types/notifications.types";
import { formatDistanceToNow } from "date-fns";
import { ShieldAlert, ArrowLeftRight, Bell, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "security":
        return <ShieldAlert className="h-5 w-5 text-destructive" />;
      case "transaction":
        return <ArrowLeftRight className="h-5 w-5 text-blue-500" />;
      case "system":
        return <Bell className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const Content = (
    <div
      className={cn(
        "flex gap-4 p-4 rounded-xl border transition-all duration-200",
        notification.read
          ? "bg-card border-border opacity-70"
          : "bg-primary/5 border-primary/20 shadow-sm"
      )}
    >
      <div className="shrink-0 mt-1">
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          notification.read ? "bg-muted" : "bg-background shadow-sm"
        )}>
          {getIcon()}
        </div>
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm font-semibold", !notification.read && "text-foreground")}>
            {notification.title}
          </p>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
      </div>

      {!notification.read && onMarkRead && (
        <div className="shrink-0 flex items-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              onMarkRead(notification.id);
            }}
            className="p-2 hover:bg-primary/10 rounded-full text-primary transition-colors tooltip-trigger"
            title="Mark as read"
          >
            <CheckCircle2 className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );

  if (notification.link) {
    return (
      <Link href={notification.link} className="block group">
        {Content}
      </Link>
    );
  }

  return Content;
}
