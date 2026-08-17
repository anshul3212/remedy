"use client";

import "../globals.css";
import SideBar from "@/components/dashComponents/sideBar";
import DashTop from "@/components/common/nav";
import { useEffect, useState } from "react";
import { UserProvider } from "@/context/userContext";
import { BlogProvider } from "@/context/blogContext";
import { ChannelProvider } from "@/context/channelContext";
import { ReportedContentProvider } from "@/context/reportedContentContext";
import { PostProvider } from "@/context/getAllPostContext";
import { HelpSupportProvider } from "@/context/helpSupportContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [loading, setLoading] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminImage, setAdminImage] = useState("");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <HelpSupportProvider>
      <PostProvider>
        <ReportedContentProvider>
          <ChannelProvider>
            <BlogProvider>
              <UserProvider>
                <div className="flex w-screen h-screen text-black">
                      <div className="flex w-screen h-screen text-black">
                         <SideBar
                    />

                        <div className="flex-1 flex flex-col overflow-hidden ">
                          <DashTop
                      name={adminName}
                      image={adminImage}
                    />
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
