"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, number } from "framer-motion";
import { Eye, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useReport } from "@/context/reportPostContext";


export default function CommunityTable() {
  const [openId, setOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const {reportedPosts,loading}= useReport();

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



return(
  <>
  {loading?<div className="flex items-center justify-center w-full h-full">
  <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
</div>:<div className="w-full bg-white rounded-xl p-4">
    <div className="flex items-center justify-between">

    
  <h2 className="font-inter font-medium text-[14px] text-black mb-3">
    List Of Reported Posts
  </h2>
  <button onClick={()=>router.push("/community/feed-management")} className="text-[#747474] text-xs font-inter font-medium cursor-pointer">
              view all
            </button>
</div>
  {/* ✅ X-axis scroll wrapper */}
  <div className="w-full overflow-x-auto">
    
    {/* ✅ Y-axis scroll container */}
    <div className="max-h-78 min-h-78 overflow-y-auto scrollbar-hide">

      <table className="min-w-200 table-fixed w-full">
        
        {/* ✅ Sticky Header */}
        <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
          <tr>
            <th className="text-left py-3">Content Preview</th>
            <th className="text-left py-3 px-4">Type</th>
            <th className="text-left py-3">Reports</th>
            <th className="text-left py-3">Status</th>
            <th className="text-left py-3">Actions</th>
          </tr>
        </thead>

        <tbody className="">
          {reportedPosts?.map((cat,idx) => (
            <tr
              key={cat.id}
              className="font-inter font-medium text-[12px] text-[#747474] "
            >
              <td className="py-3 truncate ">{cat.title}</td>
              <td className="px-4">Posts</td>
              
<td>{cat._count.post_reports}</td>
              


              <td>Pending</td>

              <td>
                    <Eye size={12} color="#747474" className="cursor-pointer" onClick={()=>router.push(`/community/feed-management/${cat.id}`)}/>
                  </td>
            </tr>
          ))}
        </tbody>
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
}
  </>
    
  );
}
