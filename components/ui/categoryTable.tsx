"use client";

import { useState, useEffect, useRef } from "react";
import { useBlog } from "@/context/blogContext";
import axios from "axios";
import { Trash, X } from "lucide-react";
import toast from "react-hot-toast";
import { formatNumber } from "@/helper/convertNumber";
import { TableLoader } from "./loaders/tableLoader";

export default function CategoryTable() {
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const { category, loading, fetchCategories } = useBlog();

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategory = async () => {
    if (!selectedCategoryId) return;

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin-token="))
      ?.split("=")[1];
    if (!token) return;
    try {
      setDeleting(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_DEV_URL}/admin/blog/remove-category`,
        {
          category_id: selectedCategoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      toast.success("category deleted");
      setDeleteModal(false);
      setSelectedCategoryId(null);

      await fetchCategories();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 overflow-y-auto max-h-170 bg-[#ffffff] rounded-xl p-4">
          <h2 className="font-inter font-medium text-[14px] text-black ">
        List Of All Categories
      </h2>

      
       
        <div className="flex-1 overflow-y-auto scrollbar-hide ">
              <table className="table-auto w-full">
           
            <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
              <tr>
                <th className="text-left py-4 px-2 w-[8%]">S.no</th>
                <th className="text-left py-4 px-2 w-[32%]">Category Name</th>
                <th className="text-left py-4 px-2 w-[32%]">Total articles</th>
                <th className="text-left py-4 px-2 w-[18%]">Created date</th>
                <th className="text-left py-4 px-2 w-[10%]">Actions</th>
              </tr>
            </thead>
            {loading ? (
              <TableLoader colSpan={5} />
            ) : (
              <tbody>
                {category.length > 0 ? (
                  category?.map((cat, idx) => (
                    <tr
                      key={cat.id}
                      className="font-inter font-medium text-[12px] text-[#747474]"
                    >
                      <td className="py-4 px-2">{idx + 1}</td>
                      <td className="px-2 py-4 break-all">{cat.name.replace("_", " ")}</td>

                      <td className="px-2 py-4 break-all">{formatNumber(cat.total_blogs)}</td>

                      <td className="px-2 py-4 break-all">
                        {new Date(cat.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-2 py-4 break-all">
                        <Trash
                          size={12}
                          color="#e62828"
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedCategoryId(cat.id);
                            setDeleteModal(true);
                          }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-[#747474] text-sm"
                    >
                      Categories not found
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      

      {/* delete modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-inter">
          <div className="bg-[white] border border-[#787878] rounded-2xl w-155.75 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-normal text-[black] font-inter">
                Delete Category
              </h3>
              <X
                color="black"
                size={23}
                onClick={() => {
                  setDeleteModal(false);
                  setSelectedCategoryId(null);
                }}
                className="cursor-pointer"
              />
            </div>

            <p className="text-[#747474] font-inter font-normal text-[20px] text-center">
              Are you sure you want to delete this category?
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setSelectedCategoryId(null);
                }}
                className="px-4 py-2 text-sm border border-[#7d7d7d] rounded-sm font-inter text-[12px] font-medium text-[#242323] min-w-35.75"
              >
                Cancel
              </button>

              <button
                disabled={deleting}
                onClick={deleteCategory}
                className={`px-4 py-2 bg-red-500 text-sm rounded-sm font-inter text-[12px] font-medium text-[white] min-w-35.75
    ${deleting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
