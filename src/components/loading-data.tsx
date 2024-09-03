import { Loader } from "lucide-react";

export const LoadingData = () => {
  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <Loader className="size-5 animate-spin text-muted-foreground" />
    </div>
  );
};
