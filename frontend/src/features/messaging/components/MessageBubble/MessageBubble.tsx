import { format } from "date-fns";
import type { MessageDto } from "@/features/messaging";

interface MessageBubbleProps {
  message: MessageDto;
  isOwnMessage: boolean;
  senderName: string;
}

export function MessageBubble({
  message,
  isOwnMessage,
  senderName,
}: MessageBubbleProps) {
  const formattedTime = format(new Date(message.createdAt), "HH:mm");

  return (
    <div
      className={`flex flex-col gap-1 max-w-md ${
        isOwnMessage ? "items-end ml-auto" : "items-start"
      }`}
    >
      <div className="text-[10px] text-slate-400 mb-0.5">
        {formattedTime} • {senderName}
      </div>
      <div
        className={`rounded-2xl px-3 py-2 text-xs shadow-sm ${
          isOwnMessage
            ? "rounded-tr-sm bg-[#00394a] text-white shadow-slate-200"
            : "rounded-tl-sm bg-white border border-slate-200 text-slate-800 shadow-slate-100"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

