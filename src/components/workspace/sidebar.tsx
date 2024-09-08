"use client";

import { usePathname } from "next/navigation";
import { BellIcon, Home, MessagesSquare, MoreHorizontal } from "lucide-react";

import { SidebarButton } from "@/components/workspace/sidebar-button";
import { WorkspaceSwitcher } from "@/components/workspace/workspace-switcher";
import { UserButton } from "@/components/auth/user-button";

import { ModeToggle } from "@/components/mode-toggle";

export const Sidebar = () => {
  const pathName = usePathname();
  return (
    <aside className="flex h-full w-[70px] flex-col items-center gap-y-4 bg-[#481349] pb-4 pt-[9px]">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={Home}
        label={"Home"}
        isActive={pathName.includes("/workspace")}
      />
      <SidebarButton icon={MessagesSquare} label={"DMs"} />
      <SidebarButton icon={BellIcon} label={"Activity"} />
      <SidebarButton icon={MoreHorizontal} label={"More"} />
      <div className="mt-auto flex flex-col items-center justify-center gap-1">
        <UserButton />
        <ModeToggle />
      </div>
    </aside>
  );
};
