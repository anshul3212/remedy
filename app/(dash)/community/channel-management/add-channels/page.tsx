"use client";

import { useState, useEffect, useRef } from "react";
import { useChannel } from "@/context/channelContext";
import axios from "axios";

export default function CommunityTable() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { channels, loading, fetchChannels } = useChannel();

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
  if (!channels) return;

  const filtered = channels
    .filter((c) =>
      (c.channel_type || "").toLowerCase() ===
      selectedCategory.toLowerCase()
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

  
  const removeBulkAction = async() => {
    try {
      const selectedChannels = channels.filter((channel) =>
        selectedPosts.includes(Number(channel.id)),
      );

      const channelIds = selectedChannels.map((c) => c.id);

      const res = await axios.put(
        "/api/updateChannelCategory",
        {
          channelIds,
          category: "STANDARD",
        }
      );
      alert("removed from category");
      fetchChannels();

      setSelectedPosts([]);
    } catch (error: any) {
      console.log(error);
    }
  };

  const updateCategory = async () => {
    try {
      const selectedChannels = channels.filter((channel) =>
        selectedPosts.includes(Number(channel.id)),
      );

      const channelIds = selectedChannels.map((c) => c.id);

      const res = await axios.put(
        "/api/updateChannelCategory",
        {
          channelIds,
          category: selectedCategory,
        }
      );
      alert("category updated");
      fetchChannels();

      setSelectedPosts([]);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      ) : (
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

          <div className="w-full bg-white rounded-xl p-4">
            <h2 className="font-inter font-medium text-[14px] text-black mb-3">
              List Of All Channels
            </h2>

            {/* ✅ X-axis scroll wrapper */}
            <div className="w-full overflow-x-auto">
              {/* ✅ Y-axis scroll container */}
              <div className="max-h-98 min-h-98 overflow-y-auto scrollbar-hide">
                <table className="table-fixed w-full">
                  {/* ✅ Sticky Header */}
                  <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
                    <tr>
                      <th className="py-3 text-left w-1/6">Select</th>
                      <th className="text-left py-3 w-1/6">Channel</th>
                      <th className="text-left py-3 w-1/6 px-4">Created By</th>
                      <th className="text-left py-3 w-1/6">Members</th>
                      <th className="text-left py-3 w-1/6">Posts</th>
                      <th className="text-left py-3 w-1/6">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {channels.map((b) => (
                      <tr
                        key={b.id}
                        className="font-inter font-medium text-[12px] text-[#747474]"
                      >
                        <td className="py-3">
                          <input
                            type="checkbox"
                            checked={selectedPosts.includes(Number(b.id))}
                            onChange={() => toggleSelect(Number(b.id))}
                          />
                        </td>
                        <td className="py-3 truncate overflow-hidden whitespace-nowrap">
                          {b.name}
                        </td>
                        <td className="px-4">{b.user_name}</td>

                        <td>{b.total_members}</td>
                        <td>{b._count.posts}</td>

                        <td>Active</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
