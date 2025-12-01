import { format } from "date-fns";
import { useState } from "react";
import { Trash2, Check, CheckCheck } from "lucide-react";
import type { MessageDto } from "@/features/messaging";
import { useDeleteMessage } from "@/features/messaging";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MessageBubbleProps {
  message: MessageDto;
  isOwnMessage: boolean;
  senderName: string;
  conversationId: string;
}

export function MessageBubble({
  message,
  isOwnMessage,
  senderName,
  conversationId,
}: MessageBubbleProps) {
  const formattedTime = format(new Date(message.createdAt), "HH:mm");
  const [showDelete, setShowDelete] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteMessageMutation = useDeleteMessage();

  const getStatusIcon = () => {
    if (!isOwnMessage) return null;

    if (message.status === "Read" || message.readAt) {
      return <CheckCheck className="h-3 w-3 text-blue-400" />;
    }
    if (message.status === "Delivered" || message.deliveredAt) {
      return <CheckCheck className="h-3 w-3 text-slate-400" />;
    }
    return <Check className="h-3 w-3 text-slate-400" />;
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteMessageMutation.mutate(
      {
        messageId: message.id,
        conversationId,
      },
      {
        onSuccess: () => {
          setShowDeleteDialog(false);
        },
      },
    );
  };

  return (
    <div
      className={`flex max-w-md flex-col gap-1 ${
        isOwnMessage ? "ml-auto items-end" : "items-start"
      }`}
      onMouseEnter={() => isOwnMessage && setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div className="mb-0.5 flex items-center gap-1 text-[10px] text-slate-400">
        <span>
          {formattedTime} • {senderName}
        </span>
        {isOwnMessage && getStatusIcon()}
      </div>
      <div className="group relative">
        <div
          className={`rounded-2xl px-3 py-2 text-xs shadow-sm ${
            isOwnMessage
              ? "rounded-tr-sm bg-[#00394a] text-white shadow-slate-200"
              : "rounded-tl-sm border border-slate-200 bg-white text-slate-800 shadow-slate-100"
          }`}
        >
          {message.content}
        </div>
        {isOwnMessage && showDelete && (
          <button
            onClick={handleDelete}
            disabled={deleteMessageMutation.isPending}
            className="absolute top-1/2 -left-8 -translate-y-1/2 rounded p-1 transition-colors hover:bg-slate-100"
            title="Delete message"
          >
            <Trash2 className="h-3.5 w-3.5 text-slate-500" />
          </button>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMessageMutation.isPending}
              className="bg-[#00394a] text-white hover:bg-[#00394a]/90"
            >
              {deleteMessageMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
