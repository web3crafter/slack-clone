import { usePaginatedQuery } from "convex/react";

import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

const BATCH_SIZE = 20;
export type GetMessagesReturnType =
  (typeof api.messages.get._returnType)["page"];

interface UseGetMessagesProps {
  channelId?: Id<"channels">;
  conversationId?: Id<"conversations">;
  parentMessageId?: Id<"messages">;
}

export const useGetMessages = ({
  channelId,
  conversationId,
  parentMessageId,
}: UseGetMessagesProps) => {
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.messages.get,
    { channelId, conversationId, parentMessageId },
    {
      initialNumItems: BATCH_SIZE,
    },
  );

  const isLoadingFirstPage = status === "LoadingFirstPage";
  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";
  const isExhausted = status === "Exhausted";

  return {
    results,
    status,
    isLoading,
    isLoadingFirstPage,
    canLoadMore,
    isLoadingMore,
    isExhausted,
    loadMore: () => loadMore(BATCH_SIZE),
  };
};
