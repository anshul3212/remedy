"use client";

import Image from "next/image";

import {
  Dot,
  Heart,
  ImageIcon,
  MessageSquare,
  TriangleAlert,
  User2,
  UserCircle2,
  X,
} from "lucide-react";

import { redirect, useParams, useRouter, useSearchParams } from "next/navigation";

import axios from "axios";

import { useEffect, useState } from "react";

import { usePost } from "@/context/getAllPostContext";
import toast, { Toaster } from "react-hot-toast";
import { formatNumber } from "@/helper/convertNumber";
import Loader from "@/components/ui/loaders/loader";

const Page = () => {
  const router = useRouter();

  const { id } = useParams();

  const searchParams = useSearchParams();

  const mediaId = searchParams.get("mediaId");

  const [post, setPost] = useState<any>(null);
  const [showPostReports, setShowPostReports] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMediaId,setSelectedMediaId] = useState<number|null>(null)
    const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [visible, setVisible] = useState(false);

  const [selectedReport, setSelectedReport] = useState<any>(null);

  const { fetchPosts } = usePost();

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("admin-token="))
          ?.split("=")[1];
        if (!token) return;
        const res = await axios.get(`/api/getPostByID/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",
          },
        });

        setPost(res.data.post);
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error.message ||
          "Something went wrong";
        toast.error(message);
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
      <Loader/>
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

  const deletePost = async (postId: string) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin-token="))
      ?.split("=")[1];
    if (!token) return;

    try {
      setDeleteLoading(true)
                const res =await axios.post(
                  `${process.env.NEXT_PUBLIC_DEV_URL}/admin/community/remove-post`,
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
console.log(res.data)
                toast.success("Post deleted");
                setOpenModal(false);

                await fetchPosts();

                router.back();
              } catch (error: any) {
                const message =
                  error?.response?.data?.message ||
                  error?.response?.data?.error ||
                  error.message ||
                  "Something went wrong";
                toast.error(message);
              }finally{
                setDeleteLoading(false);
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
              <div className="flex items-center justify-between">
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
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#e9e8e8bd]">
                      <User2 size={30} color="#727272" />
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
                {post._count.post_reports > 0 && (
                  <button
                    onClick={() => setShowPostReports(post)}
                    className="bg-[#ffa600f3] px-4 py-2 rounded-md flex items-center gap-2"
                  >
                    <TriangleAlert color="#ffffff" size={18} />
                    <span className="font-inter text-sm font-medium text-[#ffffff]">
                      Post Reports {formatNumber(post._count.post_reports)}
                    </span>
                  </button>
                )}
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
                    unoptimized
                    className="object-contain absolute"
                  />
                </div>
              ) : (
                <div className="w-full  border border-[#d1d1d1] bg-[#e9e8e8bd] h-50 rounded-md flex items-center justify-center">
                  <ImageIcon size={50} color="#b6b3b3" />
                </div>
              )}

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 cursor-pointer">
                  <Heart size={18} color="#7d7d7d" />

                  <span className="text-sm font-inter font-bold text-[#7d7d7d]">
                    {formatNumber(post?.total_likes)}
                  </span>
                </div>

                <div className="flex items-center gap-2 cursor-pointer">
                  <MessageSquare
                    size={18}
                    color="#7d7d7d"
                    onClick={() => setVisible(!visible)}
                  />

                  <span className="text-sm font-inter font-bold text-[#7d7d7d]">
                    {formatNumber(post?.total_comments)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {showPostReports && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-999 flex items-center justify-center">
              <div className="relative z-10 w-[90%] max-w-md max-h-[70vh] overflow-y-auto scrollbar-hide bg-white rounded-xl shadow-xl flex flex-col gap-2">
                {/* HEADER */}
                <div className="flex items-center justify-between sticky top-0 bg-white z-10  px-4 py-4">
                  <p className="text-lg font-semibold text-black font-inter">
                    Post Reports ({showPostReports._count.post_reports})
                  </p>

                  <button
                    onClick={() => setShowPostReports(null)}
                    className="text-sm text-red-500 cursor-pointer font-inter"
                  >
                    Close
                  </button>
                </div>

                {/* REPORT LIST */}
                <div className="flex flex-col gap-3 px-4 pb-2">
                  {showPostReports.post_reports.map(
                    (report: any, idx: number) => (
                      <div
                        key={idx}
                        className="border border-red-100 rounded-md p-3 flex items-start gap-3 bg-red-50"
                      >
                        {/* PROFILE IMAGE */}
                        {report.users.users_profile.profile_image ? (
                          <div className="w-12 h-12 rounded-full relative overflow-hidden shrink-0">
                            <Image
                              src={report.users.users_profile.profile_image}
                              alt="reporter"
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-[#e9e8e8bd]">
                            <User2 size={24} color="#7d7d7d" />
                          </div>
                        )}

                        {/* REPORT INFO */}
                        <div className="flex flex-col gap-1 flex-1">
                          <span className="text-sm font-medium text-black font-inter">
                            @{report.users.users_profile?.user_name}
                          </span>

                          <span className="text-xs text-red-500 font-medium font-inter">
                            {report.reason}
                          </span>

                          <span className="text-[11px] text-[#888] font-inter ">
                            {formattedDate(report.created_at)}
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

        <div className="w-[35%]  flex flex-col gap-6 min-h-0">
          <div className="w-full rounded-md shadow-[0px_0px_2.51px_0px_#00000040] p-4 flex flex-col gap-4">
            <p className="font-inter text-lg font-medium text-[#111111]">
              Actions
            </p>

            <div className="flex flex-col gap-4 justify-between">
              <div className="flex flex-col gap-4 justify-between font-inter text-sm font-medium text-[#7d7d7d]">
                <button
                  className="w-full bg-red-500 text-white py-4 rounded-md cursor-pointer"
                  onClick={() => setOpenModal(true)}
                >
                  Delete Post
                </button>
              </div>
            </div>
          </div>
          <div
            className={`w-full h-[70%] min-h-0 rounded-md shadow-[0px_0px_2.51px_0px_#00000040] p-4 relative overflow-hidden ${
              visible && comments.length > 0 ? "flex flex-col gap-4" : "hidden"
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
                    {c.users.users_profile.profile_image ? (
                      <div className="w-14 h-14 rounded-full relative overflow-hidden shrink-0">
                        <Image
                          src={c.users.users_profile.profile_image}
                          alt="user profile"
                          fill
                          unoptimized
                          className="absolute object-cover rounded-full"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14  rounded-full flex items-center justify-center shrink-0 bg-[#e9e8e8bd]">
                        <User2 size={30} color="#7d7d7d" />
                      </div>
                    )}

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
                  className="absolute z-10 w-[90%] max-w-md max-h-[70vh] overflow-y-auto scrollbar-hide bg-white rounded-xl shadow-xl flex flex-col gap-2 "
                  onClick={() => setSelectedReport(null)}
                />

                {/* POPUP CARD */}
                <div className="relative z-10 w-[90%] max-w-md max-h-[70vh] overflow-y-auto scrollbar-hide bg-white rounded-xl shadow-xl flex flex-col gap-2">
                  <div className="flex items-center justify-between sticky top-0 bg-white z-10  px-4 py-4">
                    <p className="text-lg font-semibold text-black font-inter">
                      Report Details
                    </p>

                    <button
                      onClick={() => setSelectedReport(null)}
                      className="text-sm text-red-500 font-inter cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                  {/* REPORT LIST */}
                  <div className="flex flex-col gap-3 px-4 pb-2">
                    {selectedReport.comment_reports.map(
                      (r: any, idx: number) => (
                        <div
                          key={idx}
                          className="border border-red-100 rounded-md p-3 flex items-start gap-3 bg-red-50"
                        >
                          {/* REPORTER IMAGE */}
                          {r.users.users_profile.profile_image ? (
                            <div className="w-12 h-12 rounded-full relative overflow-hidden shrink-0">
                              <Image
                                src={r.users.users_profile.profile_image}
                                alt="reporter"
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 bg-[#e9e8e8bd]">
                              <User2 size={30} color="#7d7d7d" />
                            </div>
                          )}

                          {/* REPORT INFO */}
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-black font-inter">
                              {`${r.users?.users_profile?.first_name} ${r.users?.users_profile?.last_name}`}
                            </span>

                            <span className="text-xs text-red-500 font-medium font-inter">
                              {r.reason}
                            </span>

                            <span className="text-[11px] text-[#888] font-inter">
                              {formattedDate(r.created_at)}
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

      {openModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="shadow-md bg-[white] border border-[#787878] rounded-2xl w-155.75 p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[18px] font-normal text-[black] font-inter">
                     Please Specify Deleting Reason
                    </h2>
                    <X
                      color="black"
                      size={23}
                      onClick={() => {
                        setOpenModal(false);
                        setName("");
                      }}
                      className="cursor-pointer"
                    />
                  </div>
      
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Reason"
                    className="w-full border border-[#7d7d7d] p-2 rounded-md text-sm outline-none h-12"
                  />
      
                  <div className="flex justify-end gap-2">
                    {/* Cancel Button */}
                    <button
                      onClick={() => {
                        setOpenModal(false);
                        setName("");
                      }}
                      className="px-4 py-2 text-sm border border-[#7d7d7d] rounded-sm font-inter text-[12px] font-medium text-[#242323] min-w-35.75"
                    >
                      Cancel
                    </button>
      
                    {/* Add Button */}
                    <button
                      disabled={!name.trim()}
                      onClick={() => {
                        deletePost(post.id)
                      }}
                      className={`px-4 py-2 text-sm rounded-sm font-inter text-[12px] font-medium text-[white] bg-red-500 cursor-pointer min-w-35.75 ${!name.trim() || loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                    >
                      {!deleteLoading ? "Delete" : "Deleting"}
                    </button>
                  </div>
                </div>
              </div>
            )}
    </div>
  );
};

export default Page;
