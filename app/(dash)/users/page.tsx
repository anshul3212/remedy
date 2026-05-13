"use client"

import UserTable from "@/components/ui/userTable";
import { useUser } from "@/context/userContext";
import { ArrowDown, Ban, CircleEllipsis, MonitorDot, UsersRound } from "lucide-react";



const Page = () => {
    const {totalUsers,loading} = useUser();
  

//   const cardData = [
//   {
//     heading: "Total Users",
//     numbers: totalUsers,
//     icon: <UsersRound size={24} color="#8B5CF6" />,
//     bgColor:"bg-[#F5F3FF]",
//   },
//   {
//     heading: "Active Now",
//     numbers: "14,482",
//     icon: <MonitorDot size={24} color="#3ba936"/>,
//     bgColor:"bg-[#ECFDF5]",
//   },
//   {
//     heading: "Pending",
//     numbers: "84",
//     icon: <CircleEllipsis size={24} color="#D87300"/>,
//     bgColor:"bg-[#FFFBEB]",
//   },
//   {
//     heading: "Blocked",
//     numbers: "16",
//     icon: <Ban size={24} color="#FF0012"/>,
//     bgColor:"bg-[#fff1f2]",
//   },
// ];


const cardData = [
  {
    heading: "Total Users",
    numbers: totalUsers,
    icon: <UsersRound size={24} color="#8B5CF6" />,
    bgColor:"bg-[#F5F3FF]",
  },
];
  return (

    <>
    {loading?(<div className="flex items-center justify-center w-[80%] h-[80%]">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>):(
      <div className=" font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <div className="flex flex-col ">
        <h1 className="font-inter font-medium text-[20px] text-[#000000]">
          Users
        </h1>
        <div className="flex items-center justify-between">
          <span className="font-normal text-[#2F2F30] font-inter text-sm">
            Manage and monitor all user accounts across the platform
          </span>
          {/* <button className="bg-[#ffffff] cursor-pointer border border-[#F3EDED] px-4 py-2 rounded-md flex items-center gap-2 justify-center">
            <ArrowDown size={12} color="#000" />
            <span className="text-[#000000] font-medium text-[12px] font-inter">
              Export List
            </span>
          </button> */}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {cardData.map((data, idx) => (
          <div
            key={idx}
            className="bg-[#FFFFFF] shadow-[0px_0px_2.51px_0px_#00000040] rounded-xl flex items-center gap-4 px-6 py-4"
          >
            <div className={`w-14 h-14 rounded-full ${data.bgColor} flex items-center justify-center`}>
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
      </div>
<div className="w-full h-full bg-white rounded-xl p-4 flex flex-col justify-between">
        <UserTable />
      </div>

    </div>
    )
    }

    
    </>
  );
};

export default Page;
