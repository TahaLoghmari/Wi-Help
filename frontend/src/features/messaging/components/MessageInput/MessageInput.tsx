import { useState, useRef, useEffect, useCallback } from "react";
import type { KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface MessageInputProps {
  onSend: (content: string) => void;
  isSending?: boolean;
  onTyping?: (isTyping: boolean) => void;
}

const TYPING_DEBOUNCE_MS = 500;
const TYPING_TIMEOUT_MS = 2000;

export function MessageInput({
  onSend,
  isSending = false,
  onTyping,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const debounceTimeoutRef = useRef<number | null>(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      // Ensure we send stop typing on unmount if typing
      if (isTypingRef.current && onTyping) {
        onTyping(false);
      }
    };
  }, [onTyping]);

  const sendStopTyping = useCallback(() => {
    if (isTypingRef.current && onTyping) {
      isTypingRef.current = false;
      onTyping(false);
    }
  }, [onTyping]);

  const sendStartTyping = useCallback(() => {
    if (!isTypingRef.current && onTyping) {
      isTypingRef.current = true;
      onTyping(true);
    }
  }, [onTyping]);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isSending) {
      onSend(trimmedMessage);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      // Clear all timeouts and send stop typing
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
      sendStopTyping();
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

    if (!onTyping) return;

    // Clear existing debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // If there's content, start/continue typing indicator
    if (value.trim()) {
      // Debounce the start typing signal to avoid rapid fire
      debounceTimeoutRef.current = window.setTimeout(() => {
        sendStartTyping();
      }, TYPING_DEBOUNCE_MS);

      // Reset the auto-stop timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = window.setTimeout(() => {
        sendStopTyping();
      }, TYPING_TIMEOUT_MS);
    } else {
      // No content, stop typing immediately
      sendStopTyping();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex items-end gap-2">
        <div className="bg-brand-bg flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 px-3 py-1.5">
          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Shift+Enter for new line)"
            className="max-h-32 flex-1 resize-none overflow-y-auto bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
            disabled={isSending}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim() || isSending}
          className="bg-brand-dark hover:bg-brand-secondary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSending ? (
            <Spinner className="h-3.5 w-3.5" />
          ) : (
            <Send className="h-3.5 w-3.5 text-white" strokeWidth={1.5} />
          )}
          Send
        </button>
      </div>
    </div>
  );
}
