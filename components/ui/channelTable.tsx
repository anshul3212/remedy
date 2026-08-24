"use client";

import { useEffect } from "react";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChannel } from "@/context/channelContext";
import { formatNumber } from "@/helper/convertNumber";
import { TableLoader } from "./loaders/tableLoader";

export default function ChannelTable() {

  const router = useRouter();

  const { channels, loading, page, setPage, limit, totalPages, totalChannels,fetchChannels } =
    useChannel();


  useEffect(() => {
      setPage(1);
    }, []);

  useEffect(()=>{
    fetchChannels();
  },[page])

  /* ================= PAGINATION ================= */

  const startItem = (page - 1) * limit + 1;

  const endItem = Math.min(page * limit, totalChannels);

  return (
      
        <div className="flex flex-col gap-4 overflow-y-auto max-h-170 bg-[#ffffff] rounded-xl p-4">
          <h2 className="font-inter font-medium text-[14px] text-black ">
            List Of All Channels
          </h2>

          <div className="flex-1 overflow-y-auto scrollbar-hide ">
              <table className="table-auto w-full">
                <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
                  <tr>
                    <th className="text-left py-4 w-[8%] px-2">S. No.</th>
                    <th className="text-left py-4 w-[22%] px-2">Channel</th>
                    <th className="text-left py-4 w-[22%] px-2">Created By</th>
                    <th className="text-left py-4 w-[8%] px-2">Members</th>
                    <th className="text-left py-4 w-[8%] px-2">Posts</th>
                    <th className="text-left py-4 w-[12%] px-2">Date</th>
                    <th className="text-left py-4 w-[10%] px-2">Actions</th>
                  </tr>
                </thead>

                {loading ? (
        <TableLoader colSpan={7}/>
      ) : (

                <tbody>

                  {
                    totalChannels>0?(channels.map((b, idx) => (
                    <tr
                      key={idx}
                      className="font-inter font-medium text-[12px] text-[#747474]"
                    >
                      <td className="px-2 py-4 break-all">{(page - 1) * limit + idx + 1}</td>

                      <td className="px-2 py-4 break-all">
                        {b.name}
                      </td>
                      <td className="px-2 py-4 break-all">
                        {b.users.users_profile.user_name}
                      </td>

                      <td className="px-2 py-4 break-all">{formatNumber(b.total_members)}</td>
                      <td className="px-2 py-4 break-all">{formatNumber(b._count.posts)}</td>
                      <td className="px-2 py-4 break-all">{new Date(b.created_at).toLocaleDateString()}</td>

    
                      <td className="px-2 py-4 break-all">
                        <Eye
                          size={12}
                          color="#747474"
                          className="cursor-pointer"
                          onClick={() =>
                            router.push(`/community/channel-management/${b.id}`)
                          }
                        />
                      </td>
                    </tr>
                  ))):(
                      <tr>
                      <td
                        colSpan={7}
                        className="text-center py-10 text-[#747474] text-sm"
                      >
                        Channels not found
                      </td>
                    </tr>
                    )
                  }
                  
                </tbody>
      )}
              </table>
           
          </div>

          {/* ================= PAGINATION ================= */}

          <div className="flex items-center justify-between w-full bg-[#F8F8F8] py-4 px-2">

            <p className="flex text-sm font-inter font-normal text-[#161616cb]">
              {
                totalChannels===0?`Showing 0 results`:`Showing ${formatNumber(startItem)} to ${formatNumber(endItem)} out
              of ${formatNumber(totalChannels)}`
              }
              
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
  );
}
