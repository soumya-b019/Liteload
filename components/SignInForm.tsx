"use client";

import { signInSchema } from "@/schemas/signInSchema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleAlert } from "lucide-react";
import { CircleCheck } from "lucide-react";
import Link from "next/link";

export default function SignInForm() {
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error("Sign-in incomplete", result);
        setAuthError("Sign-in could not be completed. Please try again.");
      }
    } catch (error: any) {
      console.error("Sign-in error", error);
      setAuthError(
        error.errors?.[0]?.message || "An error occured during sign in process"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-center text-white">Welcome Back</CardTitle>
        <CardDescription className="text-center text-[var(--muted-foreground)] mt-0.5">
          Sign in to access your secure cloud storage.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {authError && (
          <div className="bg-red-200 text-red-700 p-2 rounded-lg mb-6 flex items-center gap-2">
            <CircleAlert width={24} height={24} className="min-w-6 min-h-6" />
            <p>{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-6">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                {...register("email")}
              />

              {errors?.email && (
                <p className="text-sm text-red-700 mt-2">
                  {errors?.email?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                {...register("password")}
              />
              {errors?.password && (
                <p className="text-sm text-red-700 mt-2">
                  {errors?.password?.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center items-center">
        <p className="text-sm">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="hover:underline font-medium text-[var(--primary)]"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
