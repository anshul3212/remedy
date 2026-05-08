"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, MoreVertical } from "lucide-react";
import { useBlog } from "@/context/blogContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useChannel } from "@/context/channelContext";


export default function ChannelTable() {
  const [openId, setOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

  const { blogs, fetchBlogs } = useBlog();
  const { channels, loading } = useChannel();


  //  const filteredBlogs = filterType
  //   ? blogs.filter((b) => b.type === filterType)
  //   : blogs;



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

  const deleteBlog = async (blogId: string) => {
    const token = localStorage.getItem("token");

    const confirmDelete = confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      await axios.post(
        "http://3.13.92.66/api/v1/admin/blog/remove-blog",
        {
          blog_id: blogId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      fetchBlogs();

    } catch (error: any) {
      console.log(error.response?.data || error.message);
    }
  };


  return (
    <>
      {loading ? <div className="flex items-center justify-center w-full h-full">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div> :
        <div className="w-full bg-white rounded-xl p-4">
          <h2 className="font-inter font-medium text-[14px] text-black mb-3">
            List Of All Channels
          </h2>

          {/* ✅ X-axis scroll wrapper */}
          <div className="w-full overflow-x-auto">

            {/* ✅ Y-axis scroll container */}
            <div className="max-h-120 min-h-115 overflow-y-auto scrollbar-hide">

              <table className="table-fixed w-full">

                {/* ✅ Sticky Header */}
                <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
                  <tr>
                    <th className="text-left py-3 w-1/6">Channel</th>
                    <th className="text-left py-3 w-1/6 px-4">Created By</th>
                    <th className="text-left py-3 w-1/6">Members</th>
                    <th className="text-left py-3 w-1/6">Posts</th>
                    <th className="text-left py-3 w-1/6">Status</th>
                    <th className="text-left py-3 w-1/6">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {channels.map((b) => (
                    <tr
                      key={b.id}
                      className="font-inter font-medium text-[12px] text-[#747474]"
                    >
                      <td className="py-3 truncate overflow-hidden whitespace-nowrap">{b.name}</td>
                      <td className="px-4">
                        {b.user_name}
                      </td>


                      <td>

                        {b.total_members}
                      </td>
                      <td>{b._count.posts}</td>

                      <td>Active</td>


                      <td>
                        <Eye size={12} color="#747474" className="cursor-pointer" />
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
