export const Footer = () => {
  return (
    <footer
      className="bg-default-50 border-t py-4 px-6 sm:px-10 md:px-12 lg:px-16 bg-transparent shadow-md w-full"
      style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
    >
      <div className="w-full container mx-auto md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <h2 className="text-lg font-bold">Liteload</h2>
          </div>
          <p className="text-default-500 text-sm">
            &copy; {new Date().getFullYear()} Liteload. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};
