"use client";

import { useState, useEffect, useRef } from "react";
import { useChannel } from "@/context/channelContext";
import axios from "axios";
import { formatNumber } from "@/helper/convertNumber";
import toast from "react-hot-toast";
import { TableLoader } from "@/components/ui/loaders/tableLoader";
import { ChevronDown } from "lucide-react";

const channelOptions = [
  {
    value: "STANDARD",
    label: "Standard",
    button: "bg-green-100 text-green-600 border-green-300",
    option: "text-green-600 hover:bg-green-50",
  },
  {
    value: "POPULAR",
    label: "Popular",
    button: "bg-red-100 text-red-500 border-red-300",
    option: "text-red-500 hover:bg-red-50",
  },

  {
    value: "RECOMMENDED",
    label: "Recommended",
    button: "bg-orange-100 text-orange-500 border-orange-300",
    option: "text-orange-500 hover:bg-orange-50",
  },
];

export default function CommunityTable() {
  const [openId, setOpenId] = useState<number | null>(null);

  const [updateLoading, setUpdateLoading] = useState(false);

  const {
    channels,
    loading,
    page,
    setPage,
    limit,
    totalPages,
    totalChannels,
    fetchChannels,
  } = useChannel();

  useEffect(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    fetchChannels();
  }, [page]);

  /* CLOSE DROPDOWN ON OUTSIDE CLICK */

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenId(null);
    };

    if (openId !== null) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openId]);

  const [channelType, setChannelType] = useState<{
    [key: number]: string;
  }>({});

  const handleChannelTypeChange = (id: number, value: string) => {
    setChannelType((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const updates = Object.entries(channelType).map(([channel_id, type]) => ({
    channel_id,
    type,
  }));
  const updateChannelType = async () => {
    if (!updates.length) {
      toast.error("No changes to save");
      return;
    }
    try {
      setUpdateLoading(true);
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin-token="))
        ?.split("=")[1];

      if (!token) {
        toast.error("Unauthorized");
        return;
      }

      await axios.put("/api/updateChannelType", updates, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Channel type updated successfully");

      await fetchChannels();

      setChannelType({});
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setUpdateLoading(false);
    }
  };

  /* ================= PAGINATION ================= */

  const startItem = (page - 1) * limit + 1;

  const endItem = Math.min(page * limit, totalChannels);

  return (
    <div className=" font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <div className="flex  items-center justify-between">
        <h1 className="font-inter font-medium text-[20px] text-[#000000]">
          Channel Details
        </h1>

        <button
          onClick={updateChannelType}
          disabled={!Object.keys(channelType).length || updateLoading}
          className={`px-4 py-2 bg-purple-600 text-white rounded-sm hover:bg-purple-700 cursor-pointer ${
            !Object.keys(channelType).length || updateLoading
              ? "cursor-not-allowed opacity-40"
              : ""
          }`}
        >
          {updateLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* TABLE */}

      <div className="flex flex-col gap-4 overflow-y-auto max-h-170 bg-[#ffffff] rounded-xl p-4">
        <h2 className="font-inter font-medium text-[14px] text-black ">
          List Of All Channels
        </h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide ">
          <table className="table-auto w-full">
            <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
              <tr>
                {/* <th className="py-4 text-left w-[6%] px-2">Select</th> */}
                <th className="text-left py-4 w-[10%] px-2">S. No.</th>
                <th className="text-left py-4 w-[25%] px-2">Channel</th>
                <th className="text-left py-4 w-[25%] px-2">Created By</th>
                <th className="text-left py-4 w-[8%] px-2">Members</th>
                <th className="text-left py-4 w-[8%] px-2">Posts</th>
                <th className="text-left py-4 w-[10%] px-2">Status</th>
                <th className="py-4 text-left w-[14%] px-2">Channel Type</th>
              </tr>
            </thead>

            {loading ? (
              <TableLoader colSpan={7} />
            ) : (
              <tbody>
                {totalChannels > 0 ? (
                  channels.map((b, idx) => (
                    <tr
                      key={idx}
                      className="font-inter font-medium text-[12px] text-[#747474]"
                    >
                      <td className="py-4 px-2 break-all">
                        {(page - 1) * limit + idx + 1}
                      </td>
                      <td className="py-4 break-all px-2">{b.name}</td>
                      <td className="px-2 py-4 break-all">
                        {b.users.users_profile.user_name}
                      </td>

                      <td className="px-2 py-4 break-all">
                        {formatNumber(b.total_members)}
                      </td>
                      <td className="px-2 py-4 break-all">
                        {formatNumber(b._count.posts)}
                      </td>

                      <td className="px-2 py-4 break-all">
                        {b.is_active ? "Active" : "Inactive"}
                      </td>

                      <td className="px-2 py-4">
                        <div className="relative inline-block w-[80%]">
                          {/* BUTTON */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              setOpenId(
                                openId === Number(b.id) ? null : Number(b.id),
                              );
                            }}
                            className={`w-full px-3 py-1.5 rounded-md border text-[12px] font-medium flex items-center justify-between gap-2
  ${
    channelOptions.find(
      (s) =>
        s.value === (channelType[Number(b.id)] || b.channel_type || "STANDARD"),
    )?.button
  }
`}
                          >
                            <span>
                              {
                                channelOptions.find(
                                  (s) =>
                                    s.value ===
                                    (channelType[Number(b.id)] ||
                                      b.channel_type ||
                                      "STANDARD"),
                                )?.label
                              }
                            </span>

                            <ChevronDown size={14} className="shrink-0" />
                          </button>

                          {/* DROPDOWN */}
                          {openId === Number(b.id) && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 mt-1 w-full bg-white border rounded-md shadow-lg z-50 overflow-hidden border-[#74747454]"
                            >
                              {channelOptions.map((option) => (
                                <div
                                  key={option.value}
                                  onClick={() => {
                                    handleChannelTypeChange(
                                      Number(b.id),
                                      option.value,
                                    );

                                    setOpenId(null);
                                  }}
                                  className={`px-3 py-2 text-[12px] font-medium cursor-pointer transition-all
            ${option.option}
          `}
                                >
                                  {option.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-10 text-[#747474] text-sm"
                    >
                      Channels not found
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
            {totalChannels === 0
              ? `Showing 0 results`
              : `Showing ${formatNumber(startItem)} to ${formatNumber(endItem)} out
              of ${formatNumber(totalChannels)}`}
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
  );
}
