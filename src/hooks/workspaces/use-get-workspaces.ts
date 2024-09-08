import { useQuery } from "@tanstack/react-query";
import { api } from "../../../convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";

export const useGetWorkspaces = () => {
  return useQuery(convexQuery(api.workspaces.get, {}));
};
