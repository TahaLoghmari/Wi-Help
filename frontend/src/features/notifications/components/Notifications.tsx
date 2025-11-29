import {
  CheckCircle2,
  Inbox,
  CalendarClock,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import {
  GetNotifications,
  MarkNotificationsRead,
  MarkNotificationRead,
  NOTIFICATION_TYPE_TO_ICON,
} from "@/features/notifications";
import { Spinner } from "@/components/ui/spinner";
import { formatDistanceToNow } from "date-fns";

export function Notifications() {
  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
  } = GetNotifications();
  const markAllNotificationsReadMutation = MarkNotificationsRead();
  const markNotificationReadMutation = MarkNotificationRead();

  const allNotifications =
    notifications?.pages.flatMap((page) => page.items) ?? [];

  return (
    <section
      id="page-notifications"
      className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-[#00394a]">
            Notifications
          </h2>
          <p className="mt-0.5 max-w-xl text-[11px] text-slate-500">
            Stay on top of appointment changes, messages, and important clinical
            alerts.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <button
            onClick={() => markAllNotificationsReadMutation.mutate()}
            disabled={markAllNotificationsReadMutation.isPending}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 transition-colors hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5 disabled:opacity-50"
          >
            {markAllNotificationsReadMutation.isPending ? (
              <Spinner className="h-3.5 w-3.5" />
            ) : (
              <CheckCircle2
                className="h-3.5 w-3.5 text-[#14d3ac]"
                strokeWidth={1.5}
              />
            )}
            <span>Mark all as read</span>
          </button>
        </div>
      </div>

      {/* Notification Filters */}
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <button className="inline-flex items-center gap-1.5 rounded-full bg-[#00394a] px-2.5 py-1.5 text-white hover:bg-[#00546e]">
          <Inbox className="h-3.5 w-3.5 text-white" strokeWidth={1.5} />
          All
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5">
          <CalendarClock
            className="h-3.5 w-3.5 text-slate-500"
            strokeWidth={1.5}
          />
          Appointments
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5">
          <MessageCircle
            className="h-3.5 w-3.5 text-slate-500"
            strokeWidth={1.5}
          />
          Messages
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5">
          <AlertTriangle
            className="h-3.5 w-3.5 text-[#f97316]"
            strokeWidth={1.5}
          />
          Clinical alerts
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Spinner />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center gap-2 py-10">
            <span className="text-muted-foreground text-sm">
              Failed to load notifications.
            </span>
            <button
              onClick={() => refetch()}
              className="text-xs text-[#3fa6ff] hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && allNotifications.length === 0 && (
          <div className="flex items-center justify-center py-10 text-xs text-slate-500">
            No notifications found.
          </div>
        )}

        {!isLoading && !isError && allNotifications.length > 0 && (
          <div className="space-y-2">
            <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
              <span className="h-px flex-1 bg-slate-200"></span>
              <span className="tracking-wide uppercase">Today</span>
              <span className="h-px flex-1 bg-slate-200"></span>
            </div>

            {allNotifications.map((notification) => {
              const Icon = NOTIFICATION_TYPE_TO_ICON[notification.type];
              return (
                <article
                  key={notification.id}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm shadow-slate-100 transition-all hover:border-[#3fa6ff]/70 hover:shadow-md"
                >
                  <div className="mt-0.5">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#3fa6ff]/10 text-[#00394a]">
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-medium tracking-tight text-slate-900">
                          {notification.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-600">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {!notification.isRead && (
                          <button
                            onClick={() =>
                              markNotificationReadMutation.mutate({
                                notificationId: notification.id,
                              })
                            }
                            disabled={markNotificationReadMutation.isPending}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-700 transition-colors hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5 disabled:opacity-50"
                          >
                            <CheckCircle2
                              className="h-3 w-3 text-[#14d3ac]"
                              strokeWidth={1.5}
                            />
                            Mark as read
                          </button>
                        )}
                        <span className="text-[10px] whitespace-nowrap text-slate-400">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            },
                          )}
                        </span>
                        {!notification.isRead && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#ffecb4] bg-[#ffecb4]/60 px-2 py-0.5 text-[10px] text-[#00394a]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#f97316]"></span>
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
