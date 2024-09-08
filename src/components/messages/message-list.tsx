import { useState } from "react";
import { differenceInMinutes, format } from "date-fns";
import { Loader } from "lucide-react";

import { Id } from "../../../convex/_generated/dataModel";

import { formatDateLabel, TIME_THRESHOLD } from "@/lib/utils";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { GetMessagesReturnType } from "@/hooks/messages/use-get-messages";
import { useCurrentMember } from "@/hooks/members/use-current-member";

import { Message } from "@/components/messages/message";
import { ChannelHero } from "@/components/channel/channel-hero";
import { ConversationHero } from "@/components/conversation/conversation-hero";

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

export const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  data,
  isLoadingMore,
  loadMore,
  canLoadMore,
  variant = "channel",
}: MessageListProps) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const workspaceId = useWorkspaceId();

  const { data: currentMember } = useCurrentMember({ workspaceId });

  const groupedMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof data>,
  );

  return (
    <div className="messages-scrollbar flex flex-1 flex-col-reverse overflow-y-auto pb-4">
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="relative my-2 text-center">
            <hr className="absolute left-0 right-0 top-1/2 border-t border-secondary" />
            <span className="relative inline-block rounded-full border border-secondary bg-background px-4 py-1 text-xs shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            const isCompact =
              prevMessage &&
              prevMessage.user._id === message.user._id &&
              differenceInMinutes(
                new Date(message._creationTime),
                new Date(prevMessage._creationTime),
              ) < TIME_THRESHOLD;
            return (
              <Message
                key={message?._id}
                messageId={message._id}
                memberId={message.memberId}
                isAuthor={message.memberId === currentMember?._id}
                authorName={message.user.name}
                authorImage={message.user.image}
                body={message.body}
                reactions={message.reactions}
                image={message.image}
                updatedAt={message.updatedAt}
                createdAt={message._creationTime}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadName={message.threadName}
                threadTimestamp={message.threadTimestamp}
                isEditing={editingId === message._id}
                setEditingId={setEditingId}
                isCompact={isCompact}
                hideThreadButton={variant === "thread"}
              />
            );
          })}
        </div>
      ))}
      <div
        className="h-1"
        ref={(el) => {
          if (el) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) {
                  loadMore();
                }
              },
              { threshold: 1.0 },
            );

            observer.observe(el);

            return () => observer.disconnect();
          }
        }}
      />
      {isLoadingMore && (
        <div className="relative my-2 text-center">
          <hr className="absolute left-0 right-0 top-1/2 border-t border-secondary" />
          <span className="relative inline-block rounded-full border border-secondary bg-background px-4 py-1 text-xs shadow-sm">
            <Loader className="size-4 animate-spin" />
          </span>
        </div>
      )}
      {variant === "channel" && channelName && channelCreationTime && (
        <ChannelHero
          channelName={channelName}
          channelCreationTime={channelCreationTime}
        />
      )}
      {variant === "conversation" && (
        <ConversationHero memberName={memberName} memberImage={memberImage} />
      )}
    </div>
  );
};
