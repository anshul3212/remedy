"use client"

import CommunityTable from "@/components/ui/communityTable";

import {BarChart2, Dot, Eye, Megaphone, MonitorDot, Tv, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";

const cardData = [
  {
    heading: "Total Posts",
    numbers: "10",
    icon: <UsersRound size={24} color="#8B5CF6" />,
    bgColor: "bg-[#F5F3FF]",
  },
  {
    heading: "Total Comments",
    numbers: "14,482",
    icon: <MonitorDot size={24} color="#3ba936" />,
    bgColor: "bg-[#ECFDF5]",
  },
  {
    heading: "Total Channels",
    numbers: "84",
    icon: <MonitorDot size={24} color="#3ba936" />,
    bgColor: "bg-[#ECFDF5]",
  },
  {
    heading: "Active Users",
    numbers: "16",
    icon: <UsersRound size={24} color="#8B5CF6" />,
    bgColor: "bg-[#F5F3FF]",
  },
];

const ChannelData =[
    {
        heading:"PCOS",
        members:"450",
        posts:"12k"
    },

    {
        heading:"PCOS",
        members:"450",
        posts:"12k"
    },

    {
        heading:"PCOS",
        members:"450",
        posts:"12k"
    },

    {
        heading:"PCOS",
        members:"450",
        posts:"12k"
    },
    {
        heading:"PCOS",
        posts:"450",
        members:"12k"
    },
]

const Page = () => {

  const router = useRouter();

  
  return (
    <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <h1 className="font-inter font-medium text-[20px] text-[#000000]">
        Community Dashboard
      </h1>
      {/* <div className="flex items-center gap-6">
        {cardData.map((data, idx) => (
          <div
            key={idx}
            className="bg-[#FFFFFF] shadow-[0px_0px_2.51px_0px_#00000040] rounded-xl flex items-center gap-4 px-6 py-4"
          >
            <div
              className={`w-14 h-14 rounded-full ${data.bgColor} flex items-center justify-center`}
            >
              {data.icon}
            </div>

            <div className="flex flex-col">
              <span className="font-inter text-[#747474] text-[11px] font-medium">
                {data.heading}
              </span>
              <span className="font-inter text-[#272424] text-[22px] font-semibold">
                {data.numbers}
              </span>
            </div>
          </div>
        ))}
      </div> */}

      <div className="flex items-center gap-4">
         {/* <div className="w-[70%]">*/}
        <div className="w-full">
          <CommunityTable />
        </div>

        {/* <div className="w-[30%] h-full bg-white rounded-xl flex flex-col gap-2">
          <div className="flex items-center justify-between p-4">
            <h2 className="font-inter font-medium text-[14px] text-black">
              Top Active Channels
            </h2>
            <button className="text-[#747474] text-xs font-inter font-medium cursor-pointer">
              view all
            </button>
          </div>

          <div className="flex flex-col justify-between h-full  py-2">
            {ChannelData.map((data,idx)=>(
<div className="flex items-center justify-between bg-[#f8f8f8] px-4 py-3" key={idx}>
                <Eye size={24} color="#747474"/>
                <div className="flex flex-col ">
                    <span className="text-sm font-medium font-inter text-black">{data.heading}</span>
                    <div className="text-xs font-medium font-inter text-[#747474] flex items-center">
<span>{data.members} Members</span>
<Dot size={16} color="#000"/>
<span>{data.posts} Posts</span>
                    </div>
                    
                </div>

                <BarChart2 size={24} color="#747474"/>
            </div>
            ))}
            
            
          </div>
        </div> */}
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-inter font-medium text-[14px] text-black">Quick Actions</span>
        <div className="flex items-center gap-4">

       
            {/* <button className="p-4 flex items-center gap-3 rounded-md shadow-[0px_0px_2.51px_0px_#00000040] cursor-pointer" onClick={()=>router.push("/community/announcements")}>
                <Megaphone size={20} color="#000" />
                <span className="text-sm text-black font-inter font-medium">Create Announcements</span>
            </button> */}

            <button onClick={()=>router.push("/community/channel-management/add-channels")} className="p-4 flex items-center gap-3 rounded-md shadow-[0px_0px_2.51px_0px_#00000040] cursor-pointer">
                <Tv size={20} color="#000" />
                <span className="text-sm text-black font-inter font-medium">Categories Channels</span>
            </button>

             </div>
      </div>
    </div>
  );
};

export default Page;
