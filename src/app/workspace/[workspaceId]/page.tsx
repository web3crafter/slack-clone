"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/hooks/members/use-current-member";
import { useGetWorkspace } from "@/hooks/workspaces/use-get-workspace";
import { useGetChannels } from "@/hooks/channels/use-get-channels";

import { useCreateChannelModal } from "@/store/use-create-channel-modal";

import { LoadingData } from "@/components/loading-data";
import { NoDataFound } from "@/components/no-data-found";

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const [open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: isLoadingMember } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: isLoadingWorkspace } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: isLoadingChannels } = useGetChannels({
    workspaceId,
  });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

  useEffect(() => {
    if (
      isLoadingWorkspace ||
      isLoadingChannels ||
      isLoadingMember ||
      !member ||
      !workspace
    )
      return;

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    open,
    setOpen,
    router,
    workspace,
    member,
    isAdmin,
    workspaceId,
    channelId,
    isLoadingMember,
    isLoadingChannels,
    isLoadingWorkspace,
  ]);

  if (isLoadingWorkspace || isLoadingChannels || isLoadingMember) {
    return <LoadingData />;
  }

  if (!workspace || !member) {
    return <NoDataFound message="Workspace not found" />;
  }

  return <NoDataFound message="Channel not found" />;
};

export default WorkspaceIdPage;
