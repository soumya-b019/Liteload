import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
  ChevronRight,
  CloudUpload,
  FolderOpen,
  ShieldCheck,
} from "lucide-react";

const featureCardsData = [
  {
    id: 1,
    icon: <CloudUpload className="w-12 h-12 min-w-12 min-h-12" />,
    title: "Quick uploads",
    desc: "Drag, drop, done.",
    bg: "radial-gradient(57% 80% at 50% center, rgba(32, 35, 91, 0.7) 34%, rgba(7, 9, 33, 0.7) 90%)",
  },
  {
    id: 2,
    icon: <FolderOpen className="w-12 h-12 min-w-12 min-h-12" />,
    title: "Smart Organization",
    desc: "Keep it simple, find it fast.",
    bg: "radial-gradient(60.21% 70.4% at 50% 43.91%, rgba(43, 94, 180, 0.7) 0%, rgba(13, 16, 35, 0.42) 90%)",
  },
  {
    id: 3,
    icon: <ShieldCheck className="w-12 h-12 min-w-12 min-h-12" />,
    title: "Safe Data",
    desc: "Your files, your eyes.",
    bg: "radial-gradient(50% 60% at 50% 47.91%, #0D6E30 0%, #083518 100%)",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen px-6 sm:px-10 md:px-12 lg:px-16 pt-20 md:pt-36">
      <div className="container mx-auto flex flex-col gap-[32px] items-center">
        {/* hero section */}
        <section className="flex flex-col items-center gap-6">
          <h2 className="text-center text-white font-medium text-3xl md:text-4xl lg:text-5xl">
            Manage your files the best way with ease
          </h2>
          <h4 className="subheading-h4 text-[#B4BCD0]">
            A perfect place for you to store all your documents.
          </h4>

          <Image
            src="/hero_image.svg"
            alt="hero image"
            width={360}
            height={417}
            priority
          />

          {/* <Link href="/dashboard" className="mt-6">
          <Button
            type="button"
            className="text-white para-3 py-6 !px-8 !text-lg"
          >
            Go to Dashboard
            <ChevronRight width={16} height={16} className="min-w-4 min-h-4" />
          </Button>
        </Link> */}
        </section>

        {/* features */}
        <section className="flex flex-col items-center gap-8 mt-20 w-full">
          <h2 className="text-center text-white font-medium text-3xl md:text-4xl">
            Why Liteload?
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-center w-full md:min-w-1/3">
            {featureCardsData.map((card) => (
              <div
                className="flex flex-col items-center justify-center gap-4 rounded-xl p-4 w-full h-full min-h-52 flex-1 shadow-[0px_0px_40px_20px_rgba(7, 13, 79, 0.05)] border"
                key={card.id}
                style={{
                  background: card.bg,
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <span className="">{card.icon}</span>
                <span>
                  <h3 className="subheading-h4 text-white text-center">
                    {card.title}
                  </h3>
                  <p className="para-3 text-gray-300 text-center">
                    {card.desc}
                  </p>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* cta */}
        <section className="flex flex-col items-center gap-4 my-10">
          <h2 className="text-center text-white font-medium text-2xl md:text-3xl">
            Ready to get started?
          </h2>

          <SignedIn>
            <Link href="/dashboard" className="">
              <Button
                type="button"
                className="text-white para-3 py-6 !px-6 !text-[1rem]"
              >
                Go to Dashboard
                <ChevronRight
                  width={16}
                  height={16}
                  className="min-w-4 min-h-4"
                />
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <Link href="/sign-in" className="">
              <Button
                type="button"
                className="text-white para-3 py-6 !px-6 !text-[1rem]"
              >
                Get started
                <ChevronRight
                  width={16}
                  height={16}
                  className="min-w-4 min-h-4"
                />
              </Button>
            </Link>
          </SignedOut>
        </section>
      </div>
    </main>
  );
}
