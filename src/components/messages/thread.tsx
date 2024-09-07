import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { XIcon } from "lucide-react";
import Quill from "quill";
import { toast } from "sonner";
import { Id } from "../../../convex/_generated/dataModel";

import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetMessage } from "@/features/messages/api/use-get-message";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";

import { Button } from "@/components/ui/button";
import { LoadingData } from "@/components/loading-data";
import { NoDataFound } from "@/components/no-data-found";
import { Message } from "@/components/messages/message";
import { EditorValue } from "@/components/messages/editor";

const Editor = dynamic(() => import("@/components/messages/editor"), {
  ssr: false,
});

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image?: Id<"_storage"> | undefined;
};

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const [editorKey, setEditorKey] = useState(0);

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const editorRef = useRef<Quill | null>(null);

  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: isLoadingMessage } = useGetMessage({
    messageId,
  });

  const { mutate: createMessage, isPending: isCreatingMessage } =
    useCreateMessage();
  const { mutate: generateUploadUrl, isPending: isGeneratingUploadUrl } =
    useGenerateUploadUrl();

  const handleSubmit = ({ body, image }: EditorValue) => {
    editorRef?.current?.enable(false);

    const values: CreateMessageValues = {
      workspaceId,
      channelId,
      parentMessageId: messageId,
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
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[49px] items-center justify-between border-b px-4">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} variant={"ghost"} size={"iconSm"}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      {isLoadingMessage && <LoadingData />}
      {!message && !isLoadingMessage && (
        <NoDataFound message="Message not found" />
      )}
      {message && (
        <>
          <div>
            <Message
              hideThreadButton
              messageId={message._id}
              memberId={message.memberId}
              authorImage={message.user.image}
              authorName={message.user.name}
              isAuthor={message.memberId === currentMember?._id}
              body={message.body}
              image={message.image}
              createdAt={message._creationTime}
              updatedAt={message.updatedAt}
              reactions={message.reactions}
              isEditing={editingId === message._id}
              setEditingId={setEditingId}
            />
          </div>
          <div className="px-4">
            <Editor
              key={editorKey}
              onSubmit={handleSubmit}
              innerRef={editorRef}
              disabled={isCreatingMessage || isGeneratingUploadUrl}
              placeholder="Reply.."
            />
          </div>
        </>
      )}
    </div>
  );
};
