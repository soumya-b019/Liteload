import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Liteload",
  description: "Your own secure cloud storage platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="relative">
          <div className="fixed top-0 inset-x-0 mx-auto w-full h-full radial-gradient-1 -z-10"></div>
          <Providers>
            <Header />
            {children}
            <Toaster />
            <Footer />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
