import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { File as FileType } from "@/lib/db/schema";
import axios from "axios";
import { toast } from "sonner";
import { ExternalLink, FileIcon, Folder, Image, Minus } from "lucide-react";
import Link from "next/link";
import { FullLoader } from "./FullLoader";
import { FolderBreadCrumbs } from "./FolderBreadCrumbs";
import { FileEmptyState } from "./FileEmptyState";

interface FileContProps {
  userId: string | null | undefined;
  refreshTrigger?: number;
  onFolderChange?: (folderId: string | null) => void;
}

export const FilesContainer = ({
  userId,
  refreshTrigger = 0,
  onFolderChange,
}: FileContProps) => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      let url = `/api/files?userId=${userId}`;
      if (currentFolder) {
        url += `&parentId=${currentFolder}`;
      }

      const response = await axios.get(url);

      setFiles(response.data);
    } catch (error) {
      console.error(
        "Error while fetching files: ",
        +(error instanceof Error ? error.message : String(error))
      );
      toast.error("Error loading files", {
        description: "We couldn't load your files. Please try again later",
        richColors: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchFiles();
  }, [userId, refreshTrigger, currentFolder]);

  // Navigate to a folder
  const navigateToFolder = (folderId: string, folderName: string) => {
    setCurrentFolder(folderId);
    setFolderPath([...folderPath, { id: folderId, name: folderName }]);

    // Notify parent component about folder change
    if (onFolderChange) {
      onFolderChange(folderId);
    }
  };

  // Navigate to specific folder in path
  const navigateToPathFolder = (index: number) => {
    if (index < 0) {
      setCurrentFolder(null);
      setFolderPath([]);

      // Notify parent component about folder change
      if (onFolderChange) {
        onFolderChange(null);
      }
    } else {
      const newPath = folderPath.slice(0, index + 1);
      setFolderPath(newPath);
      const newFolderId = newPath[newPath.length - 1].id;
      setCurrentFolder(newFolderId);

      // Notify parent component about folder change
      if (onFolderChange) {
        onFolderChange(newFolderId);
      }
    }
  };

  const handleItemClick = (file: FileType) => {
    if (file.isFolder) {
      navigateToFolder(file.id, file.name);
    }
  };

  return (
    <div className="p-4 border border-primary/40 rounded-lg w-full">
      {loading ? (
        <FullLoader />
      ) : (
        <div className="relative flex flex-col gap-6 w-full h-full">
          <FolderBreadCrumbs
            folderPath={folderPath}
            navigateToPathFolder={navigateToPathFolder}
          />

          {/* <div className="w-full max-w-full"> */}
          <div className="overflow-hidden">
            {/* <FileCardsContainer files={[files]} /> */}

            <>
              {files.length ? (
                <div className="relative w-full overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="p-2 bg-primary border-none hover:bg-primary">
                        <TableHead className="w-[200px] rounded-l-lg para-3 text-white px-3 text-center">
                          Name
                        </TableHead>
                        <TableHead className="para-3 text-white text-center rounded-r-lg min-[480px]:rounded-none">
                          Type
                        </TableHead>
                        <TableHead className="hidden min-[480px]:table-cell min-[480px]:rounded-r-lg sm:rounded-none para-3 text-white text-center">
                          Size
                        </TableHead>
                        <TableHead className="hidden sm:table-cell para-3 text-white text-center rounded-r-lg">
                          Updated On
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {files.map((file) => (
                        <TableRow
                          key={file.id}
                          className="h-20 text-foreground border-primary/40"
                        >
                          <TableCell>
                            <div
                              className={`flex items-center gap-3 ${
                                file.type === "folder" && "cursor-pointer"
                              }`}
                            >
                              {file.type === "folder" ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Folder
                                        className="min-w-5 min-h-5 w-5 h-5"
                                        onClick={() => handleItemClick(file)}
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Click to open folder</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <>
                                  {file.type.startsWith("image") ? (
                                    <Image className="min-w-5 min-h-5 w-5 h-5" />
                                  ) : (
                                    <FileIcon className="min-w-5 min-h-5 w-5 h-5" />
                                  )}
                                </>
                              )}
                              <div className="font-medium flex items-center gap-2 para-3">
                                {file.type === "folder" ? (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span
                                          className="truncate max-w-[120px] sm:max-w-[180px] md:max-w-[220px]"
                                          onClick={() => handleItemClick(file)}
                                        >
                                          {file.name}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Click to open folder</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ) : (
                                  <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px]">
                                    {file.name}
                                  </span>
                                )}

                                {file.type !== "folder" && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Link
                                          href={file.fileUrl}
                                          target="_blank"
                                        >
                                          <ExternalLink className="h-3 w-3 text-default-400" />
                                        </Link>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Click to view file</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="font-medium text-center">
                            {file.type.startsWith("folder")
                              ? file.type
                              : file.type.split("/")[1]}
                          </TableCell>

                          <TableCell className="hidden min-[480px]:table-cell">
                            <span className="flex items-center justify-center">
                              {file.size === 0 ? (
                                <Minus />
                              ) : file.size < 1024 ? (
                                `${file.size} B`
                              ) : file.size < 1024 * 1024 ? (
                                `${(file.size / 1024).toFixed(1)} KB`
                              ) : (
                                `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                              )}
                            </span>
                          </TableCell>

                          <TableCell className="hidden sm:table-cell">
                            <span className="flex flex-col items-center justify-center">
                              <span>
                                {file.updatedAt
                                  ? new Intl.DateTimeFormat("en-US", {
                                      timeStyle: "short",
                                    }).format(new Date(file.updatedAt))
                                  : "-"}
                              </span>
                              <span>
                                {file.updatedAt
                                  ? new Intl.DateTimeFormat("en-US", {
                                      dateStyle: "medium",
                                    }).format(new Date(file.updatedAt))
                                  : "-"}
                              </span>
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <FileEmptyState />
              )}
            </>
          </div>
        </div>
      )}
    </div>
  );
};
