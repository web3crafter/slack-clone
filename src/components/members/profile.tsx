import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDownIcon, MailIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Id } from "../../../convex/_generated/dataModel";
import { getAvatarFallback } from "@/lib/utils";

import { useGetMember } from "@/hooks/members/use-get-member";
import { useUpdateMember } from "@/hooks/members/use-update-member";
import { useRemoveMember } from "@/hooks/members/use-remove-member";
import { useCurrentMember } from "@/hooks/members/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingData } from "@/components/loading-data";
import { NoDataFound } from "@/components/no-data-found";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [LeaveWorkspaceDialog, confirmLeaveWorkspace] = useConfirm(
    "Are you sure you want to leave workspace?",
    "This action cannot be undone.",
  );
  const [RemoveMemberDialog, confirmRemoveMember] = useConfirm(
    "Are you sure you want to remove this member?",
    "This action cannot be undone.",
  );
  const [UpdateMemberRoleDialog, confirmUpdateMemberRole] = useConfirm(
    "Are you sure you want to update this member's role?",
    "This action cannot be undone.",
  );
  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({ workspaceId });
  const { data: member, isLoading: isLoadingMember } = useGetMember({
    memberId,
  });
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();
  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveMember();

  const handleRemoveMember = async () => {
    const ok = await confirmRemoveMember();
    if (!ok) return;

    removeMember(
      { memberId },
      {
        onSuccess: () => {
          toast.success("Member removed");
          onClose();
        },
        onError: () => {
          toast.error("Failed to remove member");
        },
      },
    );
  };

  const handleLeaveWorkspace = async () => {
    const ok = await confirmLeaveWorkspace();
    if (!ok) return;

    removeMember(
      { memberId },
      {
        onSuccess: () => {
          toast.success("You have left the workspace");
          onClose();
          router.replace("/");
        },
        onError: () => {
          toast.error("Failed to leave workspace");
        },
      },
    );
  };

  const handleUpdateMemberRole = async (role: "admin" | "member") => {
    const ok = await confirmUpdateMemberRole();
    if (!ok) return;

    updateMember(
      { memberId, role },
      {
        onSuccess: () => {
          toast.success("role updated");
        },
        onError: () => {
          toast.error("Failed to update role");
        },
      },
    );
  };

  return (
    <>
      <RemoveMemberDialog />
      <LeaveWorkspaceDialog />
      <UpdateMemberRoleDialog />
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} variant={"ghost"} size={"iconSm"}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        {(isLoadingMember || isLoadingCurrentMember) && <LoadingData />}
        {!member && !isLoadingMember && (
          <NoDataFound message="Profile not found" />
        )}
        {member && (
          <>
            <div className="flex flex-col items-center justify-center p-4">
              <Avatar className="size-full max-h-[256px] max-w-[256px]">
                <AvatarImage src={member.user.image} className="" />
                <AvatarFallback className="aspect-square text-6xl">
                  {(member.user.name && getAvatarFallback(member.user.name)) ??
                    "M"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col p-4">
              <p className="text-xl font-bold">{member.user.name}</p>
              {currentMember?.role === "admin" &&
              currentMember._id !== member._id ? (
                <div className="mt-4 flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={"outline"}
                        disabled={isUpdatingMember}
                        className="w-full capitalize"
                      >
                        {member.role}{" "}
                        <ChevronDownIcon className="ml-2 size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuRadioGroup
                        value={member.role}
                        onValueChange={(role) =>
                          handleUpdateMemberRole(role as "admin" | "member")
                        }
                      >
                        <DropdownMenuRadioItem value="admin">
                          Admin
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="member">
                          Member
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant={"outline"}
                    disabled={isUpdatingMember || isRemovingMember}
                    className="w-full text-destructive"
                    onClick={handleRemoveMember}
                  >
                    Remove
                  </Button>
                </div>
              ) : currentMember?._id === member._id &&
                currentMember.role !== "admin" ? (
                <div className="mt-4">
                  <Button
                    variant={"outline"}
                    disabled={isUpdatingMember || isRemovingMember}
                    className="w-full text-destructive"
                    onClick={handleLeaveWorkspace}
                  >
                    Leave
                  </Button>
                </div>
              ) : null}
            </div>
            <Separator />
            <div className="flex flex-col p-4">
              <p className="mb-4 text-sm font-bold">Contact information</p>
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                  <MailIcon className="size-4" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[13px] font-semibold text-muted-foreground">
                    Email Address
                  </p>
                  <Link
                    href={`mailto:${member.user.email}`}
                    className="text-sm text-[#1264a3] hover:underline"
                  >
                    {member.user.email}
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
