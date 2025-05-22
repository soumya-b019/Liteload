import { Button } from "./ui/button";

interface FolderBreadCrumbsProps {
  folderPath: Array<{ id: string; name: string }>;
  navigateToPathFolder: (index: number) => void;
}

export const FolderBreadCrumbs = ({
  folderPath,
  navigateToPathFolder,
}: FolderBreadCrumbsProps) => {
  return (
    <div className="flex items-center justify-start p-2 border-b border-primary/60">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigateToPathFolder(-1)}
        className={folderPath.length === 0 ? "font-bold" : ""}
      >
        Home
      </Button>

      {folderPath.map((folder, index) => (
        <div key={folder.id} className="flex items-center">
          <span className="mx-1 text-default-400">/</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateToPathFolder(index)}
            className={`${
              index === folderPath.length - 1 ? "font-bold" : ""
            } text-ellipsis overflow-hidden max-w-[150px]`}
            title={folder.name}
          >
            {folder.name}
          </Button>
        </div>
      ))}
    </div>
  );
};
