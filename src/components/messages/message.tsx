import dynamic from "next/dynamic";
import { format } from "date-fns";
import { toast } from "sonner";

import { Doc, Id } from "../../../convex/_generated/dataModel";
import { cn, formatFullTime } from "@/lib/utils";

import { useConfirm } from "@/hooks/use-confirm";
import { usePanel } from "@/hooks/use-panel";

import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageToolbar } from "@/components/messages/message-toolbar";
import { Thumbnail } from "@/components/messages/thumbnail";
import { Reactions } from "@/components/messages/reactions";
import { Hint } from "@/components/hint";

const Renderer = dynamic(() => import("@/components/messages/renderer"), {
  ssr: false,
});
const Editor = dynamic(() => import("@/components/messages/editor"), {
  ssr: false,
});

interface MessageProps {
  messageId: Id<"messages">;
  memberId: Id<"members">;
  isAuthor: boolean;
  authorName?: string;
  authorImage?: string;
  body: Doc<"messages">["body"];
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  image?: string | null;
  updatedAt?: Doc<"messages">["updatedAt"];
  createdAt: Doc<"messages">["_creationTime"];
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
  isEditing: boolean;
  setEditingId: (messageId: Id<"messages"> | null) => void;
  isCompact?: boolean;
  hideThreadButton?: boolean;
}

export const Message = ({
  messageId,
  isAuthor,
  memberId,
  authorImage,
  authorName = "Member",
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp,
}: MessageProps) => {
  const [ConfirmDialog, confirmDeleteMessage] = useConfirm(
    "Delete message",
    "Are you sure you want to delete this message? This action cannot be undone.",
  );
  const { parentMessageId, onOpenMessage, onCloseMessage } = usePanel();
  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();
  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage();
  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction();
  const avatarFallback = authorName.charAt(0).toUpperCase();

  const isPending =
    isUpdatingMessage || isRemovingMessage || isTogglingReaction;

  const handleUpdateMessage = ({ body }: { body: string }) => {
    updateMessage(
      {
        messageId,
        body,
      },
      {
        onSuccess: () => {
          toast.success("Message updated");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to update message");
        },
      },
    );
  };

  const handleToggleReaction = async (value: string) => {
    toggleReaction(
      {
        messageId,
        value,
      },
      {
        onError: () => {
          toast.error("Failed to add reaction");
        },
      },
    );
  };

  const handleRemoveMessage = async () => {
    const ok = await confirmDeleteMessage();
    if (!ok) return;
    removeMessage(
      {
        messageId,
      },
      {
        onSuccess: () => {
          toast.success("Message removed");

          if (parentMessageId === messageId) {
            onCloseMessage();
          }
        },
        onError: () => {
          toast.error("Failed to remove message");
        },
      },
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "group relative flex flex-col gap-2 p-1.5 px-5 hover:bg-secondary/60",
            isEditing && "bg-yellow-400/20 hover:bg-yellow-400/20",
            isRemovingMessage &&
              "origin-bottom scale-y-0 transform bg-rose-500/50 transition-all duration-200",
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="w-[40px] text-center text-xs leading-[22px] text-muted-foreground opacity-0 hover:underline group-hover:opacity-100">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <div className="h-full w-full">
                <Editor
                  onSubmit={handleUpdateMessage}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex w-full flex-col">
                <Renderer value={body} />
                <Thumbnail url={image} />
                {updatedAt && (
                  <span className="text-xs text-muted-foreground">
                    (edited)
                  </span>
                )}
                <Reactions data={reactions} onChange={handleToggleReaction} />
              </div>
            )}
          </div>
          {!isEditing && (
            <MessageToolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(messageId)}
              handleDelete={handleRemoveMessage}
              handleThread={() => onOpenMessage(messageId)}
              handleReaction={handleToggleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "group relative flex flex-col gap-2 p-1.5 px-5 hover:bg-secondary/60",
          isEditing && "bg-yellow-400/20 hover:bg-yellow-400/20",
          isRemovingMessage &&
            "origin-bottom scale-y-0 transform bg-rose-500/50 transition-all duration-200",
        )}
      >
        <div className="flex items-start gap-2">
          <button>
            <Avatar>
              <AvatarImage src={authorImage} className="" />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="h-full w-full">
              <Editor
                onSubmit={handleUpdateMessage}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex w-full flex-col overflow-hidden">
              <div className="text-sm">
                <button
                  onClick={() => {}}
                  className="font-bold text-primary hover:underline"
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt), "h:mm a")}
                  </button>
                </Hint>
              </div>

              <Renderer value={body} />
              <Thumbnail url={image} />
              {updatedAt && (
                <span className="text-xs text-muted-foreground">(edited)</span>
              )}
              <Reactions data={reactions} onChange={handleToggleReaction} />
            </div>
          )}
        </div>
        {!isEditing && (
          <MessageToolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(messageId)}
            handleDelete={handleRemoveMessage}
            handleThread={() => onOpenMessage(messageId)}
            handleReaction={handleToggleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};
