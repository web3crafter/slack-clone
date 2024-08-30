import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash } from "lucide-react";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { useConfirm } from "@/hooks/use-confirm";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface PreferencesModalProps {
  preferencesOpen: boolean;
  setPreferencesOpen: (open: boolean) => void;
  initialValue: string;
}
export const PreferencesModal = ({
  initialValue,
  preferencesOpen,
  setPreferencesOpen,
}: PreferencesModalProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);
  const [ConfirmRemoveDialog, confirmRemoveWorkspace] = useConfirm(
    "Are you sure you want to delete this workspace?",
    "This action cannot be undone.",
  );

  const {
    mutate: updateWorkspace,
    data: updatedWorkspaceData,
    isPending: isUpdatingWorkspace,
  } = useUpdateWorkspace();
  const {
    mutate: removeWorkspace,
    data: removedWorkspaceData,
    isPending: isRemovingWorkspace,
  } = useRemoveWorkspace();

  const handleEditWorkspace = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateWorkspace(
      { id: workspaceId, name: value },
      {
        onSuccess: () => {
          setEditOpen(false);
          toast.success(`Workspace updated`);
        },
        onError: (error) => {
          toast.error("Failed to update workspace, Please try again");
        },
      },
    );
  };

  const handleRemoveWorkspace = async () => {
    const ok = await confirmRemoveWorkspace();

    if (!ok) return;

    removeWorkspace(
      { id: workspaceId },
      {
        onSuccess: () => {
          router.replace("/");
          toast.success(`Workspace deleted`);
        },
        onError: (error) => {
          toast.error("Failed to delete workspace, Please try again");
        },
      },
    );
  };

  return (
    <>
      <ConfirmRemoveDialog />
      <Dialog open={preferencesOpen} onOpenChange={setPreferencesOpen}>
        <DialogContent className="overflow-hidden bg-gray-50 p-0">
          <DialogHeader className="border-b bg-white p-4">
            <DialogTitle>{value}</DialogTitle>
            <DialogDescription className="sr-only">
              Preferences for {value}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-2 px-4 pb-4">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace name</p>
                    <p className="text-sm font-semibold text-[#1264a3] hover:underline">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm">{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEditWorkspace} className="space-y-4">
                  <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={isUpdatingWorkspace}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant={"outline"}
                        disabled={isUpdatingWorkspace}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingWorkspace} type="submit">
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              className="flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-600 hover:bg-gray-50"
              disabled={isRemovingWorkspace}
              onClick={handleRemoveWorkspace}
            >
              <Trash className="size-4" />
              <p className="text-sm font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
