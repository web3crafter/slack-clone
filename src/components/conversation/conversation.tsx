import dynamic from "next/dynamic";

import { Doc, Id } from "../../../convex/_generated/dataModel";

import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useGetMember } from "@/features/members/api/use-get-member";

import { LoadingData } from "@/components/loading-data";
import { ConversationHeader } from "@/components/conversation/conversation-header";
import { MessageList } from "@/components/messages/message-list";
import { ConversationChatInput } from "@/components/conversation/conversation-chat-input";

interface ConversationProps {
  conversation: Doc<"conversations">;
  otherMemberId: Id<"members">;
  workspaceId: Id<"workspaces">;
}

export const Conversation = ({
  conversation,
  otherMemberId,
}: ConversationProps) => {
  const { data: otherMember, isLoading: isLoadingOtherMember } = useGetMember({
    memberId: otherMemberId,
  });
  const { results, loadMore, status } = useGetMessages({
    conversationId: conversation._id,
  });

  const isLoadingFirstPage = status === "LoadingFirstPage";

  if (isLoadingOtherMember || isLoadingFirstPage) return <LoadingData />;

  return (
    <div className="flex h-full flex-col">
      <ConversationHeader
        memberName={otherMember?.user.name}
        memberImage={otherMember?.user.image}
        onClick={() => {}}
      />
      <MessageList
        data={results}
        memberName={otherMember?.user.name}
        memberImage={otherMember?.user.image}
        channelName={otherMember?.user.name}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
        variant="conversation"
      />
      <ConversationChatInput
        placeholder={`Message ${otherMember?.user.name}`}
        conversationId={conversation._id}
      />
    </div>
  );
};
