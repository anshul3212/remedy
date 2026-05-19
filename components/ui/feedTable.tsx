"use client";

import { useState, useEffect, useRef } from "react";

import { Eye } from "lucide-react";

import { useRouter } from "next/navigation";

import { usePost } from "@/context/getAllPostContext";

export default function FeedTable() {
  const router = useRouter();
  const [openId, setOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const {posts,fetchPosts} = usePost();

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

  return (
    <div className="w-full bg-white rounded-xl p-4">
      <h2 className="font-inter font-medium text-[14px] text-black mb-3">
        List Of All Posts
      </h2>

      {/* ✅ X-axis scroll wrapper */}
      <div className="w-full overflow-x-auto">
        {/* ✅ Y-axis scroll container */}
        <div className="max-h-110 min-h-110 overflow-y-auto scrollbar-hide">
          <table className="min-w-200 w-full">
            {/* ✅ Sticky Header */}
            <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
              <tr>
                <th className="text-left py-3">Posts</th>
                <th className="text-left py-3">User</th>
                <th className="text-left py-3">Channel</th>
                <th className="text-left py-3">Date</th>
                <th className="text-left py-3">Reports</th>
                {/* <th className="text-left py-3">Status</th> */}
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {posts.map((p) => (
                <tr
                  key={p.id}
                  className="font-inter font-medium text-[12px] text-[#747474]"
                >
                  <td className="py-3">{p.title}</td>
                  <td>{p.users.users_profile?.user_name}</td>
                  <td>{p.channels?.name}</td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td>{p._count.post_reports}</td>
                  <td>
                    <Eye size={12} color="#747474" className="cursor-pointer" 
                      onClick={()=>router.push(`/community/feed-management/${p.id}`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
}
