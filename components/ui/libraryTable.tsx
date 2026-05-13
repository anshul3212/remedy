"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, Trash } from "lucide-react";
import { useBlog } from "@/context/blogContext";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LibrayTable({
  filterType,
}: {
  filterType: string | null;
}) {
  const [openId, setOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

  const { blogs, fetchBlogs, loading } = useBlog();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = filterType
    ? blogs.filter((b) => b.type === filterType)
    : blogs;


  const deleteBlog = async (blogId: string) => {
    const token = localStorage.getItem("token");

    const confirmDelete = confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_DEV_URL}/blog/remove-blog`,
        {
          blog_id: blogId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      fetchBlogs();
    } catch (error: any) {
      console.log(error.response?.data || error.message);
    }
  };

  return ( 
    <>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full bg-white rounded-xl p-4">
          <h2 className="font-inter font-medium text-[14px] text-black mb-3">
            List Of All Content
          </h2>

          {/* ✅ X-axis scroll wrapper */}
          <div className="w-full overflow-x-auto">
            {/* ✅ Y-axis scroll container */}
            <div className="max-h-120 min-h-115 overflow-y-auto scrollbar-hide">
              {/* 🔥 FIX: table-fixed added */}
              <table className="w-full table-fixed min-w-200">
                {/* ✅ Sticky Header */}
                <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
                  <tr>
                    <th className="text-left py-3 px-5">Title</th>
                    <th className="text-left py-3 px-5">Category</th>
                    <th className="text-left py-3 px-5">Status</th>
                    <th className="text-left py-3 px-5">Content Type</th>
                    <th className="text-left py-3 px-5">Last Updated</th>
                    <th className="text-left py-3 px-5">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBlogs.map((b) => (
                    <tr
                      key={b.id}
                      className="font-inter font-medium text-[12px] text-[#747474] px-5"
                    >
                      <td className="py-3 truncate px-5">{b.title}</td>

                      <td className="truncate px-5">
                        {b.blog_categories
                          ?.map((c: any) =>
                            c.mstr_categories?.name?.replaceAll("_", " "),
                          )
                          .join(", ")}
                      </td>

                      <td className="truncate px-5">
                        <span>PUBLISHED</span>
                      </td>

                      <td className="truncate px-5">{b.type}</td>

                      <td className="truncate px-5 ">{b.updatedAt}</td>

                      <td className="flex items-center gap-2 px-5 py-3">
                        <Eye size={14} color="#747474" onClick={()=>router.push(`/library/content/${b.uuid}`)} className="cursor-pointer"/>
                        <Trash size={14} color="#e62828" onClick={()=>deleteBlog(String(b.id))} className="cursor-pointer"/>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
