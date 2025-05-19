import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
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
    bg: "linear-gradient(148.85deg, rgba(32, 35, 91, 0.7) 22%, rgba(7, 9, 33, 0.7) 82%)",
  },
  {
    id: 2,
    icon: <FolderOpen className="w-12 h-12 min-w-12 min-h-12" />,
    title: "Smart Organization",
    desc: "Keep it simple, find it fast.",
    bg: "radial-gradient(94.21% 78.4% at 50% 29.91%, rgba(43, 94, 180, 0.7) 0%, rgba(13, 16, 35, 0.42) 100%)",
  },
  {
    id: 3,
    icon: <ShieldCheck className="w-12 h-12 min-w-12 min-h-12" />,
    title: "Safe Data",
    desc: "Your files, your eyes.",
    bg: "radial-gradient(30% 40% at 52% 36.91%, #0D6E30 0%, #083518 100%)",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col gap-[32px] items-center px-6 sm:px-10 md:px-12 lg:px-16 pt-20 md:pt-36">
      {/* hero section */}
      <section className="flex flex-col items-center gap-6">
        <h2 className="text-center font-medium text-3xl md:text-4xl lg:text-5xl">
          Manage your files the best way with ease
        </h2>
        <h4 className="subheading-h4 text-[#B4BCD0]">
          A perfect place for you to store all your documents.
        </h4>

        <Image
          src="/hero_image.svg"
          alt="hero image"
          width={380}
          height={437}
          priority
        />

        <Link href="/dashboard" className="mt-8">
          <Button type="button" className="para-3">
            Go to Dashboard
            <ChevronRight width={16} height={16} className="min-w-4 min-h-4" />
          </Button>
        </Link>
      </section>

      {/* features */}
      <section className="flex flex-col items-center gap-8 mt- w-full">
        <h2 className="text-center font-medium text-3xl md:text-4xl">
          Why Liteload?
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-center w-full max-w-64 md:max-w-max">
          {featureCardsData.map((card) => (
            <div
              className="flex flex-col items-center justify-between gap-4 rounded-lg p-4 w-full h-full min-h-48 flex-1"
              key={card.id}
              style={{ background: card.bg }}
            >
              <span className="">{card.icon}</span>
              <span>
                <h3 className="subheading-h4 text-white">{card.title}</h3>
                <p className="para-3 text-gray-300">{card.desc}</p>
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
