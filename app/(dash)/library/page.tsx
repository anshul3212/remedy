"use client";

import FilterSelector from "@/components/ui/filter";
import LibrayTable from "@/components/ui/libraryTable";
import { useBlog } from "@/context/blogContext";
import { useRouter } from "next/navigation";

type ReportFilter =
  | "ALL"
  | "ARTICLE"
  | "AUDIO"
  | "VIDEO"
  | "OTHER";

  

const Page = () => {
  const router = useRouter();
  const reportFilters = [
  {
    value: "ALL",
    label: "All",
  },
  {
    value: "ARTICLE",
    label: "Article",
  },
  {
    value: "AUDIO",
    label: "Audio",
  },
  {
    value: "VIDEO",
    label: "Video",
  },
  {
    value: "OTHER",
    label: "Other",
  },
] satisfies {
  value: ReportFilter;
  label: string;
}[];
const {
    
    
    filter,
    setFilter,
    setPage,
  } = useBlog();

  return (
    <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <div className="flex flex-col ">
        <h1 className="font-inter font-medium text-[20px] text-[#000000]">
          Library
        </h1>
        <div className="flex items-center justify-between">
          <span className="font-normal text-[#2F2F30] font-inter text-sm">
            Manage and monitor all user accounts across the platform
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/library/content")}
              className="cursor-pointer bg-[#8B5CF6] h-12 px-4 py-2 rounded-md flex items-center justify-center"
            >
              <span className="text-[#ffffff] font-inter font-semibold text-[11px] ">
                Create Content
              </span>
            </button>
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
        </div>
      </div>

      <LibrayTable/>
    </div>
  );
};

export default Page;
