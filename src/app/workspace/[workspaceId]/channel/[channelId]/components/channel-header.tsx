import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

import { replaceWhiteSpace } from "@/lib/utils";
import { useChannelId } from "@/hooks/use-channel-id";

import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";

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
import { useConfirm } from "@/hooks/use-confirm";

interface HeaderProps {
  title: string;
}

export const ChannelHeader = ({ title }: HeaderProps) => {
  const channelId = useChannelId();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState(title);
  const [ConfirmRemoveDialog, confirmRemoveChannel] = useConfirm(
    "Are you sure you want to delete this channel?",
    "This action cannot be undone.",
  );

  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    useUpdateChannel();
  const { mutate: removeChannel, isPending: isRemovingChannel } =
    useRemoveChannel();

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
    const ok = await confirmRemoveChannel();

    if (!ok) return;

    removeChannel(
      { channelId },
      {
        onSuccess: () => {
          toast.success("Channel deleted");
        },
        onError: () => {
          toast.error("Failed to delete channel, Please try again");
        },
      },
    );
  };

  return (
    <>
      <ConfirmRemoveDialog />
      <div className="flex h-[49px] items-center overflow-hidden border-b px-4">
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
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <div className="cursor-pointer rounded-lg border px-5 py-4 hover:bg-secondary/5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Channel name</p>
                      <p className="text-sm font-semibold text-[#1264a3] hover:underline">
                        Edit
                      </p>
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
                        <Button
                          variant={"outline"}
                          disabled={isUpdatingChannel}
                        >
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

              <button
                onClick={handleRemoveChannel}
                className="flex cursor-pointer items-center gap-x-2 rounded-lg border px-5 py-4 text-rose-600 hover:bg-secondary/5"
                disabled={isRemovingChannel}
              >
                <TrashIcon className="size-4" />
                <p className="text-sm font-semibold">Delete channel</p>
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
