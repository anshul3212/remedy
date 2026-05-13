"use client";

import "../globals.css";
import SideBar from "@/components/dashComponents/sideBar";
import DashTop from "@/components/common/nav";
import { useState } from "react";
import { UserProvider } from "@/context/userContext";
import { BlogProvider } from "@/context/blogContext";
import { ChannelProvider } from "@/context/channelContext";
import { ReportedContentProvider } from "@/context/reportedContentContext";
import { PostProvider } from "@/context/getAllPostContext";


export default function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <PostProvider>
<ReportedContentProvider>
<ChannelProvider>
  
    <BlogProvider>
<UserProvider>
    <div className="flex w-screen h-screen">
  <div
    className={`transition-all duration-300 w-[20%]`}
  >
    <SideBar
      openSidebar={openSidebar}
      setOpenSidebar={setOpenSidebar}
    
    />
  </div>

  <div className="flex-1 text-black">
    <DashTop
      setOpenSidebar={setOpenSidebar}
    />
    {children}
  </div>
</div>
</UserProvider>
</BlogProvider>

</ChannelProvider>
</ReportedContentProvider>
</PostProvider>
  );
}