"use client";

import Image from "next/image";
import { useUser } from "@/context/userContext";
import {
  Dot,
  Heart,
  ImageIcon,
  MessageSquare,
  UserCircle2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useReport } from "@/context/reportPostContext";
import axios from "axios";



const page = () => {
  const router = useRouter();
  const { id } = useParams();

  const {reportedPosts,loading,fetchReportedPosts} = useReport();


  const post = reportedPosts.find(
    (u) => u.id.trim().toLowerCase() === String(id).trim().toLowerCase(),
  );
  if(!post){
    console.log("post not found")
    return;
  }

 const formattedDate = (dateString?: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  return `${date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })} at ${date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
};

  const PostInfoData = [
  {
    topic: "Post ID",
    desc: `${post?.id}`,
  },
  {
    topic: "Type",
    desc: "Post",
  },
  {
    topic: "Status",
    desc: "Active",
  },
  {
    topic: "Reports",
    desc: `${post?._count.post_reports}`,
  },
  {
    topic: "Visibility",
    desc: "Public",
  },
];


const deletePost = async (postId: string) => {
  const token = localStorage.getItem("token");

  const confirmDelete = confirm("Are you sure you want to delete this post?");
  if (!confirmDelete) return;

  try {
    const res = await axios.post(
      "http://3.13.92.66/api/v1/admin/community/remove-post",
      {
        "post_id": postId, 
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res.data)
    alert("post deleted");
    fetchReportedPosts();
    router.push("/community/feed-management")

  } catch (error: any) {
    console.log(error.response?.data || error.message);
  }
};

  return (
    <>{loading?<div className="flex items-center justify-center h-[80%]">
  <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
</div>:
    <div className=" font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <h1 className="font-inter font-medium text-[20px] text-[#000000]">
        Post Detail
      </h1>
      <div className="flex  gap-16">
        <div className="w-[70%] flex flex-col gap-6">
          <div className="w-full rounded-md shadow-[0px_0px_2.51px_0px_#00000040] p-4">
            <div className="flex flex-col gap-8">
              <div className="flex gap-4">
                {
                    post?.users.users_profile?.profile_image ? <div className="flex w-14 h-14 overflow-hidden relative rounded-full">
                        <Image src={post?.users.users_profile?.profile_image} alt="profile" fill className="object-cover absolute" unoptimized
                        />

                    </div>:<div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#b8b5b5]">
                  <UserCircle2 size={30} color="#000" />
                </div>
                }
                
                <div className="flex flex-col">
                  <span className="font-inter text-lg font-medium text-[#111111]">
                    {`${post?.users.users_profile?.first_name}${" "}${post?.users.users_profile?.last_name}`}
                  </span>
                  <div className="flex items-center font-inter text-sm font-medium text-[#7d7d7d]">
                    <span>@{post?.users.users_profile?.user_name}</span>
                    <Dot size={16} color="#000" />
                    <span>{post?.channels?.name}</span>
                  </div>
                  <span className="flex items-center font-inter text-xs font-medium text-[#7d7d7d]">
                    {/* 18 Aug 2025 at 10:00 AM */}
                    {formattedDate(post?.created_at)}
                  </span>
                </div>
              </div>

              <p className="font-inter text-sm font-medium text-[#7d7d7d] text-justify">
                {post?.description}
              </p>

{post?.post_media && post.post_media.length > 0 ? (
  <div className="w-full bg-[#b8b5b5] border border-[#d1d1d1] h-50 rounded-md relative">
    <Image
      src={post.post_media[0]?.media_url}
      alt="post"
      fill
      className="object-cover absolute"
    />
  </div>
) : (
  <div className="w-full bg-[#b8b5b5] border border-[#d1d1d1] h-50 rounded-md flex items-center justify-center">
    <ImageIcon size={50} color="#000" />
  </div>
)}

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Heart size={18} color="#7d7d7d" />
                  <span className="text-sm font-inter font-bold text-[#7d7d7d]">
                    {post?.total_likes}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MessageSquare size={18} color="#7d7d7d" />
                  <span className="text-sm font-inter font-bold text-[#7d7d7d]">
                    {post?.total_comments}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full rounded-md shadow-[0px_0px_2.51px_0px_#00000040] flex flex-col gap-4 max-h-50 overflow-y-auto">
          
             <p className="font-inter text-lg font-medium text-[#111111] sticky top-0 z-10 bg-[#f7f7fe] p-4 ">
                Reports (2)
              </p>
              <div className="px-4 pb-4 flex flex-col gap-4">

             

              {
                post?.post_reports.map((data,idx)=>(
                  <div className="flex flex-col gap-4" key={idx}>
              <div className="flex flex-col gap-6 justify-between">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-full overflow-hidden relative">
                      <Image
                        src={"/logo.png"}
                        alt="profile"
                        fill
                        className="object-cover absolute"
                        unoptimized
                      />
                    </div>

                    <div className="flex flex-col">
                      <span className="font-inter font-semibold text-[11px] text-[#272424]">
                        {data.reason}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-inter font-semibold text-[11px] text-[#272424]">
                          Reported by @{data.users.users_profile?.user_name}
                        </span>

                        <div className="w-1 h-1 bg-black rounded-full" />
                        <span className="font-inter font-semibold text-[11px] text-[#838383]">
                          {formattedDate(data.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="w-[20%] bg-[#c9c7c7] text-[#686767] py-2 rounded-md flex items-center justify-center">
                    Pending
                  </span>
                </div>
              </div>
            </div>  
                ))
              }
                 </div>
            
          </div>
        </div> 

        <div className="w-[30%] flex flex-col gap-6">
          <div className="w-full rounded-md shadow-[0px_0px_2.51px_0px_#00000040] p-4 flex flex-col gap-4">
            <p className="font-inter text-lg font-medium text-[#111111]">
              Post Information
            </p>
            <div className="flex flex-col gap-6 justify-between">
              {PostInfoData.map((data, idx) => (
                <div
                  className="flex items-center justify-between font-inter text-sm font-medium text-[#7d7d7d]"
                  key={idx}
                >
                  <span>{data.topic}</span>
                  <span>{data.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full rounded-md shadow-[0px_0px_2.51px_0px_#00000040] p-4 flex flex-col gap-4">
            <p className="font-inter text-lg font-medium text-[#111111]">
              Actions
            </p>
            <div className="flex flex-col gap-6 justify-between">
              <div className="flex flex-col gap-4 justify-between font-inter text-sm font-medium text-[#7d7d7d]">
                <button className="w-full bg-red-500 text-white py-4 rounded-md cursor-pointer" onClick={()=>deletePost(post.id)}>
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    }</>
  );
};

export default page;