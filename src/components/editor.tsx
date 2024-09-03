import { MutableRefObject, useEffect, useRef } from "react";
import Quill, { QuillOptions } from "quill";
import { Delta, Op } from "quill/core";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import { ImageIcon, Smile } from "lucide-react";

import "quill/dist/quill.snow.css";

import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";

type EditorValue = {
  image: File | null;
  body: string;
};
interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  variant?: "create" | "update";
}

const Editor = ({
  onSubmit,
  onCancel,
  innerRef,
  defaultValue = [],
  disabled = false,
  variant = "create",
  placeholder = "Write something...",
}: EditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      document.createElement("div"),
    );

    const options: QuillOptions = {
      theme: "snow",
    };

    new Quill(editorContainer, options);

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col overflow-hidden rounded-md border border-slate-200 transition focus-within:border-slate-300 focus-within:shadow-sm dark:border-secondary/50 focus-within:dark:border-secondary">
        <div ref={containerRef} className="ql-custom h-full" />
        <div className="z-[5] flex px-2 pb-2">
          <Hint label="Hide formatting">
            <Button
              variant={"ghost"}
              size={"iconSm"}
              disabled={false}
              onClick={() => {}}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <Hint label="Emoji">
            <Button
              variant={"ghost"}
              size={"iconSm"}
              disabled={false}
              onClick={() => {}}
            >
              <Smile className="size-4" />
            </Button>
          </Hint>
          {variant === "create" && (
            <Hint label="Image">
              <Button
                variant={"ghost"}
                size={"iconSm"}
                disabled={false}
                onClick={() => {}}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => {}}
                disabled={false}
              >
                Cancel
              </Button>
              <Button
                size={"sm"}
                onClick={() => {}}
                disabled={false}
                className="bg-[#007a5a] text-white hover:bg-[#007a5a]/80"
              >
                Save
              </Button>
            </div>
          )}
          {variant === "create" && (
            <Button
              size={"iconSm"}
              disabled={false}
              onClick={() => {}}
              className="ml-auto bg-[#007a5a] text-white hover:bg-[#007a5a]/80"
            >
              <MdSend className="size-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex justify-end p-2 text-[10px] text-muted-foreground">
        <p>
          <strong>Shift + Return</strong> to add a new line
        </p>
      </div>
    </div>
  );
};

export default Editor;
