

"use client";

import { useState, useEffect, useRef } from "react";
import { User2, ChevronDown, Eye } from "lucide-react";
import { formatNumber } from "@/helper/convertNumber";
import toast from "react-hot-toast";
import Image from "next/image";
import { useHelpSupport } from "@/context/helpSupportContext";
import Loader from "./loaders/loader";
import { TableLoader } from "./loaders/tableLoader";

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
    fetchHelp
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

  useEffect(()=>{
    fetchHelp()
  },[page])

  useEffect(()=>{
    setPage(1);
  },[])

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
        <div className="flex flex-col gap-4 overflow-y-auto max-h-180 bg-[#ffffff] rounded-xl p-4">
         <h2 className="font-inter font-medium text-[14px] text-black ">
            List Of All Queries
          </h2>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
          <table className="w-full table-auto">
                <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
                  <tr>
                    <th className="text-left py-4 px-2 w-[6%]">
                      S. No.
                    </th>

                    <th className="text-left py-4 px-2 w-[10%]">
                      Profile
                    </th>

                    <th className="text-left py-4 px-2 w-[18%]">
                      Name
                    </th>

                    <th className="text-left py-4 px-2 w-[20%]">
                      Email
                    </th>

                    <th className="text-left py-4 px-2 w-[22%]">
                      Description
                    </th>

                    <th className="text-left py-4 px-2 w-[12%]">
                      Date
                    </th>

                    <th className="text-left py-4 px-2 w-[12%]">
                      Actions
                    </th>
                  </tr>
                </thead>
{
  loading?(<TableLoader colSpan={7}/>):(<tbody>
    {
      helps.length>0?(helps.map(
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

                        <td className="py-4 px-2">
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

                        <td className="break-all px-2 py-4">
                          {b.user.name}
                        </td>

                        <td className="break-all px-2 py-4">
                          {b.user.email}
                        </td>

                        <td className="break-all px-2 py-4">
                            {b.description}

                        </td>

                        <td className="break-all px-2 py-4">
                          {b.created_at}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-2 py-4">
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
                                className="shrink-0"
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
                  )):(
                    <tr>
                    <td
                      colSpan={7}
                      className="text-center py-10 text-[#747474] text-sm"
                    >
                      Queries not found
                    </td>
                  </tr>
                  )
    }
                  
                </tbody>)
}
                
              </table>
            

            
          </div>


          {/* PAGINATION */}
            <div className="flex items-center justify-between w-full bg-[#F8F8F8] py-4 px-2">

              <p className="flex text-sm font-inter font-normal text-[#161616cb]">
          {totalHelps === 0
            ? `Showing 0 results`
            : `Showing ${formatNumber(startItem)} to ${formatNumber(endItem)} out
              of ${formatNumber(totalHelps)}`}
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

      
  );

}