"use client";

import { CreateChannelModal } from "@/components/channel/create-channel-modal";
import { CreateWorkspaceModal } from "@/components/workspace/create-workspace-modal";
import { useEffect, useState } from "react";

export const Modals = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateWorkspaceModal />
      <CreateChannelModal />
    </>
  );
};
