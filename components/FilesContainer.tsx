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

interface FileContProps {
  userId: string | null | undefined;
  refreshTrigger?: number;
  onFolderChange?: (folderId: string | null) => void;
}

export const FilesContainer = ({ userId }: FileContProps) => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      let url = `/api/files?userId=${userId}`;
      if (currentFolder) {
        url += `&parentId=${currentFolder}`;
      }

      const response = await axios.get(url);
      console.log(response);

      setFiles(response.data);
    } catch (error) {
      console.error("Error while fetching files");
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
  }, [userId]);

  return (
    <div className="p-4 border  border-primary/40 rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="p-2 bg-primary border-none hover:bg-primary">
            <TableHead className="w-[200px] rounded-l-lg para-3 text-white px-3 text-center">
              Name
            </TableHead>
            <TableHead className="para-3 text-white text-center">
              Type
            </TableHead>
            <TableHead className="para-3 text-white text-center">
              Size
            </TableHead>
            <TableHead className="para-3 text-white text-center rounded-r-lg">
              Updated On
            </TableHead>
            {/* <TableHead className="rounded-r-lg para-3 text-white text-center">
              Actions
            </TableHead> */}
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
                    <Folder className="min-w-5 min-h-5 w-5 h-5" />
                  ) : (
                    <>
                      {file.type.startsWith("image") ? (
                        <Image className="min-w-5 min-h-5 w-5 h-5" />
                      ) : (
                        <FileIcon className="min-w-5 min-h-5 w-5 h-5" />
                      )}
                    </>
                  )}
                  <div>
                    <div className="font-medium flex items-center gap-2 para-3">
                      <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px]">
                        {file.name}
                      </span>
                      {/* {file.isFolder && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Folder className="h-3 w-3 text-default-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Folder</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )} */}
                      {file.type !== "folder" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={file.fileUrl} target="_blank">
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
                    <div className="text-xs text-default-500 sm:hidden">
                      {/* {formatDistanceToNow(new Date(file.createdAt), {
                        addSuffix: true,
                      })} */}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="font-medium text-center">
                {file.type}
              </TableCell>

              <TableCell>
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

              <TableCell>
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
              {/* <TableCell className="text-right">$250.00</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
