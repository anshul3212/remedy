"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, User2, X } from "lucide-react";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatNumber } from "@/helper/convertNumber";
import { TableLoader } from "./loaders/tableLoader";

export default function UserTable() {
  const router = useRouter();
  const [openId, setOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const {
    users,
    loading,
    page,
    setPage,
    totalPages,
    limit,
    fetchUsers,
    total,
  } = useUser();
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page]);

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

  const startItem = (page - 1) * limit + 1;

  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-4 overflow-y-auto max-h-160 bg-[#ffffff] rounded-xl p-4">
         <h2 className="font-inter font-medium text-[14px] text-black ">
         List Of All Users
       </h2>
      {/* Scrollable table */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
          <table className="w-full table-auto">
            {/* ✅ Sticky Header */}
            <thead className="sticky top-0 p-4 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
              <tr>
                <th className="text-left py-4 w-[8%] px-2">S. No.</th>
                <th className="text-left py-4 w-[22%] px-2">Name</th>
                <th className="text-left py-4 w-[40%] px-2">Email</th>
                <th className="text-left py-4 w-[18%] px-2">Joined date</th>
                <th className="text-left py-4 w-[12%] px-2">Actions</th>
              </tr>
            </thead>

            {loading ? (
              <TableLoader colSpan={5} />
            ) : (
              <tbody>
                {total === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-[#747474] text-sm"
                    >
                      Users not found
                    </td>
                  </tr>
                ) : (
                  users.map((user, idx) => (
                    <tr
                      key={idx}
                      className="font-inter font-medium text-[12px] text-[#747474]"
                    >
                      <td className="px-2 py-4 break-all">{(page - 1) * limit + idx + 1}</td>

                      <td className="px-2 py-4 break-all">{user.name}</td>
                      <td className="px-2 py-4 break-all">{user.email}</td>
                      <td className="px-2 py-4 break-all">{user.joined}</td>

                      {/* ACTION */}
                      <td className="px-2 py-4">
                        <Eye
                          size={14}
                          color="#747474"
                          className="cursor-pointer"
                          // onClick={()=>router.push(`/users/${user.uuid}`)}
                          onClick={() => setSelectedUser(user)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            )}
          </table>
      {/* </div> */}
      </div>

      {/* ================= PAGINATION ================= */}

      <div className="flex items-center justify-between w-full bg-[#F8F8F8] py-4 px-2">
        <p className="flex text-sm font-inter font-normal text-[#161616cb]">
          {total === 0
            ? `Showing 0 results`
            : `Showing ${formatNumber(startItem)} to ${formatNumber(endItem)} out
              of ${formatNumber(total)}`}
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
                <X size={18} className="cursor-pointer" />
              </button>

              {/* Profile Image */}
              <div className="flex flex-col items-center gap-4">
                {selectedUser.profile_image ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border border-[#ececec]">
                    <Image
                      src={selectedUser.profile_image}
                      alt="profile"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className=" w-24 h-24 rounded-full  border border-[#ececec] flex items-center justify-center">
                    <User2 size={30} color="#7d7d7d" />
                  </div>
                )}

                {/* User Info */}
                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-xl font-semibold text-black">
                    {selectedUser?.name}
                  </h2>

                  <p className="text-sm text-gray-500">{selectedUser?.email}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
