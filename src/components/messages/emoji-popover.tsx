import { useState } from "react";
import Picker from "@emoji-mart/react";
import data, { Emoji } from "@emoji-mart/data";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface SelectedEmoji
  extends Pick<Emoji, "id" | "name" | "emoticons" | "keywords"> {
  native: string;
  unified: string;
  shortcodes: string;
}

interface EmojiPopoverProps {
  children: React.ReactNode;
  hint?: string;
  onEmojiSelect: (emoji: SelectedEmoji) => void;
}

export const EmojiPopover = ({
  children,
  onEmojiSelect,
  hint = "Emoji",
}: EmojiPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const onSelect = (emoji: SelectedEmoji) => {
    onEmojiSelect(emoji);
    setPopoverOpen(false);

    setTimeout(() => {
      setTooltipOpen(false);
    }, 500);
  };

  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip
          open={tooltipOpen}
          onOpenChange={setTooltipOpen}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="border-white/5 bg-black text-white">
            <p className="text-xs font-medium">{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="shadow.none w-full border-none p-0">
          <Picker data={data} onEmojiSelect={onSelect} />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};
