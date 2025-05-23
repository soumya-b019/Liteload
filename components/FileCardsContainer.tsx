import type { File as FileType } from "@/lib/db/schema";

interface FileCardsContainerProps {
  files: Array<FileType[]>;
}

export const FileCardsContainer = ({ files }: FileCardsContainerProps) => {
  console.log(files);

  return (
    <div className="relative w-full overflow-auto p-4 border border-primary/40 rounded-lg ">
      {/* <div className="w-[700px] overflow-x-auto"> */}
      <div className="flex flex-col gap-6 h-full">
        <div className="grid grid-cols-4 gap-2 p-2 bg-primary border-none hover:bg-primary rounded-lg">
          <span className="w-full max-w-[200px] md:max-w-[250px] para-3 text-white text-center">
            Name
          </span>
          <span className="para-3 text-white text-center">Type</span>
          <span className="para-3 text-white text-center">Size</span>
          <span className="para-3 text-white text-center">Updated On</span>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};
