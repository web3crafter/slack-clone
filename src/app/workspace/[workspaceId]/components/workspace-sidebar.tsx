import { WorkspaceHeader } from "@/app/workspace/[workspaceId]/components/workspace-header";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Loader } from "lucide-react";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: isLoadingMember } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: isLoadingWorkspace } = useGetWorkspace({
    id: workspaceId,
  });

  if (isLoadingMember || isLoadingWorkspace) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#5E2C5F]">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!member || !workspace) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-2 bg-[#5E2C5F]">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-sm text-white">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#5E2C5F]">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
    </div>
  );
};
