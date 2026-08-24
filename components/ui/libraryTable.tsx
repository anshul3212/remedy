"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, Trash, X } from "lucide-react";
import { useBlog } from "@/context/blogContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { formatNumber } from "@/helper/convertNumber";
import toast from "react-hot-toast";
import { TableLoader } from "./loaders/tableLoader";

export default function LibrayTable() {
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);
  const [selectedBlogId,setSelectedBlogId] = useState<string|null>(null)
  const [deleteLoading,setDeleteLoading] = useState(false);

  const {
    blogs,
    fetchBlogs,
    loading,
    page,
    setPage,
    limit,
    pagination,
    filter,
    setFilter,
  } = useBlog();

  const total = pagination?.total || 0;

  const totalPages = pagination?.totalPages || 0;

  useEffect(() => {
    setFilter("ALL");
    setPage(1);
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [page, filter]);

  const deleteBlog = async (blogId: string) => {
    if(!blogId){
      return;
    }
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin-token="))
      ?.split("=")[1];
    if (!token) return;

    try {
      setDeleteLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_DEV_URL}/admin/blog/remove-blog`,
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

      toast.success("Blog deleted successfully");
      setOpenModal(false)

      fetchBlogs();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Something went wrong";

      toast.error(message);
    }finally{
      setDeleteLoading(false);
    }
  };
  const startItem = (page - 1) * limit + 1;

  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-4 overflow-y-auto max-h-170 bg-[#ffffff] rounded-xl p-4">
      <h2 className="font-inter font-medium text-[14px] text-black ">
        List Of All Content
      </h2>

      <div className="flex-1 overflow-y-auto scrollbar-hide ">
        <table className="table-auto w-full">
          <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
            <tr>
              <th className="text-left py-4 px-2 w-[8%]">S. No.</th>
              <th className="text-left py-4 px-2 w-[32%] ">Title</th>
              <th className="text-left py-4 px-4 w-[22%]">Category</th>
              <th className="text-left py-4 px-2 w-[10%]">Status</th>
              <th className="text-left py-4 px-2 w-[10%]">Content Type</th>
              <th className="text-left py-4 px-2 w-[10%]">Last Updated</th>
              <th className="text-left py-4 px-2 w-[8%]">Actions</th>
            </tr>
          </thead>
          {loading ? (
            <TableLoader colSpan={7} />
          ) : (
            <tbody>
              {blogs.length > 0 ? (
                blogs.map((b, idx) => (
                  <tr
                    key={idx}
                    className="font-inter font-medium text-[12px] text-[#747474] px-5"
                  >
                    <td className="px-2 py-4">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className="py-4 break-all px-2">{b.title}</td>

                    <td className="break-all px-2 py-4 ">
                      {b.blog_categories
                        ?.map((c: any) =>
                          c.mstr_categories?.name?.replaceAll("_", " "),
                        )
                        .join(" | ")}
                    </td>

                    <td className="break-all px-2 py-4">{b.status}</td>

                    <td className="break-all px-2 py-4">{b.type}</td>

                    <td className="break-all px-2 py-4 ">{b.updatedAt}</td>

                    <td className="flex items-center gap-2 px-2 py-4">
                      <Eye
                        size={14}
                        color="#747474"
                        onClick={() =>
                          router.push(`/library/content/${b.uuid}`)
                        }
                        className="cursor-pointer"
                      />
                      <Trash
                        size={14}
                        color="#e62828"
                        onClick={() => {setSelectedBlogId(String(b.id));
                          setOpenModal(true);
                        }}
                        className="cursor-pointer"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-[#747474] text-sm"
                  >
                    Blogs not found
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      {/* ================= PAGINATION ================= */}

      <div className="flex items-center justify-between w-full bg-[#F8F8F8] py-4 px-2">
        <p className="flex text-sm font-inter font-normal text-[#161616cb]">
          {total === 0
            ? `Showing 0 results`
            : `Showing ${formatNumber(startItem)} to ${formatNumber(endItem)} out of ${formatNumber(total)}`}
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

      {/* delete modal */}
          {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="shadow-md bg-[white] border border-[#787878] rounded-2xl w-155.75 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-normal text-[black] font-inter">
               Delete Blog
              </h2>
              <X
                color="black"
                size={23}
                onClick={() => {
                  setOpenModal(false);
                  setSelectedBlogId(null)
                }}
                className="cursor-pointer"
              />
            </div>

            <p className="text-[#747474] font-inter font-normal text-[20px] text-center">
              Are you sure you want to delete this blog?
            </p>

            <div className="flex justify-end gap-2">
              {/* Cancel Button */}
              <button
                onClick={() => {
                  setOpenModal(false);
                  setSelectedBlogId(null)
                }}
                className="px-4 py-2 text-sm border border-[#7d7d7d] rounded-sm font-inter text-[12px] font-medium text-[#242323] min-w-35.75"
              >
                Cancel
              </button>

              {/* Add Button */}
              <button
                disabled={deleteLoading}
                onClick={()=>deleteBlog(String(selectedBlogId))}
                className={`px-4 py-2 text-sm rounded-sm font-inter text-[12px] font-medium text-[white] bg-red-500 cursor-pointer min-w-35.75 ${deleteLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              >
                {!deleteLoading ? "Delete" : "Deleting"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
