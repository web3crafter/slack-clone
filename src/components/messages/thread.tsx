import { Button } from "@/components/ui/button";
import { Id } from "../../../convex/_generated/dataModel";
import { XIcon } from "lucide-react";
import { useGetMessage } from "@/features/messages/api/use-get-message";
import { LoadingData } from "@/components/loading-data";
import { NoDataFound } from "@/components/no-data-found";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const { data: message, isLoading: isLoadingMessage } = useGetMessage({
    messageId,
  });

  // if (isLoadingMessage)
  //   return (
  //     <div className="flex h-full flex-col">
  //       <div className="flex h-[49px] items-center justify-between border-b px-4">
  //         <p className="text-lg font-bold">Thread</p>
  //         <Button onClick={onClose} variant={"ghost"} size={"iconSm"}>
  //           <XIcon className="size-5 stroke-[1.5]" />
  //         </Button>
  //       </div>
  //       <LoadingData />
  //     </div>
  //   );

  // if (!message) {
  //   return (
  //     <div className="flex h-full flex-col">
  //       <div className="flex h-[49px] items-center justify-between border-b px-4">
  //         <p className="text-lg font-bold">Thread</p>
  //         <Button onClick={onClose} variant={"ghost"} size={"iconSm"}>
  //           <XIcon className="size-5 stroke-[1.5]" />
  //         </Button>
  //       </div>
  //       <NoDataFound message="Message not found" />
  //     </div>
  //   );
  // }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[49px] items-center justify-between border-b px-4">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} variant={"ghost"} size={"iconSm"}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      {isLoadingMessage && <LoadingData />}
      {!message && <NoDataFound message="Message not found" />}
      {message && <div>{JSON.stringify(message, null, 2)}</div>}
    </div>
  );
};
