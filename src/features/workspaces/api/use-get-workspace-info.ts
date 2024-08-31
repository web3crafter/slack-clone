import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetWorkspaceInfoProps {
  id: Id<"workspaces">;
}
export const useGetWorkspaceInfo = ({ id }: UseGetWorkspaceInfoProps) => {
  return useQuery(convexQuery(api.workspaces.getInfoById, { id }));
};
