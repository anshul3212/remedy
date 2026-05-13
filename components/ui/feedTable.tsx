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
                  {/* <td>
                    <span
                      className={`flex items-center gap-1`}
                      // ${
                      //   p.status === "active"
                      //     ? "text-[#34A853]"
                      //     : "text-[#B8B8B8]"
                      // }
                    >
                      ● Active
                    </span>
                  </td> */}

                  {/* ACTION */}
                  {/* <td className="relative">
                    <button
                      onClick={() =>
                        setOpenId(openId === Number(p.id) ? null : Number(p.id))
                      }
                    >
                      <MoreVertical size={16} className="cursor-pointer" />
                    </button>

                    <AnimatePresence>
                      {openId === Number(p.id) && (
                        <motion.div
                          ref={dropdownRef}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg p-2 z-50"
                        >
                          {["View", "Block"].map((action) => (
                            <button
                              key={action}
                              onClick={() => {
                                if (action === "View") {
                                  router.push(`/community/feed-management/${p.id}`);
                                }
                                if (action === "Block") {
                                  console.log("blocked");
                                }
                              }}
                              className={`w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded ${action === "Block" ? "text-red-600" : "text-[#4b4949]"} cursor-pointer`}
                            >
                              {action}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td> */}

                  <td>
                    <Eye size={12} color="#747474" className="cursor-pointer" onClick={()=>router.push(`/community/feed-management/${p.id}`)}/>
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
