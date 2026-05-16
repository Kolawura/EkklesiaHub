"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, patchRequest, deleteRequest } from "@/lib/service";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Loader2,
  MessageCircle,
  Heart,
  UserPlus,
  Reply,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

type Notification = {
  id: string;
  type: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
};

type NotificationsResponse = {
  data: {
    unreadCount: number;
    notifications: Notification[];
  };
};

const ICONS: Record<string, LucideIcon> = {
  NEW_COMMENT: MessageCircle,
  NEW_REACTION: Heart,
  NEW_FOLLOWER: UserPlus,
  NEW_REPLY: Reply,
  COMMUNITY_INVITE: Users,
};

const relativeTime = (d: string) => {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getRequest("/notifications"),
    refetchInterval: 30_000,
    enabled: isAuthenticated,
    staleTime: 1000 * 30, // notifications should feel live — 30s stale
  });

  const unread: number = data?.data?.unreadCount ?? 0;
  const notifications: Notification[] = data?.data?.notifications ?? [];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = useMutation({
    mutationFn: (id: string) => patchRequest(`/notifications/${id}/read`, {}),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAll = useMutation({
    mutationFn: () => patchRequest("/notifications/read-all", {}),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteRequest(`/notifications/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  if (!isAuthenticated) return null;

  return (
    <div ref={panelRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-1.5 text-ink-ghost hover:text-ink hover:bg-parchment-deep rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell size={17} />
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 max-h-130 flex flex-col bg-parchment rounded-2xl shadow-warm-lg border border-parchment-dark z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-parchment-dark shrink-0">
            <h3 className="font-display text-[0.9375rem] font-semibold text-ink flex items-center gap-2">
              Notifications
              {unread > 0 && (
                <span className="font-body text-[11px] font-medium bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full">
                  {unread} new
                </span>
              )}
            </h3>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button
                  onClick={() => markAll.mutate()}
                  disabled={markAll.isPending}
                  className="inline-flex items-center gap-1 font-body text-xs text-gold hover:underline px-2 py-1 rounded disabled:opacity-50"
                  title="Mark all read"
                >
                  <CheckCheck size={12} />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-ink-ghost hover:text-ink rounded-lg transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 size={22} className="animate-spin text-ink-ghost" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-14">
                <Bell size={32} className="mx-auto text-parchment-dark mb-3" />
                <p className="font-body text-sm text-ink-ghost">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((n: Notification) => {
                const Icon = ICONS[n.type] ?? Bell;
                return (
                  <div
                    key={n.id}
                    className={[
                      "group flex items-start gap-3 px-5 py-3.5 hover:bg-parchment-deep transition-colors",
                      !n.read ? "bg-gold-bg/40" : "",
                    ].join(" ")}
                  >
                    {/* Icon bubble */}
                    <div
                      className={[
                        "shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5",
                        !n.read
                          ? "bg-gold-bg border border-gold-pale"
                          : "bg-parchment-deep border border-parchment-dark",
                      ].join(" ")}
                    >
                      <Icon
                        size={14}
                        className={!n.read ? "text-gold" : "text-ink-ghost"}
                      />
                    </div>

                    {/* Message */}
                    <div className="flex-1 min-w-0">
                      {n.link ? (
                        <Link
                          href={n.link}
                          onClick={() => {
                            if (!n.read) markRead.mutate(n.id);
                            setOpen(false);
                          }}
                          className="font-body text-sm text-ink-light hover:text-gold transition-colors line-clamp-2"
                        >
                          {n.message}
                        </Link>
                      ) : (
                        <p className="font-body text-sm text-ink-light line-clamp-2">
                          {n.message}
                        </p>
                      )}
                      <p className="font-body text-xs text-ink-ghost mt-0.5">
                        {relativeTime(n.createdAt)}
                      </p>
                    </div>

                    {/* Actions — appear on hover */}
                    <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!n.read && (
                        <button
                          onClick={() => markRead.mutate(n.id)}
                          className="p-1.5 text-ink-ghost hover:text-gold rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check size={12} />
                        </button>
                      )}
                      <button
                        onClick={() => remove.mutate(n.id)}
                        className="p-1.5 text-ink-ghost hover:text-red-600 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
