import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";

import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface UseGetMembersProps {
  workspaceId: Id<"workspaces">;
}
export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  return useQuery(convexQuery(api.members.get, { workspaceId }));
};
