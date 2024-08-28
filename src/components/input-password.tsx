"use client";

import { forwardRef, useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputPassword = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div
        className={cn(
          "flex h-9 w-full justify-evenly overflow-hidden rounded-md border border-input shadow-sm disabled:cursor-not-allowed disabled:opacity-50 has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-ring",
          className,
        )}
      >
        <Input
          className={cn("", className)}
          ref={ref}
          type={showPassword ? "text" : "password"}
          {...props}
        />
        {showPassword ? (
          <div className="flex h-full basis-1/6 select-none items-center justify-center bg-muted px-1 md:basis-1/12">
            <LuEye
              onClick={() => setShowPassword(false)}
              className="select-none hover:cursor-pointer"
            />
          </div>
        ) : (
          <div className="flex h-full basis-1/6 select-none items-center justify-center bg-muted px-1 md:basis-1/12">
            <LuEyeOff
              onClick={() => setShowPassword(true)}
              className="select-none hover:cursor-pointer"
            />
          </div>
        )}
      </div>
    );
  },
);

InputPassword.displayName = "InputPassword";

export { InputPassword };
