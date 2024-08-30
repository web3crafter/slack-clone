import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetChannelsProps {
  workspaceId: Id<"workspaces">;
}
export const useGetChannels = ({ workspaceId }: UseGetChannelsProps) => {
  return useQuery(convexQuery(api.channels.get, { workspaceId }));
};
