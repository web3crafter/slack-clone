"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useMemberId } from "@/hooks/use-member-id";
import { useCreateOrGetConversation } from "@/hooks/conversations/use-create-or-get-conversation";

import { LoadingData } from "@/components/loading-data";
import { NoDataFound } from "@/components/no-data-found";
import { Conversation } from "@/components/conversation/conversation";

const MemberPage = () => {
  const workspaceId = useWorkspaceId();
  const interactingWithMemberId = useMemberId();

  const {
    mutate: createConversation,
    data: conversation,
    isPending,
    status,
  } = useCreateOrGetConversation();

  useEffect(() => {
    createConversation(
      {
        workspaceId,
        memberId: interactingWithMemberId,
      },
      {
        onSuccess: () => {
          console.log("Conversation created");
        },
        onError: (error) => {
          toast.error("Failed to create or get conversation");
        },
      },
    );
  }, [createConversation, workspaceId, interactingWithMemberId]);

  if (isPending || status === "idle") return <LoadingData />;

  if (!conversation) return <NoDataFound message="Conversation not found" />;

  return (
    <Conversation
      conversation={conversation}
      otherMemberId={interactingWithMemberId}
      workspaceId={workspaceId}
    />
  );
};
export default MemberPage;
