import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import Quill from "quill";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const editorRef = useRef<Quill | null>(null);

  const { mutate: createMessage, isPending: isCreatingMessage } =
    useCreateMessage();

  const handleSubmit = ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    console.log({ body, image });
    createMessage(
      {
        workspaceId,
        channelId,
        body,
      },
      {
        onSuccess: () => {
          setEditorKey((prevKey) => prevKey + 1);
          toast.success("Message created");
        },
        onError: () => {
          toast.error("Failed to send message");
        },
      },
    );
  };

  return (
    <div className="w-full px-5">
      <Editor
        key={editorKey}
        variant="create"
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isCreatingMessage}
        innerRef={editorRef}
      />
    </div>
  );
};
