"use client";

import { useChannelId } from "@/hooks/use-channel-id";
import { useGetChannel } from "@/features/channels/api/use-get-chanel";
import { useGetMessages } from "@/features/messages/api/use-get-messages";

import { ChannelHeader } from "./components/channel-header";
import { ChatInput } from "./components/chat-input";
import { LoadingData } from "@/components/loading-data";
import { NoDataFound } from "@/components/no-data-found";

const ChannelIdPage = () => {
  const channelId = useChannelId();

  const { results } = useGetMessages({ channelId });
  console.log("results:", results);

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
      <div className="flex-1">{JSON.stringify(results)}</div>
      <ChatInput placeholder={`message #${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
