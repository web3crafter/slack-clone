"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { ModeToggle } from "@/components/mode-toggle";

import { UserButton } from "@/components/auth/user-button";
import { useCreateWorkspaceModal } from "@/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/hooks/workspaces/use-get-workspaces";

export default function Home() {
  const router = useRouter();
  const { data, isLoading } = useGetWorkspaces();
  const [open, setOpen] = useCreateWorkspaceModal();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [isLoading, workspaceId, open, setOpen, router]);

  return (
    <div className="flex flex-col gap-4">
      {workspaceId}
      <ModeToggle />
      <UserButton />
    </div>
  );
}
