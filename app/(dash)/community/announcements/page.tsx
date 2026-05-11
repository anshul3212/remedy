import { Pen, Plus } from "lucide-react";

const page = () => {
  return (
    <div className=" font-inter font-bold   flex overflow-y-auto h-[calc(100vh-100px)]">
      <div className="w-[50%] border-r border-[#cac7c7] max-h-[98%] overflow-y-auto scrollbar-hide ">
        <div className="flex items-center justify-between sticky pb-2 top-0 bg-[#f7f7fe]  z-10 p-4">
          <h1 className="font-inter font-medium text-[20px] text-[#000000">
            Announcements
          </h1>

          <button className="cursor-pointer bg-[#8B5CF6] px-4 py-2 rounded-md flex items-center justify-center gap-1">
            <Plus size={12} color="#ffffff" />
            <span className="text-[#ffffff] font-inter font-semibold text-[11px]">
              Add Category
            </span>
          </button>
        </div>
        <div className="h-300 w-full p-4">
          <div>
            <div className="w-full">

            </div>
          </div>
        </div>
      </div>
      

      <div className="w-[50%] border-r border-[#cac7c7] max-h-[98%] overflow-y-auto scrollbar-hide ">
        <div className="flex items-center justify-between sticky pb-2 top-0 bg-[#f7f7fe]  z-10 p-4">
          <h1 className="font-inter font-medium text-[20px] text-[#000000">
            Community Guidelines
          </h1>

          <button className="cursor-pointer bg-green-500 px-4 py-2 rounded-md flex items-center justify-center gap-1">
            <Pen size={12} color="#ffffff" />
            <span className="text-[#ffffff] font-inter font-semibold text-[11px]">
              Edit Guidelines
            </span>
          </button>
        </div>
        <div className="h-300 w-full p-4"></div>
      </div>
    </div>
  );
};

export default page;
