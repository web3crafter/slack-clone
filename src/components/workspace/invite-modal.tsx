import { Copy, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { Id } from "../../../convex/_generated/dataModel";
import { useConfirm } from "@/hooks/use-confirm";
import { useNewJoinCode } from "@/hooks/workspaces/use-new-join-code";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface InviteModalProps {
  inviteOpen: boolean;
  setInviteOpen: (open: boolean) => void;
  workspaceName: string;
  workspaceId: Id<"workspaces">;
  joinCode: string;
}

export const InviteModal = ({
  inviteOpen,
  setInviteOpen,
  workspaceName,
  workspaceId,
  joinCode,
}: InviteModalProps) => {
  const { mutate, isPending } = useNewJoinCode();
  const [ConfirmDialog, confirmNewCode] = useConfirm(
    "Are you sure?",
    "This will deactivate the current code and generate a new one",
  );

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      toast.success("Invite link copied to clipboard");
    });
  };

  const handleNewCode = async () => {
    const ok = await confirmNewCode();

    if (!ok) return;

    mutate(
      {
        workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("New invite code regenerated");
        },
        onError: (error) => {
          toast.error("Failed to regenerate invite code, Please try again");
        },
      },
    );
  };
  return (
    <>
      <ConfirmDialog />
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {workspaceName}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-y-4 py-10">
            <p className="text-4xl font-bold uppercase tracking-widest">
              {joinCode}
            </p>
            <Button variant={"ghost"} size={"sm"} onClick={handleCopy}>
              Copy link <Copy className="ml-2 size-4" />
            </Button>
          </div>
          <div className="flex w-full items-center justify-between">
            <Button
              variant={"outline"}
              onClick={handleNewCode}
              disabled={isPending}
            >
              New code
              <RefreshCcw className="ml-2 size-4" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
