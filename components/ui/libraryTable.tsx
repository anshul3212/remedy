"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical } from "lucide-react";
import { useBlog } from "@/context/blogContext";
import { useRouter } from "next/navigation";
import axios from "axios";


export default function LibrayTable({ filterType }: { filterType: string | null }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

  const {blogs,fetchBlogs, loading} = useBlog();

  
 useEffect(()=>{fetchBlogs()},[]);

 const filteredBlogs = filterType
  ? blogs.filter((b) => b.type === filterType)
  : blogs;



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

const deleteBlog = async (blogId: string) => {
  const token = localStorage.getItem("token");

  const confirmDelete = confirm("Are you sure you want to delete this blog?");
  if (!confirmDelete) return;

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_DEV_URL}/blog/remove-blog`,
      {
        blog_id: blogId, 
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );


    fetchBlogs();

  } catch (error: any) {
    console.log(error.response?.data || error.message);
  }
};


return(
  <>
  {loading?<div className="flex items-center justify-center w-full h-full">
  <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
</div>:
//     <div className="w-full bg-white rounded-xl p-4">
//   <h2 className="font-inter font-medium text-[14px] text-black mb-3">
//     List Of All Content
//   </h2>

//   {/* ✅ X-axis scroll wrapper */}
//   <div className="w-full overflow-x-auto">
    
//     {/* ✅ Y-axis scroll container */}
//     <div className="max-h-120 min-h-115 overflow-y-auto scrollbar-hide">

//       <table className="min-w-200 w-full">
        
//         {/* ✅ Sticky Header */}
//         <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
//           <tr>
//             <th className="text-left py-3">Title</th>
//             <th className="text-left py-3">Category</th>
//             <th className="text-left py-3">Status</th>
//             <th className="text-left py-3">Tags</th>
//             <th className="text-left py-3">Last Updated</th>
//             <th className="text-left py-3">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {filteredBlogs.map((b) => (
//             <tr
//               key={b.id}
//               className="font-inter font-medium text-[12px] text-[#747474]"
//             >
//               <td className="py-3">{b.title}</td>
//               <td>
//   {b.blog_categories
//     ?.map((c: any) =>
//       c.mstr_categories?.name?.replaceAll("_", " ")
//     )
//     .join(", ")}
// </td>
              

//               <td>
//                 <span
//                   className={`flex items-center gap-1`}
//                 >
//                  {/* {b.status} */}
//                  PUBLISHED
//                 </span> 
//               </td>
//               <td>{b.type}</td>

//               <td>{b.updatedAt}</td>

//               {/* ACTION */}
//               <td className="relative">
//                 <button
//                   onClick={() =>
//                     setOpenId(openId === b.id ? null : b.id)
//                   }
//                 >
//                   <MoreVertical size={16} className="cursor-pointer" />
//                 </button>

//                 <AnimatePresence>
//                   {openId === b.id && (
//                     <motion.div
//                     ref={dropdownRef}
//                       initial={{ opacity: 0, y: -5 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -5 }}
//                       className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg p-2 z-50"
//                     >
//                       {["View", "Delete" ].map((action) => (
//                         <button
//                           key={action}
//                           onClick={() => {
                            
//                               if (action === "View") {
//                                 router.push(`/library/content/${b.uuid}`);
//                               }
//                               if (action === "Delete") {
//   deleteBlog(String(b.id)); 
// }
//                             }}
//                           className={`w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded ${action==="Delete"? "text-red-600":"text-[#4b4949]"}`}
//                         >
//                           {action}
//                         </button>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>

//   {/* Footer */}
//   <div className="flex justify-between text-xs text-gray-400 mt-4">
//     <span>Showing 3 of 12.8k members</span>
//     <div className="flex gap-3 text-purple-500">
//       <button>Previous</button>
//       <button>Next</button>
//     </div>
//   </div>
// </div>

<div className="w-full bg-white rounded-xl p-4">
  <h2 className="font-inter font-medium text-[14px] text-black mb-3">
    List Of All Content
  </h2>

  {/* ✅ X-axis scroll wrapper */}
  <div className="w-full overflow-x-auto">
    
    {/* ✅ Y-axis scroll container */}
    <div className="max-h-120 min-h-115 overflow-y-auto scrollbar-hide">

      {/* 🔥 FIX: table-fixed added */}
      <table className="w-full table-fixed min-w-200">
        
        {/* ✅ Sticky Header */}
        <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
          <tr>
            <th className="text-left py-3 px-5">Title</th>
            <th className="text-left py-3 px-5">Category</th>
            <th className="text-left py-3 px-5">Status</th>
            <th className="text-left py-3 px-5">Tags</th>
            <th className="text-left py-3 px-5">Last Updated</th>
            <th className="text-left py-3 px-5">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredBlogs.map((b) => (
            <tr
              key={b.id}
              className="font-inter font-medium text-[12px] text-[#747474] px-5"
            >
              <td className="py-3 truncate px-5">{b.title}</td>

              <td className="truncate px-5">
                {b.blog_categories
                  ?.map((c: any) =>
                    c.mstr_categories?.name?.replaceAll("_", " ")
                  )
                  .join(", ")}
              </td>

              <td className="truncate px-5">
                <span>PUBLISHED</span>
              </td>

              <td className="truncate px-5">{b.type}</td>

              <td className="truncate px-5">{b.updatedAt}</td>

              {/* ACTION */}
              <td className="relative overflow-visible px-5">
  <button
    onClick={() =>
      setOpenId(openId === b.id ? null : b.id)
    }
  >
    <MoreVertical size={16} className="cursor-pointer" />
  </button>

  <AnimatePresence>
    {openId === b.id && (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        className="absolute right-0 top-full mt-2 w-32 bg-white shadow-lg rounded-lg p-2 z-50"
      >
        {["View", "Delete"].map((action) => (
          <button
            key={action}
            onClick={() => {
              if (action === "View") {
                router.push(`/library/content/${b.uuid}`);
              }
              if (action === "Delete") {
                deleteBlog(String(b.id));
              }
              setOpenId(null);
            }}
            className={`w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded ${
              action === "Delete"
                ? "text-red-600"
                : "text-[#4b4949]"
            }`}
          >
            {action}
          </button>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Footer */}
  <div className="flex justify-between text-xs text-gray-400 mt-4">
    <span>Showing 3 of 12.8k members</span>
    <div className="flex gap-3 text-purple-500">
      <button>Previous</button>
      <button>Next</button>
    </div>
  </div>
</div>
}
</>
  );
}
