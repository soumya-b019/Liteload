"use client";
import {
  AlertTriangle,
  ArrowRight,
  FilePlus,
  FileUp,
  FolderPlus,
  Upload,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

type FileUploadSectionProps = {
  userId: string | null | undefined;
  currentFolder: string | null;
};

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  userId,
  currentFolder,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragging, setDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      const file = e.target.files[0];
      setFile(file);

      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }

      setFile(file);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];

      // Validate file size (5MB limit)
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }

      setFile(droppedFile);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dragging) setDragging(true); // Prevents re-renders if already true
  };

  const handleDragLeave = () => setDragging(false);

  const clearFile = () => {
    setFile(null);
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    if (userId) {
      formData.append("userId", userId);
    }
    if (currentFolder) {
      formData.append("parentId", currentFolder);
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      await axios.post("/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress(progressEvent) {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      toast.success("Upload successfull", {
        description: `${file.name} has been uploaded successfully.`,
        position: "top-right",
        richColors: true,
      });

      // clear the file after successful upload
      clearFile();
    } catch (error) {
      console.error("Error uploading file: ", error);
      setError("Failed to upload file. Please try again.");
      toast.error("Upload Failed", {
        description: "We couldn't upload your file. Please try again.",
        position: "top-right",
        richColors: true,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center w-full">
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
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`w-full border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          dragging
            ? "bg-secondary-foreground/80 border-primary"
            : error
            ? "border-danger/30 bg-danger/5"
            : file
            ? "bg-primary/30 border-primary"
            : "bg-transparent border-sidebar-border"
        }`}
      >
        {!file ? (
          <div className="space-y-3 p-3 w-full">
            <Upload className="w-12 h-12 mx-auto text-primary/70" />
            <div>
              <p className="para-3 text-white text-center">
                Drag and drop your files here, or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline p-0 m-0 font-medium bg-transparent border-0 cursor-pointer text-primary hover:underline"
                >
                  browse
                </button>
              </p>
              <p className="mt-1 text-center text-xs text-default-500">
                (Files up to 5MB)
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*, .pdf, .doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-md bg-background/50">
                  <FileUp className="w-5 h-5 text-ring" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium truncate max-w-[120px]">
                    {file.name}
                  </p>
                  <p className="text-xs">
                    {file.size < 1024
                      ? `${file.size} B`
                      : file.size < 1024 * 1024
                      ? `${(file.size / 1024).toFixed(1)} KB`
                      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="!px-2 py-1"
                onClick={clearFile}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-danger-5 text-danger-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <Button
              onClick={handleFileUpload}
              className="w-full mt-2"
              disabled={!!error || uploading}
            >
              {uploading ? (
                `Uploading... ${progress}%`
              ) : (
                <>
                  Upload file <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Upload tips */}
      <div className="px-4 rounded-lg bg-default-100/5">
        <h4 className="mb-2 text-md font-medium">Tips</h4>
        <ul className="space-y-1 text-xs text-default-600 list-outside list-disc">
          <li>Files are private and only visible to you</li>
          <li>Supported formats: JPG, PNG, GIF, WebP, DOC, PDF</li>
          <li>Maximum file size: 5MB</li>
        </ul>
      </div>
    </div>
  );
};
