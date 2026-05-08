import SubscriptionTable from "@/components/ui/subscriptionTable";

import { Plus } from "lucide-react";

const page = () => {
  return (
    <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <div className="flex flex-col ">
        <h1 className="font-inter font-medium text-[20px] text-[#000000]">
          Subscriptions
        </h1>
        <div className="flex items-center justify-between">
          <span className="font-normal text-[#2F2F30] font-inter text-sm">
            Manage and monitor all user accounts across the platform
          </span>

          <button className="cursor-pointer bg-[#8B5CF6] px-4 py-2 rounded-md flex items-center justify-center gap-1">
            <Plus size={12} color="#ffffff" />
            <span className="text-[#ffffff] font-inter font-semibold text-[11px] ">
              Create New Plan
            </span>
          </button>
        </div>
      </div>

      
        <SubscriptionTable />
      
    </div>
  );
};

export default page;
