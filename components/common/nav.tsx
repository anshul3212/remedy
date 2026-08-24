"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  Search,
  User2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const DashTop = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminImage, setAdminImage] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin-token="))
      ?.split("=")[1];
    if (!token) return;
    const getAdmin = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/getAdmin`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setAdminName(res.data.admin.full_name);
        setAdminImage(res.data.admin.profile_image);
      } catch (error: any) {
        document.cookie =
          "admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    getAdmin();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  

  const handleLogout = async () => {
    try {

      /* ================= REMOVE COOKIE ================= */

      document.cookie =
        "admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";

      /* ================= REDIRECT ================= */
      toast.success("logout successfully");
      router.replace("/login");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Something went wrong";

      toast.error(message);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  return (
    <div className="bg-[#fbfaff] h-24 border-[#eee7e7] border-b flex items-center justify-between  w-full relative px-4">
      <div className="flex items-center gap-4 ">
        {/* <div
          className={`cursor-pointer bg-[linear-gradient(280.07deg,#A34E25_0%,#734C82_65%,#522762_100%)] rounded-full p-2 lg:hidden`}
          onClick={() => setOpenSidebar(true)}
        >
          <ArrowLeft color="#ffffff" size={14} />
        </div> */}

        {/* <div className="bg-[#f6f6f9] flex items-center px-2 rounded-sm border border-[#30384F29] ">
          <Search color="#ADB5BD" className="cursor-pointer" />
          <input
            type="text"
            placeholder="Search data or users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-6 text-[#000000bf] placeholder:text-[#ADB5BD]  font-inter font-normal text-sm  h-12 w-86 outline-none"
          />
        </div> */}
      </div>
   

        <div className="relative h-full " ref={menuRef}>
          <div
            className="border-l border-[#F0F1F3]  flex items-center gap-8 justify-between h-full px-4 w-full cursor-pointer "
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <div className="flex items-center gap-4 ">
              <div className="w-16 h-16 rounded-full overflow-hidden relative">
                {adminImage ? (
                  <Image
                    src={adminImage}
                    alt="profile"
                    fill
                    unoptimized
                    className="object-cover absolute"
                  />
                ) : (
                  <div className=" w-16 h-16 rounded-full  border border-[#ececec] flex items-center justify-center">
                    <User2 size={24} color="#7d7d7d" />
                  </div>
                )}
              </div>
              <span className="w-5 h-5 rounded-full bg-[#3DA172] bottom-4 left-15 border border-[#000000] absolute" />

              <div className="flex flex-col">
                <span className="text-[#000000] font-inter  font-normal text-sm capitalize">
                  {adminName}
                </span>
                <span className="text-[#667085] font-inter  font-medium text-[12px] capitalize">
                  Admin
                </span>
              </div>
            </div>

            <ChevronDown className="shrink-0" />
          </div>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-[85.5px] mt-2  bg-[#ffffff] w-[70%]  z-50"
              >
                <ul className="text-[#000000] text-sm  font-medium px-2">
                  <div className="flex items-center hover:bg-[#e8e8eb]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6"
                        fill="black"
                        fillOpacity="0.2"
                      />
                      <path
                        d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6"
                        stroke="black"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.6667 11.3333L14.0001 7.99996L10.6667 4.66663"
                        stroke="black"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 8H6"
                        stroke="black"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <li
                      className="px-4 py-2 cursor-pointer transition"
                      onClick={handleLogout}
                    >
                      Logout
                    </li>
                  </div>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

    </div>
  );
};

export default DashTop;
