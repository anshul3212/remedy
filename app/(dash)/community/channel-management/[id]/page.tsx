"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Trash, User2, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "@/components/ui/loaders/loader";
import DeleteModal from "@/components/ui/deleteModal";

const Page = () => {
  const { id } = useParams();

  /* ================= STATE ================= */

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [channel, setChannel] = useState<any>(null);

  const [postsData, setPostsData] = useState<any[]>([]);

  const [openModal, setOpenModal] = useState(false);

  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);

  const [page, setPage] = useState(1);

  const [hasNextPage, setHasNextPage] = useState(true);

  const [columnCount, setColumnCount] = useState(4);

  /* ================= REFS ================= */

  const scrollRef = useRef<HTMLDivElement | null>(null);

  /* ================= GET TOKEN ================= */

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin-token="))
      ?.split("=")[1];
  };

  /* ================= RESPONSIVE COLUMNS ================= */

  useEffect(() => {
    const updateColumnCount = () => {
      if (window.innerWidth >= 1024) {
        setColumnCount(4);
      } else if (window.innerWidth >= 768) {
        setColumnCount(3);
      } else {
        setColumnCount(2);
      }
    };

    updateColumnCount();

    window.addEventListener("resize", updateColumnCount);

    return () => {
      window.removeEventListener("resize", updateColumnCount);
    };
  }, []);

  /* ================= GET CHANNEL ================= */

  const getChannel = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        throw new Error("Unauthorized");
      }

      const res = await axios.get(`/api/getChannelById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setChannel(res.data.channel);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= GET POSTS ================= */

  const getPosts = async (requestedPage = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setPostLoading(true);
      }

      const token = getToken();

      if (!token) {
        throw new Error("Unauthorized");
      }

      const res = await axios.get(
        `/api/getChannelPosts/${id}?page=${requestedPage}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const newPosts = res.data?.posts || [];

      const pagination = res.data?.pagination;

      /* ================= FIRST PAGE ================= */

      if (requestedPage === 1) {
        setPostsData(newPosts);
      } else {
        /* ================= APPEND POSTS ================= */

        setPostsData((prev) => [...prev, ...newPosts]);
      }

      /* ================= PAGINATION ================= */

      setPage(requestedPage);

      setHasNextPage(pagination?.hasNextPage ?? newPosts.length === 10);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setPostLoading(false);
      setLoadingMore(false);
    }
  };

  /* ================= FLATTEN MEDIA ================= */

  const allMedia = useMemo(() => {
    return postsData.flatMap((post: any) =>
      (post.post_media || []).map((media: any) => ({
        media,
        post,
      })),
    );
  }, [postsData]);

  /* ================= STABLE COLUMNS ================= */

  const columns = useMemo(() => {
    const result: any[][] = Array.from({ length: columnCount }, () => []);

    allMedia.forEach((item: any, index: number) => {
      result[index % columnCount].push(item);
    });

    return result;
  }, [allMedia, columnCount]);

  /* ================= LOAD MORE ================= */

  const loadMorePosts = async () => {
    if (loadingMore || postLoading || !hasNextPage) {
      return;
    }

    await getPosts(page + 1, true);
  };

  /* ================= SCROLL ================= */

  const handleScroll = () => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    if (loadingMore || postLoading || !hasNextPage) {
      return;
    }

    const scrollPosition = container.scrollTop + container.clientHeight;

    const scrollHeight = container.scrollHeight;

    if (scrollPosition >= scrollHeight - 200) {
      loadMorePosts();
    }
  };

  /* ================= OPEN POSTS ================= */

  const handleOpenPosts = async () => {
    const nextOpen = !open;

    setOpen(nextOpen);

    if (!nextOpen) {
      return;
    }

    setPostsData([]);
    setPage(1);
    setHasNextPage(true);

    await getPosts(1);
  };

  /* ================= DELETE POST ================= */
  const deletePost = async (
  postId: string,
  reason: string
) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("admin-token="))
    ?.split("=")[1];

  if (!token) {
    throw new Error("Unauthorized");
  }
 const res =  await axios.post(
    `${process.env.NEXT_PUBLIC_DEV_URL}/admin/community/remove-post`,
    {
          post_id: postId,
          remove_reason: reason,
        },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  toast.success("Post deleted");

  setSelectedMediaId(null);

      setSelectedMediaId(null);
      setOpenModal(false);

      /* ================= REFRESH CHANNEL ================= */

      await getChannel();

      /* ================= REFRESH POSTS ================= */

      setPostsData([]);
      setPage(1);
      setHasNextPage(true);

      await getPosts(1);
};
  /* ================= INITIAL FETCH ================= */

  useEffect(() => {
    if (id) {
      getChannel();
    }
  }, [id]);

  /* ================= LOADING ================= */

  if (loading) {
    return <Loader />;
  }

  /* ================= NO CHANNEL ================= */

  if (!channel) {
    return (
      <div className="flex items-center justify-center w-full h-full text-[#7d7d7d] font-inter">
        Channel not found
      </div>
    );
  }

  return (
    <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <h1 className="font-inter font-medium text-[20px] text-[#000000]">
        Channel Details
      </h1>

      <div className="flex itens-center gap-4 h-full">
        {/* ================= LEFT ================= */}

        <div className=" w-[30%] h-[40%] flex flex-col  gap-8">
          <div className="flex items-center gap-8">
            {channel.image ? (
              <div className="w-30 h-30 rounded-full relative overflow-hidden">
                <Image
                  src={channel.image}
                  alt="channel profile"
                  fill
                  unoptimized
                  className="object-cover relative"
                />
              </div>
            ) : (
              <div className="w-30 h-30 rounded-full flex items-center justify-center bg-[#e9e8e8bd] border border-[#ececec]">
                <User2 size={38} />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <span className="font-inter text-sm font-medium text-[#333333]">
                {channel?.users?.users_profile?.user_name}
              </span>

              <span className="font-inter text-lg font-medium text-[#747474]">
                {channel?.name}
              </span>

              <div className="flex items-center gap-6">
                <div className=" flex flex-col items-center justify-center">
                  <span className=" text-[#333333] text-2xl">
                    {channel?.total_members}
                  </span>

                  <span className="font-inter text-sm font-medium text-[#7d7d7d]">
                    Total Members
                  </span>
                </div>

                <div className=" flex flex-col items-center justify-center">
                  <span className=" text-[#333333] text-2xl">
                    {channel?._count?.posts}
                  </span>

                  <span className="font-inter text-sm font-medium text-[#7d7d7d]">
                    Total Posts
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* button */}
          <div className="flex items-center justify-between w-full cursor-pointer">
            <button
              disabled={postLoading}
              onClick={handleOpenPosts}
              className={`${
                postLoading ? "opacity-50" : ""
              } w-full h-12 rounded-lg bg-[#8B5CF6] text-white font-medium cursor-pointer`}
            >
              {postLoading
                ? "please wait..."
                : open
                  ? "Hide Channel Posts"
                  : "View Channel Posts"}
            </button>
          </div>
        </div>

        {/* ================= POSTS ================= */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={`border h-full w-[68%] rounded-xl border-[#706f6f63] ${
            open ? "flex" : "hidden"
          } overflow-y-auto scrollbar-hide flex flex-col gap-2 p-2`}
        >
          {/* ================= CLOSE ================= */}

          <div className="w-full flex items-center justify-end shrink-0">
            <X
              size={30}
              color="#7d7d7d"
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            />
          </div>

          {/* ================= MEDIA ================= */}

          {postLoading && postsData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Loader />
            </div>
          ) : allMedia.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
              {columns.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-4">
                  {column.map(({ media, post }: any, index: number) => (
                    <motion.div
                      key={`${post.id}-${media.id}-${index}`}
                      initial={{
                        opacity: 0,
                        y: 40,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.4,
                      }}
                      whileHover={{
                        scale: 1.02,
                      }}
                      className="relative overflow-hidden rounded-xl group cursor-pointer"
                    >
                      {/* ================= IMAGE ================= */}

                      <img
                        src={media.media_url}
                        alt="post-media"
                        loading="lazy"
                        className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* ================= OVERLAY ================= */}

                      <motion.div
                        initial={{
                          opacity: 0,
                        }}
                        whileHover={{
                          opacity: 1,
                        }}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center gap-4 p-2"
                      >
                        <div className="flex items-center justify-between w-full">
                          {/* ================= LEFT ================= */}

                          <div className="flex items-center gap-6">
                            {/* LIKES */}

                            <div className="flex items-center gap-2">
                              <Heart size={18} color="#ffffff" />

                              <span className="text-sm font-bold text-white">
                                {post?.total_likes ?? 0}
                              </span>
                            </div>

                            {/* COMMENTS */}

                            <div className="flex items-center gap-2">
                              <MessageSquare size={18} color="#ffffff" />

                              <span className="text-sm font-bold text-white">
                                {post?.total_comments ?? 0}
                              </span>
                            </div>
                          </div>

                          {/* ================= DELETE ================= */}

                          <Trash
                            size={18}
                            color="#e62828"
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();

                              setSelectedMediaId(String(post.id));

                              setOpenModal(true);
                            }}
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2 text-lg text-[#7d7d7d] font-inter font-normal flex items-center justify-center h-full">
              <span>No post found</span>
            </div>
          )}

          {/* ================= LOAD MORE ================= */}

          {loadingMore && (
            <div className="flex justify-center py-4 shrink-0">
              <Loader />
            </div>
          )}
        </div>
      </div>

      {/* delete modal */}
      {openModal && selectedMediaId !== null && (
        <DeleteModal
          id={String(selectedMediaId)}
          setOpenModal={setOpenModal}
          onDelete={deletePost}
        />
      )}
    </div>
  );
};

export default Page;
