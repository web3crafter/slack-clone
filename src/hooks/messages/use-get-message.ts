import { useQuery } from "@tanstack/react-query";
import { api } from "../../../convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { Id } from "../../../convex/_generated/dataModel";

interface UseGetMessageProps {
  messageId: Id<"messages">;
}

export const useGetMessage = ({ messageId }: UseGetMessageProps) => {
  return useQuery(convexQuery(api.messages.getById, { messageId }));
};
