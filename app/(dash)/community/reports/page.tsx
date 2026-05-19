"use client";

import { Eye, TextAlignStart } from "lucide-react";
import { useReportedContent } from "@/context/reportedContentContext";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/helper/convertNumber";

export default function ReportTable() {
  const {
    loading,
    reports,
    pagination,
    page,
    setPage,
    limit,
  } = useReportedContent();

  const total = pagination?.total || 0;

  const totalPages =
    pagination?.totalPages || 0;

  const dropdownRef =
    useRef<HTMLDivElement | null>(null);

  const [filterType, setFilterType] =
    useState<string | null>(null);

  const [openFilter, setOpenFilter] =
    useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpenFilter(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const filteredContent = filterType
    ? reports.filter(
        (content) =>
          content.type === filterType
      )
    : reports;

  /* ================= PAGINATION ================= */

  const startItem =
    total === 0
      ? 0
      : (page - 1) * limit + 1;

  const endItem = Math.min(
    page * limit,
    total
  );

  return (
  
     
        <div className=" font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
          <div className="flex items-center justify-between">
            <h1 className="font-inter font-medium text-[20px] text-[#000000]">
              Reports And Moderations
            </h1>

            <div
              className="relative"
              ref={dropdownRef}
            >
              <button
                onClick={() =>
                  setOpenFilter(
                    (prev) => !prev
                  )
                }
                className="bg-[#ffffff] cursor-pointer border border-[#F3EDED] px-4 py-2 rounded-md flex items-center gap-2 justify-center"
              >
                <TextAlignStart
                  size={12}
                  color="#000"
                />

                <span className="text-[#000000] font-medium text-[12px] font-inter">
                  Filters
                </span>
              </button>

              {openFilter && (
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg p-2 z-50">
                  {[
                    "ALL",
                    "COMMENT",
                    "POST",
                  ].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilterType(
                          type === "ALL"
                            ? null
                            : type
                        );

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

           {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      ) : (

          <div className="w-full bg-white rounded-xl h-[90%] p-4">
            <h2 className="font-inter font-medium text-[14px] text-black mb-3">
              List Of Reported Content
            </h2>

            {/* ✅ X-axis scroll wrapper */}
            <div className="w-full h-full overflow-x-auto">
              {/* ✅ Y-axis scroll container */}
              <div className="h-[90%] overflow-y-auto scrollbar-hide">
                <table className="table-fixed w-full">
                  {/* ✅ Sticky Header */}
                  <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
                    <tr>
                      <th className="text-left py-3 w-1/10">S. No.</th>
                      <th className="text-left py-3 w-1/5">
                        Content
                      </th>

                      <th className="text-left py-3 w-1/5 px-4">
                        Type
                      </th>

                      <th className="text-left py-3 w-1/5">
                        Reports
                      </th>

                      <th className="text-left py-3 w-1/5">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredContent.map(
                      (item,idx) => (
                        <tr
                          key={`${item.type}-${item.id}`}
                          className="font-inter font-medium text-[12px] text-[#747474]"
                        >
                          <td>
                    {(page - 1) * limit + idx + 1}
                  </td>
                          {/* CONTENT */}
                          <td className="py-3 truncate overflow-hidden whitespace-nowrap">
                            {item.content}
                          </td>

                          {/* TYPE */}
                          <td className="px-4">
                            {item.type}
                          </td>


                          {/* REPORT COUNT */}
                          <td>
                            {
                              item.reportsCount
                            }
                          </td>

                          {/* ACTION */}
                          <td>
                            {/* <Eye
                              size={12}
                              color="#747474"
                              className="cursor-pointer"
                              onClick={() => {
                                if (
                                  item.type ===
                                  "POST"
                                ) {
                                  router.push(
                                    `/community/feed-management/${item.id}`
                                  );
                                }
                              }}
                            /> */}

                            <Eye
  size={12}
  color="#747474"
  className="cursor-pointer"
  onClick={() => {
    if (item.type === "POST") {
      router.push(
        `/community/feed-management/${item.id}`
      );
    }

    if (item.type === "COMMENT") {
      router.push(
        `/community/feed-management/${item.post_id}`
      );
    }
  }}
/>
                          </td>
                        </tr>
                      )
                    )}

                    {!filteredContent.length && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-10 text-[#747474] text-sm"
                        >
                          No reported content
                          found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>


              {/* ================= PAGINATION ================= */}

        <div className="flex items-center justify-between w-full bg-[#F8F8F8] py-2">

          <p className="flex text-sm font-inter font-normal text-[#161616cb]">
            Showing {formatNumber(startItem)} to{" "}
                  {formatNumber(endItem)} out of {formatNumber(total)}
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
          </div>)}
        </div>
      
  );
}