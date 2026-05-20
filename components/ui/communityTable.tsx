"use client";

import { useState, useEffect, useRef } from "react";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useReportedContent } from "@/context/reportedContentContext";

export default function CommunityTable() {
  const [openId, setOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();


  const {reportedPosts,
        reportedComments,
        loading,} = useReportedContent(); 

        const mergedReports = [
  ...reportedPosts.map((p) => ({
    id: p.id,
    type: "POST",
    content: p.title,
    reportsCount: p._count.post_reports,
    status: "Pending",
  })),

  ...reportedComments.map((c) => ({
    id: c.id,
    type: "COMMENT",
    content: c.comment,
    reportedBy: c.comment_reports?.[0]?.users?.users_profile?.user_name || "N/A",
    reportsCount: c._count.comment_reports,
    status: "Pending",
  })),
];

const splitedData = mergedReports.slice(5,15);

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
    <>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full bg-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-inter font-medium text-[14px] text-black mb-3">
              List Of Reported Content
            </h2>
            <button
              onClick={() => router.push("/community/reports")}
              className="text-[#747474] text-xs font-inter font-medium cursor-pointer"
            >
              view all
            </button>
          </div>
          {/* ✅ X-axis scroll wrapper */}
          <div className="w-full overflow-x-auto">
            {/* ✅ Y-axis scroll container */}
            <div className="max-h-110 min-h-110 overflow-y-auto scrollbar-hide">
              <table className="min-w-200 table-fixed w-full">
                {/* ✅ Sticky Header */}
                <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
                  <tr>
                    <th className="text-left py-3">Content Preview</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3">Reports</th>
                    {/* <th className="text-left py-3">Status</th> */}
                    <th className="text-left py-3">Actions</th>
                  </tr>
                </thead>

                <tbody className="">
                  {splitedData?.map((cat, idx) => (
                    <tr
                      key={idx}
                      className="font-inter font-medium text-[12px] text-[#747474] "
                    >
                      <td className="py-3 truncate ">{cat.content}</td>
                      <td className="px-4">{cat.type}</td>

                      <td>{cat.reportsCount}</td>

                      {/* <td>Pending</td> */}

                      <td>
                        <Eye
                          size={12}
                          color="#747474"
                          className="cursor-pointer"
                          onClick={() =>
                            router.push(`/community/feed-management/${cat.id}`)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
