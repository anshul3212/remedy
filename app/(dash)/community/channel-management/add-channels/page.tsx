"use client";

import { useState, useEffect, useRef } from "react";
import { useChannel } from "@/context/channelContext";
import axios from "axios";
import { formatNumber } from "@/helper/convertNumber";
import toast, { Toaster } from "react-hot-toast";
import { TableLoader } from "@/components/ui/loaders/tableLoader";

export default function CommunityTable() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  const categories = ["popular", "recommended"];
  const [selectedCategory, setSelectedCategory] = useState("popular");

  // close dropdown outside
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
      setPage(1);
    }, []);

  useEffect(()=>{
    fetchChannels();
  },[page])

  useEffect(() => {
    if (!channels) return;

    const filtered = channels
      .filter(
        (c) =>
          (c.channel_type || "").toLowerCase() ===
          selectedCategory.toLowerCase(),
      )
      .map((c) => Number(c.id));

    setSelectedPosts(filtered);
  }, [selectedCategory, channels]);

  // select toggle
  const toggleSelect = (id: number) => {
    setSelectedPosts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (!channels) return;

    if (selectedPosts.length === channels.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(channels.map((p) => Number(p.id)));
    }
  };

  const removeBulkAction = async () => {
    try {
      const selectedChannels = channels.filter((channel) =>
        selectedPosts.includes(Number(channel.id)),
      );

      const channelIds = selectedChannels.map((c) => c.id);
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin-token="))
        ?.split("=")[1];
      if (!token) return;

      const res = await axios.put(
        "/api/updateChannelCategory",
        {
          channelIds,
          category: "STANDARD",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",
          },
        },
      );
      toast.success("removed from category");
      fetchChannels();

      setSelectedPosts([]);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Something went wrong";
      toast.error(message);
    }
  };

  const updateCategory = async () => {
    try {
      const selectedChannels = channels.filter((channel) =>
        selectedPosts.includes(Number(channel.id)),
      );

      const channelIds = selectedChannels.map((c) => c.id);
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin-token="))
        ?.split("=")[1];
      if (!token) return;

      await axios.put(
        "/api/updateChannelCategory",
        {
          channelIds,
          category: selectedCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",
          },
        },
      );
      toast.success("category updated");
      fetchChannels();

      setSelectedPosts([]);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Something went wrong";
      toast.error(message);
    }
  };

  /* ================= PAGINATION ================= */

  const startItem = (page - 1) * limit + 1;

  const endItem = Math.min(page * limit, totalChannels);

  return (
    <div className=" font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <h1 className="font-inter font-medium text-[20px] text-[#000000]">
        Channel Details
      </h1>

      {/* CLEAN  ACTION BAR */}
      <div className="flex flex-wrap gap-2 items-center mb-4 text-xs bg-gray-50 p-2 rounded-lg">
        {/* CATEGORY SELECT */}
        <select
          className="border border-[#706d6db0] text-[#7d7d7d] px-4 py-2 outline-none cursor-pointer rounded-sm text-xs bg-white "
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c.toUpperCase()}
            </option>
          ))}
        </select>

        {/* ADD */}
        <button
          onClick={updateCategory}
          disabled={!selectedPosts.length}
          className="px-4 py-2 bg-purple-600 text-white rounded-sm disabled:opacity-40 hover:bg-purple-700 cursor-pointer"
        >
          Add to Category
        </button>

        {/* REMOVE (NEW) */}
        <button
          onClick={removeBulkAction}
          disabled={!selectedPosts.length}
          className="px-4 py-2 bg-red-500 text-white cursor-pointer rounded-sm disabled:opacity-40 hover:bg-red-600"
        >
          Remove
        </button>

        {/* SELECT ALL */}
        <button
          onClick={toggleSelectAll}
          className="px-4 py-2 rounded-sm cursor-pointer border hover:bg-gray-100 border-[#706d6db0] text-[#7d7d7d]"
        >
          {selectedPosts.length === channels?.length
            ? "Unselect All"
            : "Select All"}
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
                    <th className="py-4 text-left w-[6%] px-2">Select</th>
                    <th className="text-left py-4 w-[8%] px-2">S. No.</th>
                    <th className="text-left py-4 w-[30%] px-2">Channel</th>
                    <th className="text-left py-4 w-[30%] px-2">Created By</th>
                    <th className="text-left py-4 w-[8%] px-2">Members</th>
                    <th className="text-left py-4 w-[8%] px-2">Posts</th>
                    <th className="text-left py-4 w-[10%] px-2">Status</th>
                  </tr>
                </thead>

                {
                  loading?(<TableLoader colSpan={7}/>):(
                  
                  
                  <tbody>
                      {
                    totalChannels>0?(channels.map((b, idx) => (
                    <tr
                      key={idx}
                      className="font-inter font-medium text-[12px] text-[#747474]"
                    >
                      <td className="py-4 px-2 break-all">
                        <input
                          type="checkbox"
                          checked={selectedPosts.includes(Number(b.id))}
                          onChange={() => toggleSelect(Number(b.id))}
                        />
                      </td>

                      <td className="py-4 px-2 break-all">{(page - 1) * limit + idx + 1}</td>
                      <td className="py-4 break-all px-2">
                        {b.name}
                      </td>
                      <td className="px-2 py-4 break-all">
                        {b.users.users_profile.user_name}
                      </td>

                      <td className="px-2 py-4 break-all">{formatNumber(b.total_members)}</td>
                      <td className="px-2 py-4 break-all">{formatNumber(b._count.posts)}</td>

                      <td className="px-2 py-4 break-all">Active</td>
                    </tr>
                  ))):(
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-10 text-[#747474] text-sm"
                      >
                        Channels not found
                      </td>
                    </tr>
                  )}
                  
                </tbody>)
                }

                
              </table>
            
          </div>

          {/* ================= PAGINATION ================= */}

          <div className="flex items-center justify-between w-full bg-[#F8F8F8] py-4 px-2">
            <p className="flex text-sm font-inter font-normal text-[#161616cb]">
              {
                totalChannels===0?`Showing 0 results`:`Showing ${formatNumber(startItem)} to ${formatNumber(endItem)} out
              of ${formatNumber(totalChannels)}`
              }
              
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
