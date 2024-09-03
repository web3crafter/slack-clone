import { TriangleAlert } from "lucide-react";

interface NoDataFoundProps {
  message: string;
}

export const NoDataFound = ({ message }: NoDataFoundProps) => {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-2">
      <TriangleAlert className="size-6 text-destructive" />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  );
};
