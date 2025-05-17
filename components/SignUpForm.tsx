"use client";

import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";

// zod custom schema
import { signUpSchema } from "@/schemas/signUpSchema";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

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

export default function SignUpForm() {
  const [verifying, setVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const { signUp, isLoaded, setActive } = useSignUp();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (!isLoaded) return;

    setIsSubmitting(true);
    setAuthError(null);

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerifying(true);
    } catch (error: any) {
      console.error("Signup error: ", error);
      setAuthError(
        error.errors?.[0]?.message ||
          "An error occured during signup. Please try again"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!isLoaded || !signUp) return;
    setIsSubmitting(true);
    setAuthError(null);
    setVerificationError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error("Verification incomplete: ", result);
        setVerificationError("Verification could not be complete");
      }
    } catch (error: any) {
      console.error("Verification incomplete: ", error);
      setVerificationError(
        error.errors?.[0]?.message ||
          "An error occured during signup. Please try again"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verifying) {
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center text-white">
            Verify your email
          </CardTitle>
          <CardDescription className="text-center text-[var(--muted-foreground)] mt-0.5">
            We've sent a verification code on your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verificationError && (
            <div className="bg-red-200 text-red-700 p-2 rounded-lg mb-6 flex items-center gap-2">
              <CircleAlert width={24} height={24} className="min-w-6 min-h-6" />
              <p>{verificationError}</p>
            </div>
          )}

          <form onSubmit={handleVerificationSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  placeholder="Enter the 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  autoFocus
                />
              </div>

              <Button type="submit" variant="default" disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify Email"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <p className="text-sm">
            Didn't receive a code?{" "}
            <Button
              variant="link"
              className="hover:underline font-medium p-0"
              onClick={async () => {
                if (signUp) {
                  await signUp.prepareEmailAddressVerification({
                    strategy: "email_code",
                  });
                }
              }}
            >
              Resend code
            </Button>
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-center text-white">
          Create your account
        </CardTitle>
        <CardDescription className="text-center text-[var(--muted-foreground)] mt-0.5">
          Signup to start managing your files securely.
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
                <p className="text-[12px] text-red-700 mt-2">
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

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="passwordConfirmation">Confirm Password</Label>
              <Input
                id="passwordConfirmation"
                type="password"
                placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                {...register("passwordConfirmation")}
              />
              {errors?.passwordConfirmation && (
                <p className="text-sm text-red-700 mt-2">
                  {errors?.passwordConfirmation?.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <CircleCheck className="w-8 h-8 text-[var(--primary)]" />
                <p className="text-sm">
                  By signing up, you agree to our Terms of Services and Privacy
                  Policy
                </p>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center items-center">
        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="hover:underline font-medium text-[var(--primary)]"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
