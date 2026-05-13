"use client";

import { useState, useEffect, useRef } from "react";
import { useBlog } from "@/context/blogContext";
import axios from "axios";
import { Trash } from "lucide-react";

export default function CategoryTable() {
  const [openId, setOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { category, loading, categories } = useBlog();

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

  const deleteCategory = async (catId: number) => {
    const token = localStorage.getItem("token");

    const confirmDelete = confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_DEV_URL}/blog/remove-category`,
        {
          category_id: catId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      alert("category deleted");
      categories();
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
            List Of All Categories
          </h2>

          {/* ✅ X-axis scroll wrapper */}
          <div className="w-full overflow-x-auto">
            {/* ✅ Y-axis scroll container */}
            <div className="max-h-120 min-h-115 overflow-y-auto scrollbar-hide">
              <table className="min-w-200 w-full">
                {/* ✅ Sticky Header */}
                <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
                  <tr>
                    <th className="text-left py-3">S.no</th>
                    <th className="text-left py-3">Category Name</th>
                    <th className="text-left py-3">Total articles</th>
                    <th className="text-left py-3">Created date</th>
                    <th className="text-left py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {category?.map((cat, idx) => (
                    <tr
                      key={cat.id}
                      className="font-inter font-medium text-[12px] text-[#747474]"
                    >
                      <td className="py-3">{idx + 1}</td>
                      <td>{cat.name.replace("_", " ")}</td>

                      <td>{cat.total_blogs}</td>

                      <td>{new Date(cat.created_at).toLocaleDateString()}</td>

                      <td>
                        <Trash
                          size={12}
                          color="#e62828"
                          className="cursor-pointer"
                          onClick={() => deleteCategory(cat.id)}
                        />
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
