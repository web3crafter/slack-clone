import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../convex/_generated/api";

export const useJoinWorkspace = () => {
  return useMutation({
    mutationFn: useConvexMutation(api.workspaces.join),
  });
};
