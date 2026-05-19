"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, Trash } from "lucide-react";
import { useBlog } from "@/context/blogContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { formatNumber } from "@/helper/convertNumber";

export default function LibrayTable({
  filterType,
}: {
  filterType: string | null;
}) {

  const router = useRouter();

  const { blogs, fetchBlogs, loading,page,

        setPage,

        limit , pagination} = useBlog();

      const total = pagination?.total || 0;

  const totalPages =
    pagination?.totalPages || 0;

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

  const startItem =
    (page - 1) * limit + 1;

  const endItem = Math.min(
    page * limit,
    total
  );

  return ( 
    <>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full bg-white rounded-xl p-4 h-[88%]">
          <h2 className="font-inter font-medium text-[14px] text-black mb-3">
            List Of All Content
          </h2>

          {/* ✅ X-axis scroll wrapper */}
          <div className="w-full h-full overflow-x-auto">
            {/* ✅ Y-axis scroll container */}
            <div className="h-[90%] overflow-y-auto scrollbar-hide">
              {/* 🔥 FIX: table-fixed added */}
              <table className="w-full table-fixed min-w-200">
                {/* ✅ Sticky Header */}
                <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
                  <tr>
                    <th className="text-left py-3 w-1/15">S. No.</th>
                    <th className="text-left py-3 px-5 w-1/7">Title</th>
                    <th className="text-left py-3 px-5 w-1/7">Category</th>
                    <th className="text-left py-3 px-5 w-1/7">Status</th>
                    <th className="text-left py-3 px-5 w-1/7">Content Type</th>
                    <th className="text-left py-3 px-5 w-1/7">Last Updated</th>
                    <th className="text-left py-3 px-5 w-1/7">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBlogs.map((b,idx) => (
                    <tr
                      key={idx}
                      className="font-inter font-medium text-[12px] text-[#747474] px-5"
                    >
                       <td>
                    {(page - 1) * limit + idx + 1}
                  </td>
                      <td className="py-3 truncate px-5">{b.title}</td>

                      <td className="truncate px-5">
                        {b.blog_categories
                          ?.map((c: any) =>
                            c.mstr_categories?.name?.replaceAll("_", " "),
                          )
                          .join(", ")}
                      </td>

                      <td className="truncate px-5">
                        {b.status}
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

            {/* ================= PAGINATION ================= */}

        <div className="flex items-center justify-between w-full bg-[#F8F8F8] py-2">

          <p className="flex text-sm font-inter font-normal text-[#161616cb]">
            Showing {formatNumber(startItem)} to {formatNumber(endItem)} out of{" "}
            {formatNumber(total)}
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
      )}
    </>
  );
}
