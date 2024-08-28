import { Dispatch, SetStateAction, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { TriangleAlert } from "lucide-react";

import { SignInFlow } from "@/app/features/auth/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputPassword } from "@/components/input-password";

interface SignInCardProps {
  setState: Dispatch<SetStateAction<SignInFlow>>;
}
export const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    signIn("password", { email, password, flow: "signIn" })
      .catch(() => {
        setError("Invalid email or password");
      })
      .finally(() => setIsPending(false));
  };

  const handleProviderSignIn = (value: "google" | "github") => {
    setIsPending(true);
    signIn(value).finally(() => setIsPending(false));
  };

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="mb-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onPasswordSignIn} className="space-y-2.5">
          <Input
            disabled={isPending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <InputPassword
            disabled={isPending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <Button
            type="submit"
            className="w-full"
            size={"lg"}
            disabled={isPending}
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            variant={"outline"}
            className="relative w-full"
            disabled={isPending}
            size={"lg"}
            onClick={() => handleProviderSignIn("google")}
          >
            <FcGoogle className="absolute left-3 top-3 size-5" />
            Continue with Google
          </Button>
          <Button
            variant={"outline"}
            className="relative w-full"
            disabled={isPending}
            size={"lg"}
            onClick={() => handleProviderSignIn("github")}
          >
            <FaGithub className="absolute left-3 top-3 size-5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <span
            className="cursor-pointer text-sky-700 hover:underline"
            onClick={() => setState("signUp")}
          >
            Sign Up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
