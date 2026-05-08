"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, BellIcon, ChevronDown, Globe, Mail, MoonIcon, Search, SettingsIcon, TextAlignJustify } from "lucide-react";
// import Topmenu from "./topMenu";
// import axios from "axios";

const notifications = [
  {
    id: 1,
    text: "New Appointment",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.0833 2.33337H2.91667C2.27233 2.33337 1.75 2.85571 1.75 3.50004V11.6667C1.75 12.311 2.27233 12.8334 2.91667 12.8334H11.0833C11.7277 12.8334 12.25 12.311 12.25 11.6667V3.50004C12.25 2.85571 11.7277 2.33337 11.0833 2.33337Z"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.33337 1.16663V3.49996"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.66663 1.16663V3.49996"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.75 5.83337H12.25"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),

    bgColor: "bg-[#3381F8]",
    message: "You have a new appointment booking.",
    time: "2m",
  },
  {
    id: 2,
    text: "New Appointment",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.0833 2.33337H2.91667C2.27233 2.33337 1.75 2.85571 1.75 3.50004V11.6667C1.75 12.311 2.27233 12.8334 2.91667 12.8334H11.0833C11.7277 12.8334 12.25 12.311 12.25 11.6667V3.50004C12.25 2.85571 11.7277 2.33337 11.0833 2.33337Z"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.33337 1.16663V3.49996"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.66663 1.16663V3.49996"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.75 5.83337H12.25"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),

    bgColor: "bg-[#3381F8]",
    message: "You have a new appointment booking.",
    time: "4h",
  },
  {
    id: 3,
    text: "New Appointment",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.0833 2.33337H2.91667C2.27233 2.33337 1.75 2.85571 1.75 3.50004V11.6667C1.75 12.311 2.27233 12.8334 2.91667 12.8334H11.0833C11.7277 12.8334 12.25 12.311 12.25 11.6667V3.50004C12.25 2.85571 11.7277 2.33337 11.0833 2.33337Z"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.33337 1.16663V3.49996"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.66663 1.16663V3.49996"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.75 5.83337H12.25"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),

    bgColor: "bg-[#3381F8]",
    message: "You have a new appointment booking.",
    time: "5h",
  },

  {
    id: 4,
    text: "Account Verified",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.6667 3.5L5.25004 9.91667L2.33337 7"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),

    bgColor: "bg-[#19BF16]",
    message: "Your account has been successfully verified.",
    time: "23h",
  },

  {
    id: 5,
    text: "New Appointment",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.0833 2.33337H2.91667C2.27233 2.33337 1.75 2.85571 1.75 3.50004V11.6667C1.75 12.311 2.27233 12.8334 2.91667 12.8334H11.0833C11.7277 12.8334 12.25 12.311 12.25 11.6667V3.50004C12.25 2.85571 11.7277 2.33337 11.0833 2.33337Z"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.33337 1.16663V3.49996"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.66663 1.16663V3.49996"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.75 5.83337H12.25"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),

    bgColor: "bg-[#3381F8]",
    message: "You have a new appointment booking.",
    time: "23h",
  },

  {
    id: 6,
    text: "New Appointment",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.0833 2.33337H2.91667C2.27233 2.33337 1.75 2.85571 1.75 3.50004V11.6667C1.75 12.311 2.27233 12.8334 2.91667 12.8334H11.0833C11.7277 12.8334 12.25 12.311 12.25 11.6667V3.50004C12.25 2.85571 11.7277 2.33337 11.0833 2.33337Z"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.33337 1.16663V3.49996"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.66663 1.16663V3.49996"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.75 5.83337H12.25"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),

    bgColor: "bg-[#3381F8]",
    message: "You have a new appointment booking.",
    time: "23h",
  },

  {
    id: 7,
    text: "New Appointment",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.0833 2.33337H2.91667C2.27233 2.33337 1.75 2.85571 1.75 3.50004V11.6667C1.75 12.311 2.27233 12.8334 2.91667 12.8334H11.0833C11.7277 12.8334 12.25 12.311 12.25 11.6667V3.50004C12.25 2.85571 11.7277 2.33337 11.0833 2.33337Z"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.33337 1.16663V3.49996"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.66663 1.16663V3.49996"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.75 5.83337H12.25"
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),

    bgColor: "bg-[#3381F8]",
    message: "You have a new appointment booking.",
    time: "23h",
  },
];

