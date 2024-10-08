"use client";

import { Id } from "../../../../convex/_generated/dataModel";

import { usePanel } from "@/hooks/use-panel";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Toolbar } from "@/components/workspace/toolbar";
import { LoadingData } from "@/components/loading-data";
import { Thread } from "@/components/messages/thread";
import { Sidebar } from "@/components/workspace/sidebar";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { Profile } from "@/components/members/profile";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const { parentMessageId, onClose, profileMemberId } = usePanel();

  const showPanel = !!parentMessageId || !!profileMemberId;

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId={"w3c-workspace-layout"}
          id={"workspace-layout"}
        >
          <ResizablePanel
            id="workspace-sidebar"
            defaultSize={15}
            minSize={11}
            className="bg-[#5E2C5F]"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel id="main-panel" minSize={20} defaultSize={85}>
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel id="thread-panel" defaultSize={29} minSize={20}>
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<"messages">}
                    onClose={onClose}
                  />
                ) : profileMemberId ? (
                  <Profile
                    memberId={profileMemberId as Id<"members">}
                    onClose={onClose}
                  />
                ) : (
                  <LoadingData />
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
export default WorkspaceIdLayout;
