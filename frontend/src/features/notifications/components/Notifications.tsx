import {
  CheckCircle2,
  Inbox,
  CalendarClock,
  MessageCircle,
  Star,
} from "lucide-react";
import {
  GetNotifications,
  MarkNotificationsRead,
  MarkNotificationRead,
  NOTIFICATION_TYPE_TO_ICON,
  NotificationType,
} from "@/features/notifications";
import { Spinner } from "@/components/ui/spinner";
import { formatDistanceToNow } from "date-fns";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

type NotificationFilter = "all" | "appointments" | "messages" | "reviews";

export function Notifications() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");

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

  // Filter notifications based on active filter
  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") {
      return allNotifications;
    }

    if (activeFilter === "appointments") {
      const appointmentTypes: NotificationType[] = [
        NotificationType.newAppointment,
        NotificationType.appointmentAccepted,
        NotificationType.appointmentRejected,
        NotificationType.appointmentCancelled,
        NotificationType.appointmentCompleted,
        NotificationType.newPrescription,
      ];
      return allNotifications.filter((notification) =>
        appointmentTypes.includes(notification.type),
      );
    }

    if (activeFilter === "messages") {
      return allNotifications.filter(
        (notification) => notification.type === NotificationType.newMessage,
      );
    }

    if (activeFilter === "reviews") {
      return allNotifications.filter(
        (notification) => notification.type === NotificationType.newReview,
      );
    }

    return allNotifications;
  }, [allNotifications, activeFilter]);

  const getFilterCount = (filter: NotificationFilter) => {
    if (filter === "all") {
      return allNotifications.filter((n) => !n.isRead).length;
    }

    if (filter === "appointments") {
      const appointmentTypes: NotificationType[] = [
        NotificationType.newAppointment,
        NotificationType.appointmentAccepted,
        NotificationType.appointmentRejected,
        NotificationType.appointmentCancelled,
        NotificationType.appointmentCompleted,
        NotificationType.newPrescription,
      ];
      return allNotifications.filter(
        (notification) =>
          appointmentTypes.includes(notification.type) && !notification.isRead,
      ).length;
    }

    if (filter === "messages") {
      return allNotifications.filter(
        (notification) =>
          notification.type === NotificationType.newMessage &&
          !notification.isRead,
      ).length;
    }

    if (filter === "reviews") {
      return allNotifications.filter(
        (notification) =>
          notification.type === NotificationType.newReview &&
          !notification.isRead,
      ).length;
    }

    return 0;
  };

  return (
    <section
      id="page-notifications"
      className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-brand-dark text-sm font-semibold tracking-tight">
            {t("notifications.title")}
          </h2>
          <p className="mt-0.5 max-w-xl text-[11px] text-slate-500">
            {t("notifications.description")}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <button
            onClick={() => markAllNotificationsReadMutation.mutate()}
            disabled={markAllNotificationsReadMutation.isPending}
            className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 transition-colors disabled:opacity-50"
          >
            {markAllNotificationsReadMutation.isPending ? (
              <Spinner className="h-3.5 w-3.5" />
            ) : (
              <CheckCircle2
                className="text-brand-teal h-3.5 w-3.5"
                strokeWidth={1.5}
              />
            )}
            <span>{t("notifications.markAllAsRead")}</span>
          </button>
        </div>
      </div>

      {/* Notification Filters */}
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <button
          onClick={() => setActiveFilter("all")}
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-colors ${
            activeFilter === "all"
              ? "bg-brand-dark hover:bg-brand-secondary text-white"
              : "hover:border-brand-blue/70 hover:bg-brand-blue/5 border border-slate-200 bg-white text-slate-700"
          }`}
        >
          <Inbox
            className={`h-3.5 w-3.5 ${activeFilter === "all" ? "text-white" : "text-slate-500"}`}
            strokeWidth={1.5}
          />
          <span>{t("notifications.filters.all")}</span>
          {getFilterCount("all") > 0 && (
            <span
              className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                activeFilter === "all"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {getFilterCount("all")}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveFilter("appointments")}
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-colors ${
            activeFilter === "appointments"
              ? "bg-brand-dark hover:bg-brand-secondary text-white"
              : "hover:border-brand-blue/70 hover:bg-brand-blue/5 border border-slate-200 bg-white text-slate-700"
          }`}
        >
          <CalendarClock
            className={`h-3.5 w-3.5 ${activeFilter === "appointments" ? "text-white" : "text-slate-500"}`}
            strokeWidth={1.5}
          />
          <span>{t("notifications.filters.appointments")}</span>
          {getFilterCount("appointments") > 0 && (
            <span
              className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                activeFilter === "appointments"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {getFilterCount("appointments")}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveFilter("messages")}
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-colors ${
            activeFilter === "messages"
              ? "bg-brand-dark hover:bg-brand-secondary text-white"
              : "hover:border-brand-blue/70 hover:bg-brand-blue/5 border border-slate-200 bg-white text-slate-700"
          }`}
        >
          <MessageCircle
            className={`h-3.5 w-3.5 ${activeFilter === "messages" ? "text-white" : "text-slate-500"}`}
            strokeWidth={1.5}
          />
          <span>{t("notifications.filters.messages")}</span>
          {getFilterCount("messages") > 0 && (
            <span
              className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                activeFilter === "messages"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {getFilterCount("messages")}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveFilter("reviews")}
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-colors ${
            activeFilter === "reviews"
              ? "bg-brand-dark hover:bg-brand-secondary text-white"
              : "hover:border-brand-blue/70 hover:bg-brand-blue/5 border border-slate-200 bg-white text-slate-700"
          }`}
        >
          <Star
            className={`h-3.5 w-3.5 ${activeFilter === "reviews" ? "text-white" : "text-slate-500"}`}
            strokeWidth={1.5}
          />
          <span>{t("notifications.filters.reviews")}</span>
          {getFilterCount("reviews") > 0 && (
            <span
              className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                activeFilter === "reviews"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {getFilterCount("reviews")}
            </span>
          )}
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
              {t("notifications.error")}
            </span>
            <button
              onClick={() => refetch()}
              className="text-brand-blue text-xs hover:underline"
            >
              {t("notifications.retry")}
            </button>
          </div>
        )}

        {!isLoading && !isError && filteredNotifications.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-10">
            <div className="bg-brand-blue/10 text-brand-dark inline-flex h-12 w-12 items-center justify-center rounded-full">
              {activeFilter === "all" && (
                <Inbox className="h-6 w-6" strokeWidth={1.5} />
              )}
              {activeFilter === "appointments" && (
                <CalendarClock className="h-6 w-6" strokeWidth={1.5} />
              )}
              {activeFilter === "messages" && (
                <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
              )}
              {activeFilter === "reviews" && (
                <Star className="h-6 w-6" strokeWidth={1.5} />
              )}
            </div>
            <span className="text-muted-foreground text-sm">
              {activeFilter === "all" && t("notifications.empty.all")}
              {activeFilter === "appointments" &&
                t("notifications.empty.appointments")}
              {activeFilter === "messages" && t("notifications.empty.messages")}
              {activeFilter === "reviews" && t("notifications.empty.reviews")}
            </span>
          </div>
        )}

        {!isLoading && !isError && filteredNotifications.length > 0 && (
          <div className="space-y-2">
            <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
              <span className="h-px flex-1 bg-slate-200"></span>
              <span className="tracking-wide uppercase">
                {t("notifications.today")}
              </span>
              <span className="h-px flex-1 bg-slate-200"></span>
            </div>

            {filteredNotifications.map((notification) => {
              const Icon = NOTIFICATION_TYPE_TO_ICON[notification.type];
              return (
                <article
                  key={notification.id}
                  className="hover:border-brand-blue/70 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm shadow-slate-100 transition-all hover:shadow-md"
                >
                  <div className="mt-0.5">
                    <span className="bg-brand-blue/10 text-brand-dark inline-flex h-7 w-7 items-center justify-center rounded-full">
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-xs font-medium tracking-tight text-slate-900">
                          {notification.title}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[10px] whitespace-nowrap text-slate-400">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            },
                          )}
                        </span>
                        {!notification.isRead && (
                          <>
                            <button
                              onClick={() =>
                                markNotificationReadMutation.mutate({
                                  notificationId: notification.id,
                                })
                              }
                              disabled={markNotificationReadMutation.isPending}
                              className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-700 transition-colors disabled:opacity-50"
                            >
                              <CheckCircle2
                                className="text-brand-teal h-3 w-3"
                                strokeWidth={1.5}
                              />
                              {t("notifications.markAsRead")}
                            </button>
                            <span className="border-brand-cream bg-brand-cream/60 text-brand-dark inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#f97316]"></span>
                              {t("notifications.new")}
                            </span>
                          </>
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