const DashTop = ({
  setOpenSidebar,
  collapsed,
  setCollapsed,
}: {
  setOpenSidebar: any;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [name, setName] = useState("");

  const router = useRouter();
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

  //   useEffect(() => {
  //   async function fetchUser() {
  //     try {
  //       const res = await axios.get("/api/user", { withCredentials: true });
  //       setName(res.data.user.name);
  //     } catch (error) {
  //       alert("please login")
  //       router.push("/login")
  //       console.log("Not logged in ", error);
  //       setName("");
  //     }
  //   }

  //   fetchUser();
  // }, []);

  const handleLogout = async () => {
    alert("logout"); 
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
    <div className="bg-[#fbfaff] h-24 border-[#eee7e7] border-b flex items-center justify-between  w-full relative">
      <div className="flex items-center gap-4 ml-4">
        <div
          onClick={() => setCollapsed(!collapsed)}
          className={`cursor-pointer bg-[linear-gradient(280.07deg,#A34E25_0%,#734C82_65%,#522762_100%)] rounded-full p-2 hidden lg:block`}
        >
          <ArrowLeft color="#ffffff" size={14}/>
        </div>



        <div
          className={`cursor-pointer bg-[linear-gradient(280.07deg,#A34E25_0%,#734C82_65%,#522762_100%)] rounded-full p-2 lg:hidden`}
          onClick={() => setOpenSidebar(true)}
        >
          <ArrowLeft color="#ffffff" size={14}/>
        </div>

        <div className="bg-[#f6f6f9] flex items-center px-2 rounded-sm border border-[#30384F29] ">
          
            <Search color="#ADB5BD" className="cursor-pointer"/>
          <input
            type="text"
            placeholder="Search data or users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-6 text-[#000000bf] placeholder:text-[#ADB5BD]  font-inter font-normal text-sm  h-12 w-86 outline-none"
          />
          
        </div>
      </div>
      {/* <Topmenu /> */}

      <div className="hidden  lg:flex items-center justify-end gap-6 w-[60%] h-full relative">
        <div className="flex h-full items-center gap-6">
          {/* theme icon */}
          <MoonIcon fill="#000"/>
          {/* earth icon */}
          <Globe/>
          {/* Notification Icon */}
          <div
            ref={notifRef}
            className="relative cursor-pointer h-full"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <div
              className={`relative h-full flex items-center justify-center px-2  ${
                showNotifications ? "bg-[#f6f6f9]" : ""
              }`}
            >
              {/* Bell Icon */}

              <BellIcon />

              {/*  Badge */}
              <span className="absolute top-4 right-0 p-1 font-inter text-[#ffffff] flex items-center justify-center text-[10px] bg-[#F04438] rounded-full">3</span>
            </div>

            {/* Notification Drawer with Animation */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-[85.5px] mt-2 w-100 h-72 bg-[#ffffff] z-50 text-black overflow-y-auto scrollbar-hide"
                >
                  <div className="p-3 flex items-center justify-between ">
                    <span className=" font-medium text-[#000000] text-lg">
                      Notifications
                    </span>
                    <span className=" font-normal text-[#00000080] text-sm underline">
                      Unread (3)
                    </span>
                  </div>
                  <ul
                    className="max-h-full overflow-y-auto scrollbar-hide"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {notifications.map(
                      ({ id, text, icon, bgColor, message, time }) => (
                        <li
                          key={id}
                          className="flex items-start gap-3 px-3 py-2 hover:bg-[#e8e8eb] cursor-pointer transition justify-between"
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center ${bgColor}`}
                            >
                              <span>{icon}</span>
                            </div>

                            <div className="flex flex-col items-start justify-start gap-2">
                              <span className="text-sm font-medium text-[#000000] ">
                                {text}
                              </span>
                              <span className="text-xs font-normal text-[#000000bf] ">
                                {message}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <span className="text-xs font-normal text-[#000000bf] ">
                              {time}
                            </span>
                          </div>
                        </li>
                      ),
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* message icons */}
          <div className="relative cursor-pointer h-full flex items-center justify-center">

          <Mail />
          <span className="absolute top-4 -right-2 p-1 font-inter text-[#ffffff] flex items-center justify-center text-[10px] bg-[#F04438] rounded-full">333</span>
          </div>
        </div>

        <div className="relative h-full  w-[35%] " ref={menuRef} >
          <div
            className="border-l border-[#F0F1F3] flex items-center justify-between h-full px-4 w-full cursor-pointer "
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <div className="flex items-center gap-4 ">
              <div className="w-16 h-16 rounded-full overflow-hidden relative">
                <Image
                  src="/logo.png"
                  alt="profile"
                  fill
                  className="object-cover absolute"
                />
                
              </div>
              <span className="w-5 h-5 rounded-full bg-[#3DA172] bottom-4 left-15 border border-[#000000] absolute" />

              <div className="flex flex-col">
<span className="text-[#000000] font-inter  font-normal text-sm capitalize">
                Jay Hargudson
              </span>
              <span className="text-[#667085] font-inter  font-medium text-[12px] capitalize">
                Admin
              </span>
              </div>
              
            </div>

           <ChevronDown/>
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
                        d="M13.3334 14V12.6667C13.3334 11.9594 13.0525 11.2811 12.5524 10.781C12.0523 10.281 11.374 10 10.6667 10H5.33341C4.62617 10 3.94789 10.281 3.4478 10.781C2.9477 11.2811 2.66675 11.9594 2.66675 12.6667V14"
                        fill="black"
                        fillOpacity="0.2"
                      />
                      <path
                        d="M13.3334 14V12.6667C13.3334 11.9594 13.0525 11.2811 12.5524 10.781C12.0523 10.281 11.374 10 10.6667 10H5.33341C4.62617 10 3.94789 10.281 3.4478 10.781C2.9477 11.2811 2.66675 11.9594 2.66675 12.6667V14"
                        stroke="black"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.99992 7.33333C9.47268 7.33333 10.6666 6.13943 10.6666 4.66667C10.6666 3.19391 9.47268 2 7.99992 2C6.52716 2 5.33325 3.19391 5.33325 4.66667C5.33325 6.13943 6.52716 7.33333 7.99992 7.33333Z"
                        fill="black"
                        fillOpacity="0.2"
                        stroke="black"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <li
                      className="px-4 py-2  cursor-pointer transition"
                      onClick={() => alert("Go to Profile")}
                    >
                      Profile
                    </li>
                  </div>

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
    </div>
  );
};

export default DashTop;
