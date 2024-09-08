import { MdOutlineAddReaction } from "react-icons/md";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useCurrentMember } from "@/features/members/api/use-current-member";
import { EmojiPopover } from "@/components/messages/emoji-popover";
import { Hint } from "@/components/hint";

interface ReactionsProps {
  data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  onChange: (value: string) => void;
}

export const Reactions = ({ data, onChange }: ReactionsProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const currentMemberId = currentMember?._id;

  if (data.length === 0 || !currentMemberId) return null;

  return (
    <div className="mb-1 mt-1 flex flex-wrap items-center gap-1">
      {data.map((reaction) => (
        <Hint
          key={reaction._id}
          label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}
        >
          <button
            onClick={() => onChange(reaction.value)}
            className={cn(
              "flex h-6 items-center gap-x-1 rounded-full border border-transparent bg-accent px-2",
              reaction.memberIds.includes(currentMemberId) &&
                "border-violet-500 bg-violet-300/50 dark:border-violet-800 dark:bg-violet-700/50",
            )}
          >
            {reaction.value}
            <span
              className={cn(
                "text-xs font-semibold text-muted-foreground",
                reaction.memberIds.includes(currentMemberId) &&
                  "text-foreground",
              )}
            >
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}
      <EmojiPopover
        hint="Add reaction"
        onEmojiSelect={(emoji) => onChange(emoji.native)}
      >
        <button className="flex h-7 items-center gap-x-1 rounded-full border border-transparent bg-accent px-3 hover:border-violet-500 hover:bg-violet-300/50 dark:hover:dark:border-violet-800 dark:hover:dark:bg-violet-700/50">
          <MdOutlineAddReaction className="size-4" />
        </button>
      </EmojiPopover>
    </div>
  );
};
