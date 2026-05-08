"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical } from "lucide-react";
import { useUser } from "@/context/userContext";

const planHeaders = [
  "S.no",
  "Plan name",
  "Price (Monthly / Yearly)",
  "Duration",
  "Status",
  "Actions",
];

const sunscribedUserHeaders = [
  "S.no",
  "User Name",
  "Email",
  "Plan Name",
  "Start Date",
  "Expiry Date",
  "Actions",
];

export default function SubscriptionTable() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { users } = useUser();

  const headers = activeTab === 0 ? planHeaders : sunscribedUserHeaders;
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between  p-2 rounded-lg bg-white w-100" >
        {["Plans", "Subscribed Users"].map((label, index) => (
          <button
            key={label}
            onClick={() => setActiveTab(index)}
            className={`flex items-center justify-center px-4 py-2 font-inter font-medium rounded-md transition-all duration-300 w-45 cursor-pointer text-sm
      ${
        activeTab === index
          ? "text-[#000000] bg-[#FFFFFF] border border-[#E8E8E8] rounded-lg  "
          : "bg-[#F8F6F6] text-[#00000040]"
      }
    `}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="w-full h-full bg-white rounded-xl p-4 flex flex-col justify-between">
      <div className="w-full bg-white rounded-xl p-4">
        <h2 className="font-inter font-medium text-[14px] text-black mb-3">
          List Of All Plans
        </h2>

        {/* ✅ X-axis scroll wrapper */}
        <div className="w-full overflow-x-auto">
          {/* ✅ Y-axis scroll container */}
          <div className="max-h-100 min-h-100 overflow-y-auto scrollbar-hide">
            <table className="min-w-200 w-full">
              {/* ✅ Sticky Header */}
              <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
                <tr>

                  {headers.map((head, index) => (
      <th key={index} className="text-left py-3">
        {head}
      </th>
    ))}
                </tr>
              </thead>

           <AnimatePresence mode="wait">
  {activeTab === 0 ? (
    <motion.tbody
      key="plans"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      {users.map((user) => (
        <tr
          key={user.id}
          className=" font-inter font-medium text-[12px] text-[#747474]"
        >
          <td className="py-3">{user.name}</td>
          <td>{user.email}</td>

          <td>
            <span
              className={`flex items-center gap-1 ${
                user.status === "active"
                  ? "text-[#34A853]"
                  : "text-[#B8B8B8]"
              }`}
            >
              ● {user.status}
            </span>
          </td>

          <td>{user.condition}</td>
          <td>{user.joined}</td>

          {/* ACTION */}
          <td className="relative">
            <button
              onClick={() =>
                setOpenId(openId === user.id ? null : user.id)
              }
            >
              <MoreVertical size={16} className="cursor-pointer" />
            </button>
          </td>
        </tr>
      ))}
    </motion.tbody>
  ) : (
    <motion.tbody
      key="subscribed"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
        {users.map((user) => (
        <tr
          key={user.id}
          className=" font-inter font-medium text-[12px] text-[#747474]"
        >
          <td className="py-3">{user.name}</td>
          <td>{user.email}</td>

          <td>
            <span
              className={`flex items-center gap-1 ${
                user.status === "active"
                  ? "text-[#34A853]"
                  : "text-[#B8B8B8]"
              }`}
            >
              ● {user.status}
            </span>
          </td>

          <td>{user.condition}</td>
          <td>{user.joined}</td>
          <td>{user.joined}</td>

          {/* ACTION */}
          <td className="relative">
            <button
              onClick={() =>
                setOpenId(openId === user.id ? null : user.id)
              }
            >
              <MoreVertical size={16} className="cursor-pointer" />
            </button>
          </td>
        </tr>
      ))}
      
    </motion.tbody>
  )}
</AnimatePresence>

              
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between text-xs text-gray-400 mt-4">
          <span>Showing 3 of 12.8k members</span>
          <div className="flex gap-3 text-purple-500">
            <button>Previous</button>
            <button>Next</button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
