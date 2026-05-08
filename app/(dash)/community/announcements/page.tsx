import { Pen, Plus } from "lucide-react";

const page = () => {
  return (
    // <div className=" font-inter font-bold py-2  flex overflow-y-auto h-[calc(100vh-100px)]">
    //   <div className="w-[50%] border-r border-[#cac7c7] py-8 px-14 max-h-[98%] overflow-y-auto scrollbar-hide ">
    //     <div className="flex items-center justify-between sticky pb-2 top-0 bg-white z-10">
    //         <h1 className="font-inter font-medium text-[20px] text-[#000000">
    //       Announcements
    //     </h1>
       
    //         <button
    //         className="cursor-pointer bg-[#8B5CF6] px-4 py-2 rounded-md flex items-center justify-center gap-1"
    //       >
    //         <Plus size={12} color="#ffffff" />
    //         <span className="text-[#ffffff] font-inter font-semibold text-[11px]">
    //           Add Category
    //         </span>
    //       </button>
    //     </div>
    //     <div className="h-300 w-full bg-red-500">

    //     </div>

    //   </div>
    //   <div className="w-[50%] py-8 px-14">
        

    //     <div className="flex items-center justify-between">
    //         <h1 className="font-inter font-medium text-[20px] text-[#000000]">
    //       Community Guidelines
    //     </h1>
       
    //         <button
    //         className="cursor-pointer bg-green-500 px-4 py-2 rounded-md flex items-center justify-center gap-1"
    //       >
    //         <Pen size={12} color="#ffffff" />
    //         <span className="text-[#ffffff] font-inter font-semibold text-[11px]">
    //           Edit Guidelines
    //         </span>
    //       </button>
    //     </div>
    //   </div>
    // </div>

    <div className="font-inter font-bold py-2 flex h-[calc(100vh-100px)]">

  {/* LEFT SIDE */}
  <div className="w-[50%] border-r border-[#cac7c7] py-8 px-14 h-full overflow-y-auto scrollbar-hide">
    
    <div className="flex items-center justify-between sticky top-0 bg-white z-20 py-3">
  <h1 className="font-inter font-medium text-[20px] text-[#000000]">
    Announcements
  </h1>

  <button className="cursor-pointer bg-[#8B5CF6] px-4 py-2 rounded-md flex items-center justify-center gap-1">
    <Plus size={12} color="#ffffff" />
    <span className="text-[#ffffff] font-inter font-semibold text-[11px]">
      New Announcements
    </span>
  </button>
</div>

    <div className="h-250 w-full bg-red-500"></div>
  </div>

  {/* RIGHT SIDE */}
  <div className="w-[50%] py-8 px-14 h-full overflow-y-auto">
    
    <div className="flex items-center justify-between sticky top-0 bg-white z-20 py-3">
      <h1 className="font-inter font-medium text-[20px] text-[#000000]">
        Community Guidelines
      </h1>

      <button className="cursor-pointer bg-green-500 px-4 py-2 rounded-md flex items-center gap-1">
        <Pen size={12} color="#ffffff" />
        <span className="text-[#ffffff] font-inter font-semibold text-[11px]">
          Edit Guidelines
        </span>
      </button>
    </div>

    <div className="h-250 bg-blue-100 mt-4"></div>
  </div>

</div>
  );
};

export default page;
