import { Id } from "../../../convex/_generated/dataModel";
import { XIcon } from "lucide-react";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetMessage } from "@/features/messages/api/use-get-message";
import { useCurrentMember } from "@/features/members/api/use-current-member";

import { Button } from "@/components/ui/button";
import { LoadingData } from "@/components/loading-data";
import { NoDataFound } from "@/components/no-data-found";
import { Message } from "@/components/messages/message";
import { useState } from "react";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: isLoadingMessage } = useGetMessage({
    messageId,
  });

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[49px] items-center justify-between border-b px-4">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} variant={"ghost"} size={"iconSm"}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      {isLoadingMessage && <LoadingData />}
      {!message && !isLoadingMessage && (
        <NoDataFound message="Message not found" />
      )}
      {message && (
        <Message
          hideThreadButton
          messageId={message._id}
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
      )}
    </div>
  );
};
