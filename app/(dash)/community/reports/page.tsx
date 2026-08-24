"use client";

import { Eye } from "lucide-react";
import { useReportedContent } from "@/context/reportedContentContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/helper/convertNumber";
import FilterSelector from "@/components/ui/filter";
import { TableLoader } from "@/components/ui/loaders/tableLoader";

type ReportFilter =
  | "ALL"
  | "COMMENT"
  | "POST";

export default function ReportTable() {
  const reportFilters = [
  {
    value: "ALL",
    label: "All",
  },
  {
    value: "COMMENT",
    label: "Comment",
  },
  {
    value: "POST",
    label: "Post",
  },
] satisfies {
  value: ReportFilter;
  label: string;
}[];

  const { loading, reports, pagination, page, setPage, limit,fetchReportedContent,filter,setFilter } =
    useReportedContent();

  const total = pagination?.total || 0;

  const totalPages = pagination?.totalPages || 0;
  const router = useRouter();

  useEffect(() => {
  setFilter("ALL");
  setPage(1);
}, []);

useEffect(() => {
  fetchReportedContent();
}, [page, filter]);

  //   useEffect(() => {
  //   fetchReportedContent();
  // }, [page,filter]);

  

  //  useEffect(() => {
  //     setPage(1);
  //   }, [filter]);
  /* ================= PAGINATION ================= */

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;

  const endItem = Math.min(page * limit, total);

  return (
    <div className=" font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between">
        <h1 className="font-inter font-medium text-[20px] text-[#000000]">
          Reports And Moderations
        </h1>

            <FilterSelector
  value={filter}
  options={reportFilters}
  onSelect={(value) => {
    setFilter(value);
    setPage(1);
  }}
  width="min-w-50"
  placeholder="All"
/>
      </div>

      
        <div className="flex flex-col gap-4 overflow-y-auto max-h-170 bg-[#ffffff] rounded-xl p-4">
          <h2 className="font-inter font-medium text-[14px] text-black ">
            List Of Reported Content
          </h2>

            <div className="flex-1 overflow-y-auto scrollbar-hide ">
              <table className="table-auto w-full">
                <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
                  <tr>
                    <th className="text-left py-4 w-[8%] px-2">S. No.</th>
                    <th className="text-left py-4 w-[36%] px-2">Content</th>

                    <th className="text-left py-4 w-[26%] px-2">Type</th>

                    <th className="text-left py-4 w-[20%] px-2">Reports</th>

                    <th className="text-left py-4 w-[10%] px-2">Action</th>
                  </tr>
                </thead>

                {
                  loading?(<TableLoader colSpan={5}/>):(<tbody>
                  {
                    reports.length>0?(
reports.map((item, idx) => (
                    <tr
                      key={`${item.type}-${item.id}`}
                      className="font-inter font-medium text-[12px] text-[#747474]"
                    >
                      <td className="px-2 py-4 break-all">{(page - 1) * limit + idx + 1}</td>
                      {/* CONTENT */}
                      <td className="py-4 break-all px-2">
                        {item.content}
                      </td>

                      {/* TYPE */}
                      <td className="px-2 py-4 break-all">{item.type}</td>

                      {/* REPORT COUNT */}
                      <td className="px-2 py-4 break-all">
                        {formatNumber(item.reportsCount)}
                      </td>

                      {/* ACTION */}
                      <td className="px-2 py-4 break-all">
                        <Eye
                          size={12}
                          color="#747474"
                          className="cursor-pointer"
                          onClick={() => {
                            if (item.type === "POST") {
                              router.push(
                                `/community/feed-management/${item.id}`,
                              );
                            }

                            if (item.type === "COMMENT") {
                              router.push(
                                `/community/feed-management/${item.post_id}`,
                              );
                            }
                          }}
                        />
                      </td>
                    </tr>
                  ))

                    
                    ):(<tr>
                      <td
                        colSpan={5}
                        className="text-center py-10 text-[#747474] text-sm"
                      >
                        No reported content found
                      </td>
                    </tr>
                      )
                  }
                  

                </tbody>)
                }
 
                
              </table>
            </div>
          

          {/* ================= PAGINATION ================= */}

          <div className="flex items-center justify-between w-full bg-[#F8F8F8] py-4 px-2">
            <p className="flex text-sm font-inter font-normal text-[#161616cb]">
              {
              
                total===0?`Showing 0 results`:`Showing ${formatNumber(startItem)} to ${formatNumber(endItem)} out
              of ${formatNumber(total)}`
              
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
