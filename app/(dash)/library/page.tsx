"use client";

import LibrayTable from "@/components/ui/libraryTable";
import { TextAlignStart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Page = () => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [openFilter, setOpenFilter] = useState(false);

  const router = useRouter();
 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <div className="flex flex-col ">
        <h1 className="font-inter font-medium text-[20px] text-[#000000]">
          Library
        </h1>
        <div className="flex items-center justify-between">
          <span className="font-normal text-[#2F2F30] font-inter text-sm">
            Manage and monitor all user accounts across the platform
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/library/content")}
              className="cursor-pointer bg-[#8B5CF6] px-4 py-2 rounded-md flex items-center justify-center"
            >
              <span className="text-[#ffffff] font-inter font-semibold text-[11px] ">
                Create Content
              </span>
            </button>
            <div className="relative">
              <button
                onClick={() => setOpenFilter((prev) => !prev)}
                className="bg-[#ffffff] cursor-pointer border border-[#F3EDED] px-4 py-2 rounded-md flex items-center gap-2 justify-center"
              >
                <TextAlignStart size={12} color="#000" />
                <span className="text-[#000000] font-medium text-[12px] font-inter">
                  Filters
                </span>
              </button>

              {openFilter && (
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg p-2 z-50">
                  {["ALL", "ARTICLE", "AUDIO", "VIDEO"].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilterType(type === "ALL" ? null : type);
                        setOpenFilter(false);
                      }}
                      className="w-full text-left px-2 py-1 text-xs text-[#797676] hover:bg-gray-100 rounded"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-full bg-white rounded-xl p-4 flex flex-col justify-between">
        <LibrayTable filterType={filterType} />
      </div>
    </div>
  );
};

export default Page;
