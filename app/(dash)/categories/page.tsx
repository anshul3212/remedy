"use client";
import CategoryTable from "@/components/ui/categoryTable";
import { useBlog } from "@/context/blogContext";
import axios from "axios";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
  const [openModal, setOpenModal] = useState(false);
  const { categories } = useBlog();
  const [name, setName] = useState("");
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpenModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const createCategory = async () => {
    const token = localStorage.getItem("token");
    

    try {
       await axios.post(
        `${process.env.NEXT_PUBLIC_DEV_URL}/blog/create-category`,
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
      toast.success("category added")

      categories();

    } catch (error: any) {
      const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error.message ||
                "Something went wrong";

              toast.error(message);
    }
  };

  return (
    <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
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

          {openModal && ( 
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div
                className="bg-white w-85 p-8 rounded-md shadow-md"
                ref={modalRef}
              >
                <h2 className="text-sm font-semibold mb-3">Add Category</h2>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter category"
                  className="w-full border p-2 rounded-md text-sm outline-none mb-4"
                />

                <div className="flex justify-end gap-2">
                  {/* Cancel Button */}
                  <button
                    onClick={() => setOpenModal(false)}
                    className="px-3 py-1 text-sm bg-red-400 text-white rounded-md cursor-pointer"
                  >
                    Cancel
                  </button>

                  {/* Add Button */}
                  <button
                    onClick={() => {
                      createCategory();
                      setOpenModal(false);
                      setName("");
                    }}
                    className="px-3 py-1 text-sm bg-[#8B5CF6] text-white rounded-md cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      
        <CategoryTable />

        <Toaster/>
    
    </div>
  );
};

export default Page;
