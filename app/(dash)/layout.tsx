"use client";

import "../globals.css";
import SideBar from "@/components/dashComponents/sideBar";
import DashTop from "@/components/common/nav";
import { UserProvider } from "@/context/userContext";
import { BlogProvider } from "@/context/blogContext";
import { ChannelProvider } from "@/context/channelContext";
import { ReportedContentProvider } from "@/context/reportedContentContext";
import { PostProvider } from "@/context/getAllPostContext";
import { HelpSupportProvider } from "@/context/helpSupportContext";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <HelpSupportProvider>
      <PostProvider>
        <ReportedContentProvider>
          <ChannelProvider>
            <BlogProvider>
              <UserProvider>
                <div className="flex w-screen h-screen text-black">
                  <div className="flex w-screen h-screen text-black">
                    <div className="min-w-70">
                      <SideBar />
                    </div>

                    <div className="flex-1 flex flex-col overflow-hidden ">
                      <DashTop />
                      <div className="bg-[#f7f7fe] h-full w-full">
                        {children}
                      </div>
                    </div>
                  </div>
                  <Toaster />
                </div>
              </UserProvider>
            </BlogProvider>
          </ChannelProvider>
        </ReportedContentProvider>
      </PostProvider>
    </HelpSupportProvider>
  );
}
