import { MessageSquareTextIcon, Pencil, Trash } from "lucide-react";
import { BsEmojiSmileFill } from "react-icons/bs";

import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import { EmojiPopover } from "@/components/messages/emoji-popover";

interface MessageToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
}

export const MessageToolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleDelete,
  handleThread,
  handleReaction,
  hideThreadButton,
}: MessageToolbarProps) => {
  return (
    <div className="absolute right-5 top-0">
      <div className="flex items-center rounded-md border bg-background opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
        <EmojiPopover
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
          hint="Add reaction"
        >
          <Button
            variant={"ghost"}
            size={"iconSm"}
            disabled={isPending}
            className="flex items-center justify-center"
          >
            😀
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              variant={"ghost"}
              size={"iconSm"}
              disabled={isPending}
              onClick={handleThread}
            >
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <>
            <Hint label="Edit message">
              <Button
                variant={"ghost"}
                size={"iconSm"}
                disabled={isPending}
                onClick={handleEdit}
              >
                <Pencil className="size-4" />
              </Button>
            </Hint>

            <Hint label="Delete message">
              <Button
                variant={"ghost"}
                size={"iconSm"}
                disabled={isPending}
                onClick={handleDelete}
              >
                <Trash className="size-4 text-destructive" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
};
