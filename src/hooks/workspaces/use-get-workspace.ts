import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface UseGetWorkspaceProps {
  id: Id<"workspaces">;
}
export const useGetWorkspace = ({ id }: UseGetWorkspaceProps) => {
  return useQuery(convexQuery(api.workspaces.getById, { id }));
};
