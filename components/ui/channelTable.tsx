"use client";

import { useState, useEffect, useRef } from "react";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChannel } from "@/context/channelContext";
import { formatNumber } from "@/helper/convertNumber";


export default function ChannelTable() {
  const [openId, setOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

  const { channels, loading,
    page,
        setPage,
        limit,
        totalPages,
        totalChannels,
   } = useChannel();


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

  /* ================= PAGINATION ================= */

  const startItem =
    (page - 1) * limit + 1;

  const endItem = Math.min(
    page * limit,
    totalChannels
  );

  return (
    <>
      {loading ? <div className="flex items-center justify-center w-full h-full">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div> :
        <div className="w-full bg-[#ffffff] rounded-xl p-4 h-[90%]">
          <h2 className="font-inter font-medium text-[14px] text-black mb-3">
            List Of All Channels
          </h2>

          {/* ✅ X-axis scroll wrapper */}
          <div className="w-full h-full overflow-x-auto">

            {/* ✅ Y-axis scroll container */}
            <div className="h-[90%] overflow-y-auto scrollbar-hide">

              <table className="table-fixed w-full">

                {/* ✅ Sticky Header */}
                <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
                  <tr>
                    <th className="text-left py-3 w-1/7">S. No.</th>
                    <th className="text-left py-3 w-1/7">Channel</th>
                    <th className="text-left py-3 w-1/7 px-4">Created By</th>
                    <th className="text-left py-3 w-1/7">Members</th>
                    <th className="text-left py-3 w-1/7">Posts</th>
                    <th className="text-left py-3 w-1/7">Date</th>
                    <th className="text-left py-3 w-1/7">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {channels.map((b,idx) => (
                    <tr
                      key={idx}
                      className="font-inter font-medium text-[12px] text-[#747474]"
                    >
                      <td>
                    {(page - 1) * limit + idx + 1}
                  </td>

                      <td className="py-3 truncate overflow-hidden whitespace-nowrap">{b.name}</td>
                      <td className="px-4">
                        {b.users.users_profile.user_name}
                      </td>


                      <td>
 
                        {b.total_members}
                      </td>
                      <td>{b._count.posts}</td>
                      <td>{new Date(b.created_at).toLocaleDateString()}</td>

                      {/* <td>Active</td> */}


                      <td>
                        <Eye size={12} color="#747474" className="cursor-pointer" onClick={()=>router.push(`/community/channel-management/${b.id}`)}/>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================= PAGINATION ================= */}

        <div className="flex items-center justify-between w-full bg-[#F8F8F8] py-2">

          <p className="flex text-sm font-inter font-normal text-[#161616cb]">
            Showing {formatNumber(startItem)} to {formatNumber(endItem)} out of{" "}
            {formatNumber(totalChannels)}
          </p>

          <div className="flex items-center gap-6 text-sm font-inter font-medium">

            {/* PREV */}
            <span
              onClick={() => {
                if (page > 1) {
                  setPage((prev) => prev - 1);
                }
              }}
              className={`cursor-pointer ${
                page === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#e21f11cb]"
              }`}
            >
              Prev
            </span>

            {/* PAGE */}
            <span className="text-[#333232]">
              {formatNumber(page)} / {formatNumber(totalPages)}
            </span>

            {/* NEXT */}
            <span
              onClick={() => {
                if (page < totalPages) {
                  setPage((prev) => prev + 1);
                }
              }}
              className={`cursor-pointer ${
                page === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#4159e6]"
              }`}
            >
              Next
            </span>
          </div>
        </div>
          </div>

    
        </div>
      }
    </>
  );
}
