/** eslint-disable @next/next/no-img-element */

import Image from "next/image";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useState } from "react";

interface ThumbnailProps {
  url?: string | null;
}

export const Thumbnail = ({ url }: ThumbnailProps) => {
  const [open, setOpen] = useState(false);

  if (!url) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative my-2 max-w-[360px] cursor-zoom-in overflow-hidden rounded-lg border">
          <img
            src={url}
            alt={"Message image"}
            className="size-full rounded-md object-cover"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] gap-0 overflow-hidden border-none bg-transparent p-0 shadow-none">
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>Image</DialogTitle>
            <DialogDescription>Image preview</DialogDescription>
          </DialogHeader>
        </VisuallyHidden.Root>
        <img
          src={url}
          alt={"Message image"}
          className="size-full max-h-[600px] max-w-[800px] cursor-zoom-out rounded-md object-cover"
          onClick={() => setOpen(false)}
        />
        <Link
          href={url}
          target="_blank"
          className="ml-2 mt-1 text-gray-400 hover:text-white hover:underline"
        >
          Open in Browser
        </Link>
      </DialogContent>
    </Dialog>
  );
};
