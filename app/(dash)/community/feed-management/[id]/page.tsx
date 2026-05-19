

"use client";

import Image from "next/image";

import {
  Dot,
  Heart,
  ImageIcon,
  MessageSquare,
  UserCircle2,
} from "lucide-react";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import axios from "axios";

import { useEffect, useState } from "react";

import { usePost } from "@/context/getAllPostContext";

const Page = () => {
  const router = useRouter();

  const { id } = useParams();

  const searchParams = useSearchParams();

  const mediaId = searchParams.get("mediaId");

  const [post, setPost] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  const [selectedReport, setSelectedReport] = useState<any>(null);

  const { fetchPosts } = usePost();

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/getPostByID/${id}`);

        setPost(res.data.post);
      } catch (error: any) {
        console.log(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const selectedMedia = post?.post_media?.find(
    (media: any) => media.id === mediaId,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center w-[80%] h-[80%]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-gray-500">Post not found</p>
      </div>
    );
  }

  const comments = post.comments;

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
      await axios.post(
        `${process.env.NEXT_PUBLIC_DEV_URL}/community/remove-post`,
        {
          post_id: postId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      alert("post deleted");

      fetchPosts();

      router.back();
    } catch (error: any) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <h1 className="font-inter font-medium text-[20px] text-[#000000]">
        Post Detail
      </h1>

      <div className="flex justify-between min-h-0">
        <div className="w-[60%]  flex flex-col gap-4">
          <div className="w-full rounded-md shadow-[0px_0px_2.51px_0px_#00000040] p-4">
            <div className="flex flex-col gap-8">
              <div className="flex gap-4">
                {post?.users?.users_profile?.profile_image ? (
                  <div className="flex w-14 h-14 overflow-hidden relative rounded-full">
                    <Image
                      src={post?.users?.users_profile?.profile_image}
                      alt="profile"
                      fill
                      className="object-cover absolute"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#b8b5b5]">
                    <UserCircle2 size={30} color="#727272" />
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="font-inter text-lg font-medium text-[#111111]">
                    {`${post?.users?.users_profile?.first_name}${" "}${post?.users?.users_profile?.last_name}`}
                  </span>

                  <div className="flex items-center font-inter text-sm font-medium text-[#7d7d7d]">
                    <span>@{post?.users?.users_profile?.user_name}</span>

                    <Dot size={16} color="#000" />

                    <span>{post?.channels?.name}</span>
                  </div>

                  <span className="flex items-center font-inter text-xs font-medium text-[#7d7d7d]">
                    {formattedDate(post?.created_at)}
                  </span>
                </div>
              </div>

              <p className="font-inter text-sm font-medium text-[#7d7d7d] text-justify">
                {post?.description}
              </p>

              {post?.post_media && post.post_media.length > 0 ? (
                <div className="w-full  h-50 rounded-md relative">
                  <Image
                    src={
                      selectedMedia?.media_url || post.post_media[0]?.media_url
                    }
                    alt="post"
                    fill
                    className="object-contain absolute"
                  />
                </div>
              ) : (
                <div className="w-full bg-[#b8b5b5] border border-[#d1d1d1] h-50 rounded-md flex items-center justify-center">
                  <ImageIcon size={50} color="#727272" />
                </div>
              )}

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 cursor-pointer">
                  <Heart size={18} color="#7d7d7d" />

                  <span className="text-sm font-inter font-bold text-[#7d7d7d]">
                    {post?.total_likes}
                  </span>
                </div>

                <div className="flex items-center gap-2 cursor-pointer">
                  <MessageSquare
                    size={18}
                    color="#7d7d7d"
                    onClick={() => setVisible(!visible)}
                  />

                  <span className="text-sm font-inter font-bold text-[#7d7d7d]">
                    {post?.total_comments}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {post._count.post_reports > 0 && (
            <div className="w-full rounded-md shadow-[0px_0px_2.51px_0px_#00000040] flex flex-col gap-4 max-h-50 overflow-y-auto">
              <p className="font-inter text-lg font-medium text-[#111111] sticky top-0 z-10 bg-[#f7f7fe] p-4 ">
                Post Reports {`${post?._count.post_reports}`}
              </p>

              <div className="px-4 pb-4 flex flex-col gap-4">
                {post?.post_reports.map((data: any, idx: number) => (
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
                                Reported by @
                                {data.users.users_profile?.user_name}
                              </span>

                              <div className="w-1 h-1 bg-black rounded-full" />

                              <span className="font-inter font-semibold text-[11px] text-[#838383]">
                                {formattedDate(data.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-[35%]  flex flex-col gap-6 min-h-0">
          <div className="w-full rounded-md shadow-[0px_0px_2.51px_0px_#00000040] p-4 flex flex-col gap-4">
            <p className="font-inter text-lg font-medium text-[#111111]">
              Actions
            </p>

            <div className="flex flex-col gap-4 justify-between">
              <div className="flex flex-col gap-4 justify-between font-inter text-sm font-medium text-[#7d7d7d]">
                <button
                  className="w-full bg-red-500 text-white py-4 rounded-md cursor-pointer"
                  onClick={() => deletePost(post.id)}
                >
                  Delete Post
                </button>
              </div>
            </div>
          </div>
          <div
  className={`w-full h-[70%] min-h-0 rounded-md shadow-[0px_0px_2.51px_0px_#00000040] p-4 relative overflow-hidden ${
    visible && comments.length > 0
      ? "flex flex-col gap-4"
      : "hidden"
  }`}
>
            <p className="font-inter shrink-0 text-lg font-medium sticky top-0 text-[#111111] z-10">
              Comments
            </p>

            <div className="flex flex-col w-full gap-2  flex-1 min-h-0 overflow-y-auto scrollbar-hide">
              
              {comments.map((c: any, idx: number) => {
                const isReported = c.comment_reports?.length > 0;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (isReported) {
                        setSelectedReport(c);
                      }
                    }}
                    className={`flex items-start gap-2 p-2 rounded-md transition-all
        ${
          isReported
            ? "bg-red-50 border border-red-200 cursor-pointer hover:bg-[#f3e2e2]"
            : "bg-[#f5f4f4ab] border border-[#b9b8b863] cursor-pointer hover:bg-[#c4c2c248]"
        }`}
                  >
                    {/* PROFILE */}
                    <div className="w-14 h-14 rounded-full relative overflow-hidden shrink-0">
                      <Image
                        src={
                          c.users.users_profile.profile_image
                            ? c.users.users_profile.profile_image
                            : "/logo.png"
                        }
                        alt="user profile"
                        fill
                        className="absolute object-cover rounded-full"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-col gap-1">
                      <span className="text-black font-inter font-medium text-sm">
                        {`${c.users.users_profile.first_name} ${c.users.users_profile.last_name}`}
                      </span>
                      <span className="text-[#7d7d7d] font-inter font-bold text-[10px]">
                        {formattedDate(c?.updated_at)}
                      </span>

                      <span className="text-[#747474] font-inter font-normal text-xs">
                        {c.comment}
                      </span>

                      {isReported && (
                        <span className="text-red-500 text-[11px] font-medium">
                          Reported Comment
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedReport && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                {/* OVERLAY CLOSE */}
                <div
                  className="absolute inset-0"
                  onClick={() => setSelectedReport(null)}
                />

                {/* POPUP CARD */}
                <div className="relative z-10 w-[90%] max-w-md max-h-[70vh] overflow-y-auto scrollbar-hide bg-white rounded-xl shadow-xl p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-black">
                      Report Details
                    </p>

                    <button
                      onClick={() => setSelectedReport(null)}
                      className="text-sm text-red-500 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                  {/* COMMENT INFO */}
                  <div className="bg-[#f8f8f8] rounded-md p-3 flex flex-col gap-2">
                    <span className="font-medium text-sm text-black">
                      {`${selectedReport.users.users_profile.first_name} ${selectedReport.users.users_profile.last_name}`}
                    </span>

                    <span className="text-xs text-[#666]">
                      {selectedReport.comment}
                    </span>
                  </div>

                  {/* REPORT LIST */}
                  <div className="flex flex-col gap-3">
                    {selectedReport.comment_reports.map(
                      (r: any, idx: number) => (
                        <div
                          key={idx}
                          className="border border-red-100 rounded-md p-3 flex items-start gap-3 bg-red-50"
                        >
                          {/* REPORTER IMAGE */}
                          <div className="w-12 h-12 rounded-full relative overflow-hidden shrink-0">
                            <Image
                              src={
                                r.users?.users_profile?.profile_image
                                  ? r.users.users_profile.profile_image
                                  : "/logo.png"
                              }
                              alt="reporter"
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* REPORT INFO */}
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-black">
                              {`${r.users?.users_profile?.first_name} ${r.users?.users_profile?.last_name}`}
                            </span>

                            <span className="text-xs text-red-500 font-medium">
                              {r.reason}
                            </span>

                            <span className="text-[11px] text-[#888]">
                              {new Date(r.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
