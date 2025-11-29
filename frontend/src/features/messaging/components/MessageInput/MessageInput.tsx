import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface MessageInputProps {
  onSend: (content: string) => void;
  isSending?: boolean;
  onTyping?: (isTyping: boolean) => void;
}

export function MessageInput({
  onSend,
  isSending = false,
  onTyping,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isSending) {
      onSend(trimmedMessage);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      if (onTyping) {
        onTyping(false);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (value: string) => {
    setMessage(value);
    if (onTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onTyping(true);
      typingTimeoutRef.current = setTimeout(() => {
        if (onTyping) {
          onTyping(false);
        }
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="border-t border-slate-200 bg-white px-4 sm:px-6 py-3">
      <div className="flex items-end gap-2">
        <div className="flex-1 flex items-center gap-2 rounded-2xl border border-slate-200 bg-[#fbfbfb] px-3 py-1.5">
          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Shift+Enter for new line)"
            className="flex-1 bg-transparent outline-none resize-none text-xs text-slate-800 placeholder:text-slate-400 max-h-32 overflow-y-auto"
            disabled={isSending}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim() || isSending}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00394a] text-[11px] text-white hover:bg-[#00546e] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <Spinner className="h-3.5 w-3.5" />
          ) : (
            <Send className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
          )}
          Send
        </button>
      </div>
    </div>
  );
}

