"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@/features/auth/components/user-button";

export default function Home() {
  return (
    <div>
      <UserButton />
      <ModeToggle />
    </div>
  );
}
