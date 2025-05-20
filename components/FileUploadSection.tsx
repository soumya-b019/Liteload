"use client";
import { FilePlus, FolderPlus, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useRef } from "react";

export const FileUploadSection = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-6 items-center  w-full">
      {/* add buttons */}
      <div className="flex flex-col gap-2 items-center w-full">
        <Button type="button" className="text-white para-2 w-full py-3">
          New Folder
          <FolderPlus width={20} height={20} className="min-w-5 min-h-5" />
        </Button>
        <Button type="button" className="text-white para-2 w-full py-3">
          New File
          <FilePlus width={20} height={20} className="min-w-5 min-h-5" />
        </Button>
      </div>

      {/* drag & drop section */}
      <div className="">
        <div className="space-y-3">
          <Upload className="w-12 h-12 mx-auto text-primary/70" />
          <div>
            <p className="text-default-600">
              Drag and drop your image here, or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline p-0 m-0 font-medium bg-transparent border-0 cursor-pointer text-primary"
              >
                browse
              </button>
            </p>
            <p className="mt-1 text-xs text-default-500">Files up to 5MB</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            //   onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>
      </div>
    </div>
  );
};
