import dynamic from "next/dynamic";
import { format } from "date-fns";

import { Doc, Id } from "../../../convex/_generated/dataModel";
import { formatFullTime } from "@/lib/utils";

import { Hint } from "@/components/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Thumbnail } from "@/components/messages/thumbnail";

const Renderer = dynamic(() => import("@/components/messages/renderer"), {
  ssr: false,
});

interface MessageProps {
  id: Id<"messages">;
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
  setEditingId: (id: Id<"messages"> | null) => void;
  isCompact?: boolean;
  hideThreadButton?: boolean;
}

export const Message = ({
  id,
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
  const avatarFallback = authorName.charAt(0).toUpperCase();

  if (isCompact) {
    return (
      <div className="group relative flex flex-col gap-2 p-1.5 px-5 hover:bg-secondary/60">
        <div className="flex items-start gap-2">
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className="w-[40px] text-center text-xs leading-[22px] text-muted-foreground opacity-0 hover:underline group-hover:opacity-100">
              {format(new Date(createdAt), "hh:mm")}
            </button>
          </Hint>
          <div className="flex w-full flex-col">
            <Renderer value={body} />
            <Thumbnail url={image} />
            {updatedAt && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col gap-2 p-1.5 px-5 hover:bg-secondary/60">
      <div className="flex items-start gap-2">
        <button>
          <Avatar>
            <AvatarImage src={authorImage} className="" />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </button>
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
        </div>
      </div>
    </div>
  );
};
