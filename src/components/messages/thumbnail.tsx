/** eslint-disable @next/next/no-img-element */

import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

interface ThumbnailProps {
  url?: string | null;
}

//TODO: fix height on high image

export const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return null;
  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative my-2 max-w-[360px] cursor-zoom-in overflow-hidden rounded-lg border">
          <img
            src={url}
            alt="Message image"
            className="size-full rounded-md object-cover"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="h-[800px] w-[800px] overflow-hidden border-none bg-transparent p-2 shadow-none">
        <DialogTitle className="sr-only">Image preview</DialogTitle>
        <DialogDescription className="sr-only">Image preview</DialogDescription>
        <div className="">
          <Image
            src={url}
            alt="Message image"
            fill
            className="rounded-md object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
