"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { FileUploadSection } from "@/components/FileUploadSection";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FilesContainer } from "@/components/FilesContainer";

const DashboardPage = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
    }
  }, [userId]);

  return (
    <main className="py-8 px-6 sm:px-10 md:px-12 lg:px-16 w-full h-full">
      <div className="container mx-auto grid grid-cols-4 gap-6">
        <section
          className="col-span-1 rounded-lg w-full h-full bg-green-200"
          style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
        >
          <Card className="py-6">
            <CardHeader className="px-4">
              <CardTitle className="flex items-center justify-start gap-2 text-center text-white">
                <FileUp className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-semibold">Upload</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <FileUploadSection
                userId={userId}
                currentFolder={currentFolder}
              />
            </CardContent>
            <CardFooter className="flex justify-center items-center"></CardFooter>
          </Card>
        </section>

        <section
          className="col-span-3 grid grid-rows-6 gap-6"
          style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
        >
          <div
            className="row-span-2 rounded-lg bg-amber-200"
            style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
          >
            sds
          </div>

          <div
            className="row-span-6 rounded-lg bg-transparent"
            style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
          >
            <FilesContainer userId={userId} />
          </div>
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;
