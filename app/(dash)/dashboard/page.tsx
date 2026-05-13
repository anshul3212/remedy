"use client";
import DashCard from "@/components/ui/dashCard";
import UserGrowthChart from "@/components/ui/graph";
import CommunityEngagementChart from "@/components/ui/pieChart";
import PriorityAlertCard from "@/components/ui/priorityAlertCard";
import UserTable from "@/components/ui/userTable";
import { useUser } from "@/context/userContext";

import {
  FilePlusCorner,
  MessageSquareMore,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";

import { useState } from "react";





const PriorityAlertData = [
  {
    info: "Medical mis-information",
    name: "@clair_Well",
    time: "14 minute ago",
    image: "/logo.png",
  },
  {
    info: "Medical mis-information",
    name: "@clair_Well",
    time: "14 minute ago",
    image: "/logo.png",
  },
];


const Page = () => {
  const [activeMap, setActiveMap] = useState<{ [key: number]: number }>({});

  const {totalUsers} = useUser();

  const formatNumber = (num: number) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

// const cardData = [
//   {
//     heading: "TOTAL USERS",
//     icon: <TrendingUp color="#30AC56" size={14} />,
//     text: "+12% from last month",
//     numbers: formatNumber(totalUsers),
//     bgColor: "bg-[#F0FDF4]",
//     borderColor: "border-[#30AC56]",
//   },
//   {
//     heading: "ACTIVE TODAY",
//     icon: <TrendingUp color="#30AC56" size={14} />,
//     text: "+5% engagement",
//     numbers: "8.9K",
//     bgColor: "bg-[#F0FDF4]",
//     borderColor: "border-[#30AC56]",
//   },
//   {
//     heading: "NEW SINGUPS",
//     icon: <TrendingUp color="#30AC56" size={14} />,
//     text: "+8% conversion",
//     numbers: "432",
//     bgColor: "bg-[#F0FDF4]",
//     borderColor: "border-[#30AC56]",
//   },
//   {
//     heading: "POSTS",
//     icon: <MessageSquareMore color="#8B5CF6" size={14} />,
//     text: "+15% Weekly",
//     numbers: "2.1k",
//     bgColor: "bg-[#8B5CF61C]",
//     borderColor: "border-[#8B5CF6]",
//   },
//   {
//     heading: "REPORTED",
//     icon: <TriangleAlert color="#FC5A5A" size={14} />,
//     text: "Critical action",
//     numbers: "12",
//     bgColor: "bg-[#FC5A5A1A]",
//     borderColor: "border-[#FC5A5A]",
//   },
//   {
//     heading: "SUBSCRIPTION",
//     icon: <FilePlusCorner color="#222222" size={14} />,
//     text: "+3% Renewal rate",
//     numbers: "5.4k",
//     bgColor: "bg-[#F0FDF4]",
//     borderColor: "border-[#30AC56]",
//   },
// ];

const cardData = [
  {
    heading: "TOTAL USERS",
    icon: <TrendingUp color="#30AC56" size={14} />,
    text: "+12% from last month",
    numbers: formatNumber(totalUsers),
    bgColor: "bg-[#F0FDF4]",
    borderColor: "border-[#30AC56]",
  }
];
  
  return (
    <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      {/* cards */}
      <div className="flex items-center justify-between">
        {cardData.map((data, idx) => (
          <DashCard
            key={idx}
            heading={data.heading}
            icon={data.icon}
            numbers={data.numbers}
            text={data.text}
            bgColor={data.bgColor}
            borderColor={data.borderColor}
          />
        ))}
      </div>

      {/* <div className="flex items-center justify-between gap-4">
        <UserGrowthChart />
        <CommunityEngagementChart />
      </div> */}

      {/* <div className="flex  flex-col w-full bg-white p-4 rounded-xl gap-4">
        <div className="flex items-center gap-2">
          <h3 className="font-inter font-semibold text-[#000000] text-sm">
            Priority Moderation Alerts
          </h3>
          <div className="bg-[#BA1A1A] rounded-[7.17px] px-4 flex items-center justify-center">
            <span className="font-inter font-semibold text-[10px] text-[#FFFFFF]">
              3 REQUIRED
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {PriorityAlertData.map((data, idx) => (
            <PriorityAlertCard
              key={idx}
              info={data.info}
              image={data.image}
              name={data.name}
              time={data.time}
              active={activeMap[idx] ?? 0}
              setActive={(val: number) =>
                setActiveMap((prev) => ({
                  ...prev,
                  [idx]: val,
                }))
              }
            />
          ))}
        </div>
      </div> */}

      <div className="w-full h-full bg-white rounded-xl p-4 flex flex-col justify-between">
        <UserTable />
      </div>
    </div>
  );
};

export default Page;
