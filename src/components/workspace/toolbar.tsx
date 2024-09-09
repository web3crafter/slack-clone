"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Info, Search } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { Id } from "../../../convex/_generated/dataModel";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace } from "@/hooks/workspaces/use-get-workspace";
import { useGetChannels } from "@/hooks/channels/use-get-channels";
import { useGetMembers } from "@/hooks/members/use-get-members";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Toolbar = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { data } = useGetWorkspace({ id: workspaceId });
  const { data: channels, isLoading: isLoadingChannels } = useGetChannels({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const handleChannelClick = (channelId: Id<"channels">) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
  };

  const handleMemberClick = (memberId: Id<"members">) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  };

  return (
    <nav className="flex h-10 items-center justify-between bg-[#481349] p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-w-[642px] shrink grow-[2]">
        <Button
          onClick={() => setOpen(true)}
          size={"sm"}
          className="h-7 w-full justify-start bg-accent/25 px-2 hover:bg-accent/25"
        >
          <Search className="mr-2 size-4 text-white" />
          <span className="text-xs text-white">Search {data?.name}</span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <VisuallyHidden.Root>
            <DialogHeader>
              <DialogTitle>Search workspace</DialogTitle>

              <DialogDescription>
                Search the workspace for channels and members and click on the
                result to open the channel or member
              </DialogDescription>
            </DialogHeader>
          </VisuallyHidden.Root>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  onSelect={() => handleChannelClick(channel._id)}
                >
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem
                  key={member._id}
                  onSelect={() => handleMemberClick(member._id)}
                >
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className="ml-auto flex flex-1 items-center justify-end">
        <Button variant={"transparent"} size={"iconSm"}>
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
