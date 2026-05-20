"use client"
import ChannelTable from "@/components/ui/channelTable";
import { Tv } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
    return (
        <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between">

      
      <h1 className="font-inter font-medium text-[20px] text-[#000000]">
        Channel Management
      </h1>

      <button onClick={()=>router.push("/community/channel-management/add-channels")} className="p-4 flex items-center gap-3 rounded-md shadow-[0px_0px_2.51px_0px_#00000040] cursor-pointer">
                <Tv size={20} color="#000" />
                <span className="text-sm text-black font-inter font-medium">Categories Channels</span>
            </button>
            </div>
      
        <ChannelTable/>

        </div>
    );
}

export default Page;