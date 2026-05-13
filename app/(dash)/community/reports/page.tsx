"use client";



import { Eye, TextAlignStart } from "lucide-react";
import { useReportedContent } from "@/context/reportedContentContext";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";



export default function ReportTable() {
 
  const {loading,reportedPosts, reportedComments} = useReportedContent();
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

  const mergedReports = [
  ...reportedPosts.map((p) => ({
    id: p.id,
    type: "POST",
    content: p.title,
    reportedBy: p.post_reports?.[0]?.users?.users_profile?.user_name|| "N/A",
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
const filteredContent = filterType
  ? mergedReports.filter((content) => content.type === filterType)
  : mergedReports;
  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className=" font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
            <div className="flex items-center justify-between">

       
          <h1 className="font-inter font-medium text-[20px] text-[#000000]">
            Reports And Moderations
          </h1>

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
                  {["ALL", "COMMENT", "POST"].map((type) => (
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
          <div className="w-full bg-white rounded-xl p-4">
            <h2 className="font-inter font-medium text-[14px] text-black mb-3">
              List Of Reported Content
            </h2>

            {/* ✅ X-axis scroll wrapper */}
            <div className="w-full overflow-x-auto">
              {/* ✅ Y-axis scroll container */}
              <div className="max-h-120 min-h-120 overflow-y-auto scrollbar-hide">
                <table className="table-fixed w-full">
                  {/* ✅ Sticky Header */}
                  <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
                    <tr>
                      <th className="text-left py-3 w-1/6">Content</th>
                      <th className="text-left py-3 w-1/6 px-4">Type</th>
                      <th className="text-left py-3 w-1/6">Reported By</th>
                      <th className="text-left py-3 w-1/6">Reports</th>
                      {/* <th className="text-left py-3 w-1/6">Status</th> */}
                      <th className="text-left py-3 w-1/6">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredContent.map((item) => (
    <tr
      key={`${item.type}-${item.id}`}
      className="font-inter font-medium text-[12px] text-[#747474]"
    >
      {/* CONTENT */}
      <td className="py-3 truncate overflow-hidden whitespace-nowrap">
        {item.content}
      </td>

      {/* TYPE */}
      <td className="px-4">{item.type}</td>

      {/* REPORTED BY */}
      <td>{item.reportedBy}</td>

      {/* REPORT COUNT */}
      <td>{item.reportsCount}</td>

      {/* STATUS */}
      {/* <td>{item.status}</td> */}

      {/* ACTION */}
      <td>
        <Eye size={12} color="#747474" className="cursor-pointer" onClick={()=>{if(item.type==="POST"){
            router.push(`/community/feed-management/${item.id}`)
        }}} />
      </td>
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
