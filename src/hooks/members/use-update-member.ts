import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../convex/_generated/api";

export const useUpdateMember = () => {
  return useMutation({
    mutationFn: useConvexMutation(api.members.update),
  });
};
