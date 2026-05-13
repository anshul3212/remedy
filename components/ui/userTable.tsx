"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, MoreVertical, X } from "lucide-react";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import Image from "next/image";





export default function UserTable() {
  const router = useRouter();
  const [openId, setOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { users } = useUser();
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



return (
  <div className="w-full bg-white rounded-xl p-4">
    <h2 className="font-inter font-medium text-[14px] text-black mb-3">
      List Of All Users
    </h2>

    {/* ✅ X-axis scroll wrapper */}
    <div className="w-full overflow-x-auto">
      {/* ✅ Y-axis scroll container */}
      <div className="max-h-92 min-h-92 overflow-y-auto scrollbar-hide">
        <table className="min-w-200 w-full">
          {/* ✅ Sticky Header */}
          <thead className="sticky top-0 bg-[#F8F8F8] z-10 font-inter font-medium text-[12px] text-[#747474]">
            <tr>
              <th className="text-left py-3">Name</th>
              <th className="text-left py-3">Email</th>
              {/* <th className="text-left py-3">Condition</th>
              <th className="text-left py-3">Status</th> */}
              <th className="text-left py-3">Joined date</th>
              <th className="text-left py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="font-inter font-medium text-[12px] text-[#747474]"
              >
                <td className="py-3">{user.name}</td>
                <td>{user.email}</td>
                {/* <td>{user.condition}</td> */}

                {/* <td>
                  <span
                    className={`flex items-center gap-1 ${
                      user.status === "active"
                        ? "text-[#34A853]"
                        : "text-[#B8B8B8]"
                    }`}
                  >
                    ● {user.status}
                  </span>
                </td> */}

                <td>{user.joined}</td>

                {/* ACTION */}
                {/* <td className="relative">
                  <button
                    onClick={() =>
                      setOpenId(openId === user.id ? null : user.id)
                    }
                  >
                    <MoreVertical size={16} className="cursor-pointer" />
                  </button>

                  <AnimatePresence>
                    {openId === user.id && (
                      <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg p-2 z-50"
                      >
                        {["View", "Delete", "Block"].map((action) => (
                          <button
                            key={action}
                            onClick={() => {
                              if (action === "View") {
                                router.push(`/users/${user.uuid}`);
                              }
                            }}
                            className="w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
                          >
                            {action}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td> */}
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
              className="bg-white rounded-2xl shadow-xl w-[350px] p-6 relative"
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
);
}
