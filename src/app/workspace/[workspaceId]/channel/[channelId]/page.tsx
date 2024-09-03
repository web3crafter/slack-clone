"use client";

import { useChannelId } from "@/hooks/use-channel-id";
import { useGetChannel } from "@/features/channels/api/use-get-chanel";

import { ChannelHeader } from "./components/channel-header";
import { ChatInput } from "./components/chat-input";
import { LoadingData } from "@/components/loading-data";
import { NoDataFound } from "@/components/no-data-found";

const ChannelIdPage = () => {
  const channelId = useChannelId();

  const { data: channel, isLoading: isLoadingChannel } = useGetChannel({
    channelId,
  });

  if (isLoadingChannel) {
    return <LoadingData />;
  }

  if (!channel) return <NoDataFound message="Channel not found" />;

  return (
    <div className="flex h-full flex-col">
      <ChannelHeader title={channel.name} />
      <div className="flex-1" />
      <ChatInput />
    </div>
  );
};

export default ChannelIdPage;
