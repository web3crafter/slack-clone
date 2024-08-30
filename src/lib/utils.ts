import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const replaceWhiteSpace = (string: string) => {
  return string.replace(/\s+/g, "-").toLowerCase();
};
