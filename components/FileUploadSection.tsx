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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";

type FileUploadSectionProps = {
  userId: string | null | undefined;
  currentFolder: string | null;
  onUploadSuccess: () => void;
};

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  userId,
  currentFolder,
  onUploadSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // folder creation state
  const [folderName, setFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [open, setOpen] = useState(false);

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
      onUploadSuccess();
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

  const handleCreateFolder = async () => {
    setCreatingFolder(true);

    try {
      await axios.post("/api/folders/create", {
        userId,
        name: folderName.trim(),
        parentId: currentFolder,
      });

      toast.success("Folder created", {
        description: `${folderName} has been created successfully.`,
        position: "top-right",
        richColors: true,
      });

      // Reset folder name and close modal
      setFolderName("");
      setOpen(false);

      // Call the onUploadSuccess callback to refresh the file list
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Error creating folder: ", error);
      setError("Failed folder creation");
      toast.error("Failed folder creation", {
        description: "We couldn't create your folder. Please try again.",
        position: "top-right",
        richColors: true,
      });
    } finally {
      setCreatingFolder(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center w-full">
      {/* add buttons */}
      <div className="flex flex-col gap-2 items-center w-full">
        <Button
          type="button"
          className="text-white para-2 w-full py-3"
          onClick={() => setOpen(true)}
        >
          New Folder
          <FolderPlus width={20} height={20} className="min-w-5 min-h-5" />
        </Button>
        <Button
          type="button"
          className="text-white para-2 w-full py-3"
          onClick={() => fileInputRef.current?.click()}
        >
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

      {/* create folder modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger> */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Folder</DialogTitle>
            <DialogDescription>Enter a name for your folder.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Folder Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!folderName.trim()}
              onClick={handleCreateFolder}
            >
              {creatingFolder ? (
                <span className="flex justify-center items-center gap-2">
                  <svg
                    aria-hidden="true"
                    className="inline w-4 h-4 text-gray-600 animate-spin fill-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <p>Creating...</p>
                </span>
              ) : (
                "Create Folder"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
