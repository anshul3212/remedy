"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X } from "lucide-react";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatNumber } from "@/helper/convertNumber";





export default function UserTable() {
  const router = useRouter();
  const [openId, setOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const {
    users,
    totalUsers,
loading,
    page,
    setPage,
    totalPages,
    limit,
  } = useUser();
 const [selectedUser, setSelectedUser] = useState<any>(null);
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

/* ================= PAGINATION ================= */

  const startItem =
    (page - 1) * limit + 1;

  const endItem = Math.min(
    page * limit,
    totalUsers
  );

return (

  <>

  
  {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      ) : (
   <div className="w-full h-[75%] rounded-xl p-4 bg-[#ffffff]">
    <h2 className="font-inter font-medium text-[14px] text-black mb-3">
      List Of All Users
    </h2>

    {/* ✅ X-axis scroll wrapper */}
    <div className="w-full h-full  overflow-x-auto ">
      {/* ✅ Y-axis scroll container */}
      <div className="h-[90%] overflow-y-auto scrollbar-hide ">
        <table className="min-w-200 w-full">
          {/* ✅ Sticky Header */}
          <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
            <tr>
              <th className="text-left py-3">S. No.</th>
              <th className="text-left py-3">Name</th>
              <th className="text-left py-3">Email</th>
              {/* <th className="text-left py-3">Condition</th>
              <th className="text-left py-3">Status</th> */}
              <th className="text-left py-3">Joined date</th>
              <th className="text-left py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user,idx) => (
              <tr
                key={idx}
                className="font-inter font-medium text-[12px] text-[#747474]"
              >
                <td>
                    {(page - 1) * limit + idx + 1}
                  </td>

                <td className="py-3">{user.name}</td>
                <td>{user.email}</td>
                <td>{user.joined}</td>

                {/* ACTION */}
                <td>
                  <Eye size={14} color="#747474" className="cursor-pointer" 
                  // onClick={()=>router.push(`/users/${user.uuid}`)}
                  onClick={() => setSelectedUser(user)}
                  />
                </td>

              </tr>
            ))}
          </tbody>
          
        </table>
        
      </div>
      
          {/* ================= PAGINATION ================= */}

        <div className="flex items-center justify-between w-full bg-[#F8F8F8] py-2">

          <p className="flex text-sm font-inter font-normal text-[#161616cb]">
            Showing {formatNumber(startItem)} to {formatNumber(endItem)} out of{" "}
            {formatNumber(totalUsers)}
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
   
     

     <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl shadow-xl w-87.5 p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                className="absolute top-4 right-4"
                onClick={() => setSelectedUser(null)}
              >
                <X size={18}  className="cursor-pointer"/>
              </button>

              {/* Profile Image */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border">
                  <Image
                    src={
                      selectedUser?.profile_image ||
                      "/logo.png"
                    }
                    alt="profile"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                {/* User Info */}
                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-xl font-semibold text-black">
                    {selectedUser?.name}
                
                  </h2>

                  <p className="text-sm text-gray-500">
                    {selectedUser?.email}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      


  </div>
      )}
 </>
);
}
