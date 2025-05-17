import { Button } from "./ui/button";

export const Header = () => {
  return (
    <div
      className="px-6 py-2 bg-transparent shadow-md w-full border-b backdrop-blur-md"
      style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
    >
      <div className="flex justify-between gap-2 items-center w-full max-w-[1280px] mx-auto ">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold">My App</h1>
          <p className="text-sm text-gray-500">Welcome to my app!</p>
        </div>
        <div className="flex gap-8 items-center">
          <Button
            type="button"
            className="border border-[#5E6AD2] cursor-pointer"
          >
            Log In
          </Button>
          <Button type="button" className="bg-[#5E6AD2] cursor-pointer">
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};
