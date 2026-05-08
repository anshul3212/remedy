"use client";

import "../globals.css";
import SideBar from "@/components/dashComponents/sideBar";
import DashTop from "@/components/common/nav";
import { useState } from "react";
import { UserProvider } from "@/context/userContext";
import { BlogProvider } from "@/context/blogContext";
import { ReportProvider } from "@/context/reportPostContext";
import { ChannelProvider } from "@/context/channelContext";


export default function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <ChannelProvider>
    <ReportProvider>
    <BlogProvider>
<UserProvider>
    <div className="flex w-screen h-screen">
  <div
    className={`transition-all duration-300 ${
      collapsed ? "lg:w-25" : "lg:w-90"
    }`}
  >
    <SideBar
      openSidebar={openSidebar}
      setOpenSidebar={setOpenSidebar}
      collapsed={collapsed}
      setCollapsed={setCollapsed}
    />
  </div>

  <div className="flex-1 text-black">
    <DashTop
    collapsed={collapsed}
      setCollapsed={setCollapsed}
      setOpenSidebar={setOpenSidebar}
    />
    {children}
  </div>
</div>
</UserProvider>
</BlogProvider>
</ReportProvider>
</ChannelProvider>
  );
}