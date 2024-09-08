import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";

import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface UseCurrentMemberProps {
  workspaceId: Id<"workspaces">;
}
export const useCurrentMember = ({ workspaceId }: UseCurrentMemberProps) => {
  return useQuery(convexQuery(api.members.current, { workspaceId }));
};
