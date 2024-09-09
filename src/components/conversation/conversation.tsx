import { Doc, Id } from "../../../convex/_generated/dataModel";

import { useGetMember } from "@/hooks/members/use-get-member";
import { useGetMessages } from "@/hooks/messages/use-get-messages";
import { usePanel } from "@/hooks/use-panel";

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
  const { results, loadMore, isLoadingFirstPage, isLoadingMore, canLoadMore } =
    useGetMessages({
      conversationId: conversation._id,
    });
  const { onOpenProfile } = usePanel();

  if (isLoadingOtherMember || isLoadingFirstPage) return <LoadingData />;

  return (
    <div className="flex h-full flex-col">
      <ConversationHeader
        memberName={otherMember?.user.name}
        memberImage={otherMember?.user.image}
        onClick={() => onOpenProfile(otherMemberId)}
      />
      <MessageList
        data={results}
        memberName={otherMember?.user.name}
        memberImage={otherMember?.user.image}
        channelName={otherMember?.user.name}
        loadMore={loadMore}
        isLoadingMore={isLoadingMore}
        canLoadMore={canLoadMore}
        variant="conversation"
      />
      <ConversationChatInput
        placeholder={`Message ${otherMember?.user.name}`}
        conversationId={conversation._id}
      />
    </div>
  );
};
