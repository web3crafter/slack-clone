"use client";

import { useChannelId } from "@/hooks/use-channel-id";
import { useGetMessages } from "@/hooks/messages/use-get-messages";
import { useGetChannel } from "@/hooks/channels/use-get-chanel";

import { ChannelHeader } from "@/components/channel/channel-header";
import { LoadingData } from "@/components/loading-data";
import { NoDataFound } from "@/components/no-data-found";
import { MessageList } from "@/components/messages/message-list";
import { ChannelChatInput } from "@/components/channel/channel-chat-input";

const ChannelIdPage = () => {
  const channelId = useChannelId();

  const { results, loadMore, isLoadingFirstPage, isLoadingMore, canLoadMore } =
    useGetMessages({
      channelId,
    });

  const {
    data: channel,
    isLoading: isLoadingChannel,
    status: getChannelStatus,
  } = useGetChannel({
    channelId,
  });

  if (isLoadingChannel || isLoadingFirstPage) {
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
        isLoadingMore={isLoadingMore}
        canLoadMore={canLoadMore}
      />
      <ChannelChatInput placeholder={`message #${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
