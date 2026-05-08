import FeedTable from "@/components/ui/feedTable";
import { ChevronDown } from "lucide-react";

const page = () => {
    return (
        <div className=" font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
            <h1 className="font-inter font-medium text-[20px] text-[#000000]">
          Feed Management
        </h1>
        <div className="flex items-center gap-4">

       
            <button className="p-4 flex items-center gap-3 rounded-md shadow-[0px_0px_2.51px_0px_#00000040] cursor-pointer">
                <span className="text-sm text-black font-inter font-medium">All Channels</span>
                <ChevronDown size={20} color="#000" />
            </button>

            <button className="p-4 flex items-center gap-3 rounded-md shadow-[0px_0px_2.51px_0px_#00000040] cursor-pointer">
                <span className="text-sm text-black font-inter font-medium">All Status</span>
                <ChevronDown size={20} color="#000" />
            </button>

            <button className="p-4 flex items-center gap-3 rounded-md shadow-[0px_0px_2.51px_0px_#00000040] cursor-pointer">
                
                <span className="text-sm text-black font-inter font-medium">All Time</span>
                <ChevronDown size={20} color="#000" />
            </button>
             </div>
        <FeedTable/>
        </div>
    );
}

export default page;