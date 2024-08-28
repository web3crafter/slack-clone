"use client";

import { useEffect, useMemo } from "react";

import { ModeToggle } from "@/components/mode-toggle";

import { UserButton } from "@/features/auth/components/user-button";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

export default function Home() {
  const { data, isLoading } = useGetWorkspaces();
  const [open, setOpen] = useCreateWorkspaceModal();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      console.log("Redirect to workspace", workspaceId);
    } else if (!open) {
      setOpen(true);
    }
  }, [isLoading, workspaceId, open, setOpen]);

  return (
    <div className="flex flex-col gap-4">
      <ModeToggle />
      <UserButton />
    </div>
  );
}
