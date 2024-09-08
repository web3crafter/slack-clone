import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { FaChevronDown } from "react-icons/fa";
import { TrashIcon } from "lucide-react";

import { replaceWhiteSpace } from "@/lib/utils";

import { useChannelId } from "@/hooks/use-channel-id";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/hooks/members/use-current-member";
import { useUpdateChannel } from "@/hooks/channels/use-update-channel";
import { useRemoveChannel } from "@/hooks/channels/use-remove-channel";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface HeaderProps {
  title: string;
}

export const ChannelHeader = ({ title }: HeaderProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState(title);
  const [ConfirmRemoveDialog, confirmRemoveChannel] = useConfirm(
    "Delete this channel?",
    "Are you sure you want to delete this channel? This action cannot be undone.",
  );

  const { data: member } = useCurrentMember({
    workspaceId,
  });
  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    useUpdateChannel();
  const { mutate: removeChannel, isPending: isRemovingChannel } =
    useRemoveChannel();

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== "admin") return;
    setIsEditOpen(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = replaceWhiteSpace(e.target.value);
    setName(value);
  };

  const handleEditWorkspace = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel(
      { name, channelId },
      {
        onSuccess: () => {
          toast.success("Channel name updated");
          setIsEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update channel name, Please try again");
        },
      },
    );
  };

  const handleRemoveChannel = async () => {
    if (member?.role !== "admin") return;
    const ok = await confirmRemoveChannel();

    if (!ok) return;

    removeChannel(
      { channelId },
      {
        onSuccess: () => {
          toast.success("Channel deleted");
          router.push(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to delete channel, Please try again");
        },
      },
    );
  };

  return (
    <div className="flex h-[49px] items-center overflow-hidden border-b px-4">
      <ConfirmRemoveDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"ghost"}
            className="w-auto overflow-hidden px-2 text-lg font-semibold"
            size={"sm"}
          >
            <span className="truncate"># {title}</span>
            <FaChevronDown className="ml-2 size-2.5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-hidden p-0">
          <DialogHeader className="border-b bg-secondary/5 p-4">
            <DialogTitle># {title}</DialogTitle>
            <DialogDescription className="sr-only">
              Rename or delete channel
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-2 px-4 pb-4">
            <Dialog open={isEditOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className="cursor-pointer rounded-lg border px-5 py-4 hover:bg-secondary/5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel name</p>
                    {member?.role === "admin" && (
                      <p className="text-sm font-semibold text-[#1264a3] hover:underline">
                        Edit
                      </p>
                    )}
                  </div>
                  <p className="text-sm"># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this channel</DialogTitle>
                  <DialogDescription className="sr-only">
                    Rename channel and click save when done
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEditWorkspace} className="space-y-4">
                  <Input
                    value={name}
                    onChange={handleChange}
                    disabled={isUpdatingChannel}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="e.g. plan-budget"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant={"outline"} disabled={isUpdatingChannel}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isUpdatingChannel}>
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role === "admin" && (
              <button
                onClick={handleRemoveChannel}
                className="flex cursor-pointer items-center gap-x-2 rounded-lg border px-5 py-4 text-rose-600 hover:bg-secondary/5"
                disabled={isRemovingChannel}
              >
                <TrashIcon className="size-4" />
                <p className="text-sm font-semibold">Delete channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
