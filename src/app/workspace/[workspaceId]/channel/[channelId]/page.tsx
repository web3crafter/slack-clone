"use client";

import { useChannelId } from "@/hooks/use-channel-id";
import { useGetChannel } from "@/features/channels/api/use-get-chanel";
import { useGetMessages } from "@/features/messages/api/use-get-messages";

import { ChannelHeader } from "./components/channel-header";
import { ChatInput } from "./components/chat-input";
import { LoadingData } from "@/components/loading-data";
import { NoDataFound } from "@/components/no-data-found";
import { MessageList } from "@/components/messages/message-list";

const ChannelIdPage = () => {
  const channelId = useChannelId();

  const { results, status, loadMore } = useGetMessages({ channelId });

  const { data: channel, isLoading: isLoadingChannel } = useGetChannel({
    channelId,
  });

  if (isLoadingChannel || status === "LoadingFirstPage") {
    return <LoadingData />;
  }

  if (!channel) return <NoDataFound message="Channel not found" />;

  return (
    <div className="flex h-full flex-col">
      <ChannelHeader title={channel.name} />
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput placeholder={`message #${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
