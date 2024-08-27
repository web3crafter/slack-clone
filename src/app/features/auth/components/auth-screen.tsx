"use client";

import { useState } from "react";

import { SignInFlow } from "@/app/features/auth/types";

import { SignInCard } from "@/app/features/auth/components/sign-in-card";
import { SignUpCard } from "@/app/features/auth/components/sign-up-card";

export const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");
  return (
    <div className="flex h-full items-center justify-center bg-[#5C3B58]">
      <div className="md:h-auto md:w-[420px]">
        {state === "signIn" ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
};
