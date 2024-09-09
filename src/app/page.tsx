"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useCreateWorkspaceModal } from "@/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/hooks/workspaces/use-get-workspaces";
import { LoadingData } from "@/components/loading-data";

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
    <div className="flex h-full flex-col items-center justify-center gap-10 py-28">
      <div className="rounded-full bg-gradient-to-b from-[#723474] to-[#3b0c3b] bg-clip-text text-transparent">
        <h1 className="text-6xl font-bold">Slack Clone</h1>
      </div>
      <div>
        <LoadingData />
      </div>
    </div>
  );
}
