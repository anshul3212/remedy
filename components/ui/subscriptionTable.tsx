"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, MoreVertical, Trash } from "lucide-react";
import { useUser } from "@/context/userContext";


const planHeaders = [
  { label: "S.no", width: "w-[8%]" },
  { label: "Plan name", width: "w-[22%]" },
  { label: "Price (Monthly / Yearly)", width: "w-[25%]" },
  { label: "Duration", width: "w-[15%]" },
  { label: "Status", width: "w-[15%]" },
  { label: "Actions", width: "w-[15%]" },
];

const subscribedUserHeaders = [
  { label: "S.no", width: "w-[8%]" },
  { label: "User Name", width: "w-[18%]" },
  { label: "Email", width: "w-[25%]" },
  { label: "Plan Name", width: "w-[15%]" },
  { label: "Start Date", width: "w-[12%]" },
  { label: "Expiry Date", width: "w-[12%]" },
  { label: "Actions", width: "w-[10%]" },
];

export default function SubscriptionTable() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { users} = useUser();

  const headers = activeTab === 0 ? planHeaders : subscribedUserHeaders;
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
    <div className="flex flex-col gap-4 max-h-[80%]">
      <div className="flex items-center justify-between  p-2 rounded-lg bg-white w-100">
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

      <div className="w-full max-h-full bg-white rounded-xl p-4 flex flex-col">
        <h2 className="font-inter font-medium text-[14px] text-black mb-3">
          List Of All Plans
        </h2>

        {/* ✅ X-axis scroll wrapper */}
        <div className="w-full h-full overflow-x-auto py-2 flex-1 scrollbar-hide">
          {/* ✅ Y-axis scroll container */}
          <div className="h-full overflow-y-auto scrollbar-hide">
            <table className="table-fixed w-full">
              {/* ✅ Sticky Header */}
              <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
                <tr>
                  {headers.map((head, index) => (
                    <th key={index} className={`text-left py-3 px-2 ${head.width}`}>
                      {head.label}
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
                    {users
                    .map((user, idx) => (
                      <tr
                        key={user.id}
                        className=" font-inter font-medium text-[12px] text-[#747474]"
                      >
                        <td className="py-3 truncate px-2">{idx + 1}</td>
                        <td className="py-3 truncate px-2">{user.email}</td>

                        <td className="py-3 truncate px-2">
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

                        <td className="py-3 truncate px-2">{user.condition}</td>
                        <td className="py-3 truncate px-2">{user.joined}</td>

                        {/* ACTION */}
                        <td className="flex items-center gap-2 py-3 px-2">
                        <Eye size={14} color="#747474" className="cursor-pointer"/>
                        <Trash size={14} color="#e62828"className="cursor-pointer"/>
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
                    {users.map((user, idx) => (
                      <tr
                        key={user.id}
                        className=" font-inter font-medium text-[12px] text-[#747474]"
                      >
                        <td className="py-3 truncate px-2">{idx + 1}</td>
                        <td className="py-3 truncate px-2">{user.email}</td>

                        <td className="py-3 truncate px-2">
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

                        <td className="py-3 truncate px-2">{user.condition}</td>
                        <td className="py-3 truncate px-2">{user.joined}</td>
                        <td className="py-3 truncate px-2">{user.joined}</td>

                        {/* ACTION */}
                        <td className="relative py-3 truncate px-2">
                          <button
                            onClick={() =>
                              setOpenId(openId === user.id ? null : user.id)
                            }
                          >
                            <MoreVertical
                              size={16}
                              className="cursor-pointer"
                            />
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
      </div>
    </div>
  );
}
