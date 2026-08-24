"use client";
import CategoryTable from "@/components/ui/categoryTable";
import { useBlog } from "@/context/blogContext";
import axios from "axios";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [openModal, setOpenModal] = useState(false);
  const { fetchCategories } = useBlog();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const createCategory = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin-token="))
      ?.split("=")[1];
    if (!token) return;

    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_DEV_URL}/admin/blog/create-category`,
        {
          name: name.replace(" ", "_").toUpperCase(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      toast.success("category added");
      setName("");
      setOpenModal(false);
      await fetchCategories();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto  h-[calc(100vh-100px)]">
      <div className="flex flex-col ">
        <h1 className="font-inter font-medium text-[20px] text-[#000000]">
          Categories
        </h1>
        <div className="flex items-center justify-between">
          <span className="font-normal text-[#2F2F30] font-inter text-sm">
            Manage and monitor all user accounts across the platform
          </span>

          <button
            onClick={() => setOpenModal(true)}
            className="cursor-pointer bg-[#8B5CF6] px-4 py-2 rounded-md flex items-center justify-center gap-1"
          >
            <Plus size={12} color="#ffffff" />
            <span className="text-[#ffffff] font-inter font-semibold text-[11px]">
              Add Category
            </span>
          </button>
        </div>
      </div>

      <CategoryTable />

      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="shadow-md bg-[white] border border-[#787878] rounded-2xl w-155.75 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-normal text-[black] font-inter">
                Add Category
              </h2>
              <X
                color="black"
                size={23}
                onClick={() => {
                  setOpenModal(false);
                  setName("");
                }}
                className="cursor-pointer"
              />
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category"
              className="w-full border border-[#7d7d7d] p-2 rounded-md text-sm outline-none h-12"
            />

            <div className="flex justify-end gap-2">
              {/* Cancel Button */}
              <button
                onClick={() => {
                  setOpenModal(false);
                  setName("");
                }}
                className="px-4 py-2 text-sm border border-[#7d7d7d] rounded-sm font-inter text-[12px] font-medium text-[#242323] min-w-35.75"
              >
                Cancel
              </button>

              {/* Add Button */}
              <button
                disabled={!name.trim()}
                onClick={() => {
                  createCategory();
                }}
                className={`px-4 py-2 text-sm rounded-sm font-inter text-[12px] font-medium text-[white] bg-[#8B5CF6] cursor-pointer min-w-35.75 ${!name.trim() || loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              >
                {!loading ? "Add" : "Adding"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
