

"use client";

import { useState, useEffect, useRef } from "react";
import { User2, ChevronDown, Eye } from "lucide-react";
import { formatNumber } from "@/helper/convertNumber";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { useHelpSupport } from "@/context/helpSupportContext";

const statusOptions = [
  {
    value: "pending",
    label: "Pending",
    button:
      "bg-red-100 text-red-500 border-red-300",
    option:
      "text-red-500 hover:bg-red-50",
  },

  {
    value: "resolved",
    label: "In Progress",
    button:
      "bg-orange-100 text-orange-500 border-orange-300",
    option:
      "text-orange-500 hover:bg-orange-50",
  },

  {
    value: "completed",
    label: "Completed",
    button:
      "bg-green-100 text-green-600 border-green-300",
    option:
      "text-green-600 hover:bg-green-50",
  },
];

export default function HelpTable() {
  const modalRef =
    useRef<HTMLDivElement | null>(null);

  const [openId, setOpenId] = useState<
    number | null
  >(null);

  const {
    helps,
    loading,
    page,
    setPage,
    limit,
    totalPages,
    totalHelps,
  } = useHelpSupport();

  const [selectedQuery, setSelectedQuery] =
    useState("");

  const [status, setStatus] = useState<{
    [key: number]: string;
  }>({});

  const handleStatusChange = (
    id: number,
    value: string
  ) => {
    setStatus((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  /* CLOSE DROPDOWN ON OUTSIDE CLICK */

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenId(null);
    };

    if (openId !== null) {
      document.addEventListener(
        "click",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside
      );
    };
  }, [openId]);

  /* CLOSE MODAL */

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(
          event.target as Node
        )
      ) {
        setSelectedQuery("");
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

  const startItem =
    (page - 1) * limit + 1;

  const endItem = Math.min(
    page * limit,
    totalHelps
  );

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full bg-white rounded-xl p-4 max-h-[88%] flex flex-col">
          <h2 className="font-inter font-medium text-[14px] text-black mb-3">
            List Of All Queries
          </h2>

          <div className="w-full h-full overflow-x-auto flex-1 scrollbar-hide">
            <div className="h-full overflow-y-auto scrollbar-hide">
              <table className="w-full table-fixed min-w-200">
                <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
                  <tr>
                    <th className="text-left py-3 px-2 w-[6%]">
                      S. No.
                    </th>

                    <th className="text-left py-3 px-2 w-[8%]">
                      Profile
                    </th>

                    <th className="text-left py-3 px-2 w-[18%]">
                      Name
                    </th>

                    <th className="text-left py-3 px-2 w-[20%]">
                      Email
                    </th>

                    <th className="text-left py-3 px-2 w-[22%]">
                      Description
                    </th>

                    <th className="text-left py-3 px-2 w-[10%]">
                      Date
                    </th>

                    <th className="text-left py-3 px-2 w-[16%]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {helps.map(
                    (b: any, idx: number) => (
                      <tr
                        key={idx}
                        className="font-inter font-medium text-[12px] text-[#747474] border-b border-[#f1f1f1]"
                      >
                        <td className="py-4 px-2">
                          {(page - 1) *
                            limit +
                            idx +
                            1}
                        </td>

                        <td className="py-3 px-2">
                          {b.user
                            .profile_image ? (
                            <div className="w-14 h-14 rounded-full overflow-hidden relative border border-[#ececec]">
                              <Image
                                src={
                                  b.user
                                    .profile_image
                                }
                                alt="profile"
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-[#e9e8e8bd] border border-[#ececec] flex items-center justify-center">
                              <User2
                                size={24}
                              />
                            </div>
                          )}
                        </td>

                        <td className="truncate px-2">
                          {b.user.name}
                        </td>

                        <td className="truncate px-2">
                          {b.user.email}
                        </td>

                        <td className="truncate px-2   " onClick={() =>
                              setSelectedQuery(
                                b.description ||
                                  "No query available"
                              )
                            }>
                          <div className="flex items-center gap-2 cursor-pointer" >
                          <span>
                            {(b.description ||
                              "").length >
                            30
                              ? `${b.description.slice(
                                  0,
                                  30
                                )}...`
                              : b.description}
                          </span>
                          <Eye size={12}/>
                          </div>
                        </td>

                        <td className="truncate px-2">
                          {b.created_at}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-2 py-3">
                          <div className="relative inline-block w-[80%]">
                            {/* BUTTON */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();

                                setOpenId(
                                  openId ===
                                    b.id
                                    ? null
                                    : b.id
                                );
                              }}
                              className={`w-full px-3 py-1.5 rounded-md border text-[12px] font-medium flex items-center justify-between gap-2
                              ${
                                statusOptions.find(
                                  (s) =>
                                    s.value ===
                                    (status[
                                      b.id
                                    ] ||
                                      "pending")
                                )?.button
                              }
                            `}
                            >
                              <span>
                                {
                                  statusOptions.find(
                                    (
                                      s
                                    ) =>
                                      s.value ===
                                      (status[
                                        b.id
                                      ] ||
                                        "pending")
                                  )?.label
                                }
                              </span>

                              <ChevronDown
                                size={14}
                              />
                            </button>

                            {/* DROPDOWN */}
                            {openId ===
                              b.id && (
                              <div
                                onClick={(
                                  e
                                ) =>
                                  e.stopPropagation()
                                }
                                className="absolute right-0 mt-1 w-full bg-white border rounded-md shadow-lg z-50 overflow-hidden border-[#74747454]"
                              >
                                {statusOptions.map(
                                  (
                                    option
                                  ) => (
                                    <div
                                      key={
                                        option.value
                                      }
                                      onClick={() => {
                                        handleStatusChange(
                                          b.id,
                                          option.value
                                        );

                                        setOpenId(
                                          null
                                        );
                                      }}
                                      className={`px-3 py-2 text-[12px] font-medium cursor-pointer transition-all
                                    ${option.option}
                                  `}
                                    >
                                      {
                                        option.label
                                      }
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            
          </div>


          {/* PAGINATION */}
            <div className="flex items-center justify-between w-full bg-[#F8F8F8] py-2 px-2">
              <p className="flex text-sm font-inter font-normal text-[#161616cb]">
                Showing{" "}
                {formatNumber(
                  startItem
                )}{" "}
                to{" "}
                {formatNumber(endItem)}{" "}
                out of{" "}
                {formatNumber(
                  totalHelps
                )}
              </p>

              <div className="flex items-center gap-6 text-sm font-inter font-medium">
                <span
                  onClick={() => {
                    if (page > 1) {
                      setPage(
                        (prev) =>
                          prev - 1
                      );
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

                <span className="text-[#333232]">
                  {formatNumber(page)}{" "}
                  /{" "}
                  {formatNumber(
                    totalPages
                  )}
                </span>

                <span
                  onClick={() => {
                    if (
                      page <
                      totalPages
                    ) {
                      setPage(
                        (prev) =>
                          prev + 1
                      );
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
      )}

      {/* QUERY POPUP */}
      {selectedQuery && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div
            className="bg-white rounded-xl p-5 w-125 flex flex-col gap-4"
            ref={modalRef}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-inter text-lg font-semibold text-black">
                Full Description
              </h2>

              <button
                onClick={() =>
                  setSelectedQuery("")
                }
                className="text-red-500 text-lg cursor-pointer"
              >
                ×
              </button>
            </div>

            <p className="font-inter text-sm text-[#5e5e5e] leading-6 wrap-break">
              {selectedQuery}
            </p>
          </div>
        </div>
      )}
    </>
  );
}