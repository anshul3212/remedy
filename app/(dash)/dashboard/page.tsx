"use client";
import DashCard from "@/components/ui/dashCard";
import UserTable from "@/components/ui/userTable";
import { useUser } from "@/context/userContext";

import {
  TrendingUp,
} from "lucide-react";



const Page = () => {

  const {total} = useUser();

  const formatNumber = (num: number) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

const cardData = [
  {
    heading: "TOTAL USERS",
    icon: <TrendingUp color="#30AC56" size={14} />,
    text: "+12% from last month",
    numbers: formatNumber(total),
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

      <div className="w-full h-full bg-white rounded-xl p-4 flex flex-col justify-between">
        <UserTable />
      </div>
    </div>
  );
};

export default Page;
