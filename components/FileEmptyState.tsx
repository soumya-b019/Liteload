import { Search } from "lucide-react";

export const FileEmptyState = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
      <Search className="w-10 h-10 min-w-10 min-h-10" />
      <span className="flex flex-col gap-1 items-center justify-center">
        <h4 className="subheading-h4 text-white">No Data Found</h4>
        <p className="para-3 text-muted-foreground">
          Create new files/folders in order to get started
        </p>
      </span>
    </div>
  );
};
