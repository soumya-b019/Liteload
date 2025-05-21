"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { UserButton, useUser } from "@clerk/nextjs";

export const Header = () => {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  const isDashboard = pathname.split("/").includes("dashboard");

  return (
    <div
      className="sticky top-0 inset-x-0 z- py-4 px-6 sm:px-10 md:px-12 lg:px-16 bg-transparent shadow-md w-full border-b backdrop-blur-md"
      style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
    >
      <div className="flex justify-between gap-2 items-center w-full container mx-auto">
        <div className="flex gap-2 items-center">
          {/* <h1 className="text-2xl font-bold">Logo</h1> */}
          <h2
            className="text-lg font-bold cursor-pointer"
            onClick={() => router.push("/")}
          >
            Liteload
          </h2>
        </div>
        <div className="flex gap-8 items-center">
          {isSignedIn ? (
            <>
              {!isDashboard ? (
                <Button
                  type="button"
                  className="para-3"
                  onClick={() => router.push("/dashboard")}
                >
                  Dashboard
                </Button>
              ) : (
                ""
              )}

              <UserButton />
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                className="para-3"
                onClick={() => router.push("/sign-in")}
              >
                Sign In
              </Button>
              <Button
                type="button"
                variant="default"
                className="para-3"
                onClick={() => router.push("/sign-up")}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
