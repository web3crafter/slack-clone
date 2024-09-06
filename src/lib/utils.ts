import { type ClassValue, clsx } from "clsx";
import { format, isToday, isYesterday } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const replaceWhiteSpace = (string: string) => {
  return string.replace(/\s+/g, "-").toLowerCase();
};

export const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};
