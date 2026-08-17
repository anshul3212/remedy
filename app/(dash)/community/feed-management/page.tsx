"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePost } from "@/context/getAllPostContext";
import {
  Heart,
  MessageSquare,
  Trash,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Loader from "@/components/ui/loaders/loader";

const Page = () => {
  const {
    posts,
    loading,
    loadingMore,
    fetchPosts,
    page,
    hasNextPage,
  } = usePost();

  const router = useRouter();

  /* ================= REFS ================= */

  const scrollRef = useRef<HTMLDivElement | null>(null);

  /* ================= STATE ================= */

  const [columnCount, setColumnCount] = useState(4);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMediaId,setSelectedMediaId] = useState<number|null>(null)
    const [name, setName] = useState("");

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

    window.addEventListener(
      "resize",
      updateColumnCount,
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateColumnCount,
      );
    };
  }, []);

  /* ================= DATA ================= */

  const filteredPosts = useMemo(() => {
    return (
      posts?.filter(
        (post: any) =>
          post.post_media &&
          post.post_media.length > 0,
      ) || []
    );
  }, [posts]);

  const allMedia = useMemo(() => {
    return filteredPosts.flatMap((post: any) =>
      post.post_media.map(
        (media: any, index: number) => ({
          media,
          post,
          index,
        }),
      ),
    );
  }, [filteredPosts]);

  /* ================= STABLE COLUMNS ================= */

  const columns = useMemo(() => {
    const result: any[][] = Array.from(
      { length: columnCount },
      () => [],
    );

    allMedia.forEach((item: any, index: number) => {
      result[index % columnCount].push(item);
    });

    return result;
  }, [allMedia, columnCount]);

  /* ================= INITIAL FETCH ================= */

  useEffect(() => {
    fetchPosts(1);
  }, []);

  /* ================= SCROLL ================= */

  const handleScroll = () => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    if (loading || loadingMore) {
      return;
    }

    if (!hasNextPage) {
      return;
    }

    const scrollPosition =
      container.scrollTop +
      container.clientHeight;

    const scrollHeight =
      container.scrollHeight;

    if (
      scrollPosition >=
      scrollHeight - 200
    ) {
      fetchPosts(page + 1);
    }
  };

  /* ================= UI ================= */

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]"
        >
          <h1 className="font-inter font-medium text-[20px] text-[#000000]">
            Feed Management
          </h1>

          {/* ================= MEDIA GRID ================= */}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
            {columns.map(
              (
                column,
                columnIndex,
              ) => (
                <div
                  key={columnIndex}
                  className="flex flex-col gap-4"
                >
                  {column.map(
                    ({
                      media,
                      post,
                    }: any) => (
                      <motion.div
                        key={`${post.id}-${media.id}`}
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
                        onClick={() => {
                          router.push(
                            `/community/feed-management/${post.id}?mediaId=${media.id}`,
                          );
                        }}
                      >
                        <Image
                          src={
                            media.media_url
                          }
                          alt="post-media"
                          width={500}
                          height={500}
                          loading="lazy"
                          unoptimized
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
                            <div className="flex items-center gap-6">
                              {/* Likes */}

                              <div className="flex items-center gap-2">
                                <Heart
                                  size={18}
                                  color="#ffffff"
                                />

                                <span className="text-sm font-inter font-bold text-white">
                                  {
                                    post?.total_likes
                                  }
                                </span>
                              </div>

                              {/* Comments */}

                              <div className="flex items-center gap-2">
                                <MessageSquare
                                  size={
                                    18
                                  }
                                  color="#ffffff"
                                />

                                <span className="text-sm font-inter font-bold text-white">
                                  {
                                    post?.total_comments
                                  }
                                </span>
                              </div>
                            </div>

                            {/* Delete */}

                            <Trash
                              size={18}
                              color="#e62828"
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMediaId(media.id);
                                setOpenModal(true);
                              }}
                            />
                          </div>
                        </motion.div>
                      </motion.div>
                    ),
                  )}
                </div>
              ),
            )}
          </div>

          {/* ================= LOADING MORE ================= */}

          {loadingMore && (
            <div className="flex justify-center py-4">
              <Loader />
            </div>
          )}

          {/* delete modal */}
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
                  setSelectedMediaId(null)
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
                  setSelectedMediaId(null)
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
                  console.log(`deleted-${selectedMediaId}`)
                }}
                className={`px-4 py-2 text-sm rounded-sm font-inter text-[12px] font-medium text-[white] bg-red-500 cursor-pointer min-w-35.75 ${!name.trim() || loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              >
                {!loading ? "Delete" : "Deleting"}
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      )}
    </>
  );
};

export default Page;