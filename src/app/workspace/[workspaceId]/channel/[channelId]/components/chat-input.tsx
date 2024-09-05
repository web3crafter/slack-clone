import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { toast } from "sonner";

import { Id } from "../../../../../../../convex/_generated/dataModel";

import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { EditorValue } from "@/components/messages/editor";

const Editor = dynamic(() => import("@/components/messages/editor"), {
  ssr: false,
});

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  body: string;
  image?: Id<"_storage"> | undefined;
};
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
  const { mutate: generateUploadUrl, isPending: isGeneratingUploadUrl } =
    useGenerateUploadUrl();

  const handleSubmit = ({ body, image }: EditorValue) => {
    editorRef?.current?.enable(false);

    const values: CreateMessageValues = {
      channelId,
      workspaceId,
      body,
      image: undefined,
    };

    if (image) {
      generateUploadUrl(
        {},
        {
          onSuccess: async (url) => {
            const result = await fetch(url, {
              method: "POST",
              headers: { "content-type": image.type },
              body: image,
            });

            if (!result.ok) {
              toast.error("Failed to upload image");
            }

            const { storageId } = await result.json();

            values.image = storageId;

            createMessage(values, {
              onSuccess: () => {
                setEditorKey((prevKey) => prevKey + 1);
                toast.success("Message created");
              },
              onError: () => {
                toast.error("Failed to send message");
              },
              onSettled: () => {
                editorRef?.current?.enable(true);
              },
            });
          },
          onError: () => {
            toast.error("Url not found");
          },
        },
      );
    } else {
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
          onSettled: () => {
            editorRef?.current?.enable(true);
          },
        },
      );
    }
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
