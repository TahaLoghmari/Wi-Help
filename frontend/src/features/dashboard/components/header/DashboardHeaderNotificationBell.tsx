import { GetNotifications } from "@/features/notifications";
import { ROUTE_PATHS } from "@/config/routes";
import { Link } from "@tanstack/react-router";
import { useCurrentUser } from "@/features/auth";

export function DashboardHeaderNotificationBell() {
  const { data: user } = useCurrentUser();

  const { data: notifications } = GetNotifications();

  const allNotifications =
    notifications?.pages.flatMap((page) => page.items) ?? [];
  const totalUnreadNotifications = allNotifications.filter(
    (n) => n.isRead === false,
  ).length;

  const notificationsPath =
    user?.role === "Professional"
      ? ROUTE_PATHS.PROFESSIONAL.NOTIFICATIONS
      : ROUTE_PATHS.PATIENT.NOTIFICATIONS;

  return (
    <Link to={notificationsPath}>
      {({ isActive }) => (
        <div
          className={`relative rounded-full border border-slate-200 ${isActive ? "bg-[#fcf4d4]" : "hover:border-brand-blue/70 hover:bg-brand-blue/5 bg-white"} pt-2 pr-2 pb-2 pl-2 transition-colors`}
        >
          {isActive ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              className="text-brand-dark h-[18px] w-[18px]"
              fill="currentColor"
            >
              <path d="M320 64C302.3 64 288 78.3 288 96L288 99.2C215 114 160 178.6 160 256L160 277.7C160 325.8 143.6 372.5 113.6 410.1L103.8 422.3C98.7 428.6 96 436.4 96 444.5C96 464.1 111.9 480 131.5 480L508.4 480C528 480 543.9 464.1 543.9 444.5C543.9 436.4 541.2 428.6 536.1 422.3L526.3 410.1C496.4 372.5 480 325.8 480 277.7L480 256C480 178.6 425 114 352 99.2L352 96C352 78.3 337.7 64 320 64zM258 528C265.1 555.6 290.2 576 320 576C349.8 576 374.9 555.6 382 528L258 528z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              className="h-[18px] w-[18px] text-gray-400"
              fill="currentColor"
            >
              <path d="M320 64C306.7 64 296 74.7 296 88L296 97.7C214.6 109.3 152 179.4 152 264L152 278.5C152 316.2 142 353.2 123 385.8L101.1 423.2C97.8 429 96 435.5 96 442.2C96 463.1 112.9 480 133.8 480L506.2 480C527.1 480 544 463.1 544 442.2C544 435.5 542.2 428.9 538.9 423.2L517 385.7C498 353.1 488 316.1 488 278.4L488 263.9C488 179.3 425.4 109.2 344 97.6L344 87.9C344 74.6 333.3 63.9 320 63.9zM488.4 432L151.5 432L164.4 409.9C187.7 370 200 324.6 200 278.5L200 264C200 197.7 253.7 144 320 144C386.3 144 440 197.7 440 264L440 278.5C440 324.7 452.3 370 475.5 409.9L488.4 432zM252.1 528C262 556 288.7 576 320 576C351.3 576 378 556 387.9 528L252.1 528z" />
            </svg>
          )}
          {totalUnreadNotifications > 0 && (
            <span className="bg-brand-teal absolute top-1.5 right-1.5 inline-flex h-1.5 w-1.5 rounded-full"></span>
          )}
        </div>
      )}
    </Link>
  );
}
