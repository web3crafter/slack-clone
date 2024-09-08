import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Loader, XIcon } from "lucide-react";
import Quill from "quill";
import { toast } from "sonner";
import { differenceInMinutes, format } from "date-fns";
import { Id } from "../../../convex/_generated/dataModel";

import { formatDateLabel, TIME_THRESHOLD } from "@/lib/utils";

import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/hooks/members/use-current-member";
import { useGetMessage } from "@/hooks/messages/use-get-message";
import { useGetMessages } from "@/hooks/messages/use-get-messages";
import { useCreateMessage } from "@/hooks/messages/use-create-message";
import { useGenerateUploadUrl } from "@/hooks/upload/use-generate-upload-url";

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
  const { results, status, loadMore } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });

  const { mutate: createMessage, isPending: isCreatingMessage } =
    useCreateMessage();
  const { mutate: generateUploadUrl, isPending: isGeneratingUploadUrl } =
    useGenerateUploadUrl();

  const isLoading = isLoadingMessage && status === "LoadingFirstPage";
  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof results>,
  );

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
      {isLoading && <LoadingData />}
      {!message && !isLoading && <NoDataFound message="Message not found" />}
      {message && (
        <>
          <div className="messages-scrollbar flex flex-1 flex-col-reverse overflow-y-auto pb-4">
            {Object.entries(groupedMessages || {}).map(
              ([dateKey, messages]) => (
                <div key={dateKey}>
                  <div className="relative my-2 text-center">
                    <hr className="absolute left-0 right-0 top-1/2 border-t border-secondary" />
                    <span className="relative inline-block rounded-full border border-secondary bg-background px-4 py-1 text-xs shadow-sm">
                      {formatDateLabel(dateKey)}
                    </span>
                  </div>
                  {messages.map((message, index) => {
                    const prevMessage = messages[index - 1];
                    const isCompact =
                      prevMessage &&
                      prevMessage.user._id === message.user._id &&
                      differenceInMinutes(
                        new Date(message._creationTime),
                        new Date(prevMessage._creationTime),
                      ) < TIME_THRESHOLD;
                    return (
                      <Message
                        key={message?._id}
                        messageId={message._id}
                        memberId={message.memberId}
                        isAuthor={message.memberId === currentMember?._id}
                        authorName={message.user.name}
                        authorImage={message.user.image}
                        body={message.body}
                        reactions={message.reactions}
                        image={message.image}
                        updatedAt={message.updatedAt}
                        createdAt={message._creationTime}
                        threadCount={message.threadCount}
                        threadImage={message.threadImage}
                        threadName={message.threadName}
                        threadTimestamp={message.threadTimestamp}
                        isEditing={editingId === message._id}
                        setEditingId={setEditingId}
                        isCompact={isCompact}
                        hideThreadButton
                      />
                    );
                  })}
                </div>
              ),
            )}
            <div
              className="h-1"
              ref={(el) => {
                if (el) {
                  const observer = new IntersectionObserver(
                    ([entry]) => {
                      if (entry.isIntersecting && canLoadMore) {
                        loadMore();
                      }
                    },
                    { threshold: 1.0 },
                  );

                  observer.observe(el);

                  return () => observer.disconnect();
                }
              }}
            />
            {isLoadingMore && (
              <div className="relative my-2 text-center">
                <hr className="absolute left-0 right-0 top-1/2 border-t border-secondary" />
                <span className="relative inline-block rounded-full border border-secondary bg-background px-4 py-1 text-xs shadow-sm">
                  <Loader className="size-4 animate-spin" />
                </span>
              </div>
            )}
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
