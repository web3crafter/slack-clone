"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import VerificationInput from "react-verification-input";
import { Loader } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useJoinWorkspace } from "@/features/workspaces/api/use-join-workspace";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";

import { Button } from "@/components/ui/button";

const JoinWorkspacePage = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });
  const { mutate: joinWorkspace, isPending: isPendingJoinWorkspace } =
    useJoinWorkspace();

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [router, isMember, workspaceId]);

  const handleJoinWorkspace = (value: string) => {
    joinWorkspace(
      { workspaceId, joinCode: value },
      {
        onSuccess: (data) => {
          router.replace(`/workspace/${data.workspaceId}`);
          toast.success("Workspace joined");
        },
        onError: () => {
          toast.error("Failed to join workspace");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-8 rounded-lg bg-white p-8 shadow-md">
      <Image src="/logo.svg" width={60} height={60} alt="logo" />
      <div className="flex max-w-md flex-col items-center justify-center gap-y-4">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h1 className="text-2xl font-bold capitalize">
            Join {data?.workspaceName}
          </h1>
          <p className="font-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          classNames={{
            container: cn(
              "flex gap-x-2",
              isPendingJoinWorkspace && "opacity-50 cursor-not-allowed",
            ),
            character:
              "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-md text-gray-500",
            characterInactive: "mg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          length={6}
          onComplete={handleJoinWorkspace}
          autoFocus
        />
      </div>
      <div className="flex gap-x-4">
        <Button size={"lg"} variant={"outline"} asChild>
          <Link href={"/"}>Back to home</Link>
        </Button>
      </div>
    </div>
  );
};
export default JoinWorkspacePage;
