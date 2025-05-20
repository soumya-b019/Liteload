import React from "react";
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

const DashboardPage = () => {
  return (
    <main className="py-8 px-6 sm:px-10 md:px-12 lg:px-16 w-full h-full">
      <div className="container mx-auto grid grid-cols-4 gap-6">
        <section
          className="col-span-1 rounded-lg w-full h-full bg-green-200"
          style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
        >
          <Card className="">
            <CardHeader>
              <CardTitle className="flex items-center justify-start gap-2 text-center text-white">
                <FileUp className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-semibold">Upload</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploadSection />
            </CardContent>
            <CardFooter className="flex justify-center items-center">
              <p className="text-sm">
                Didn't receive a code?{" "}
                <Button
                  variant="link"
                  className="hover:underline font-medium p-0"
                >
                  Resend code
                </Button>
              </p>
            </CardFooter>
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
            className="row-span-6 rounded-lg bg-amber-600"
            style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
          >
            sdsd
          </div>
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;
