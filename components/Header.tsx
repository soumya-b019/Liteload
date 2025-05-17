"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export const Header = () => {
  const router = useRouter();

  return (
    <div
      className="px-6 py-2 bg-transparent shadow-md w-full border-b backdrop-blur-md"
      style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
    >
      <div className="flex justify-between gap-2 items-center w-full max-w-[1280px] mx-auto ">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold">Logo</h1>
          <p className="text-sm text-gray-500">Liteload</p>
        </div>
        <div className="flex gap-8 items-center">
          <Button
            type="button"
            variant="outline"
            className="para-3 cursor-pointer"
            onClick={() => router.push("/sign-in")}
          >
            Sign In
          </Button>
          <Button
            type="button"
            variant="default"
            className="para-3 cursor-pointer"
            onClick={() => router.push("/sign-up")}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};
