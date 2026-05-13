
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePost } from "@/context/getAllPostContext";
import { Heart, MessageSquare, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Page = () => {
  const { posts, loading } = usePost();
  const router = useRouter();

  const scrollRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(8);


  const filteredPosts = useMemo(() => {
    return (
      posts?.filter(
        (post: any) => post.post_media && post.post_media.length > 0,
      ) || []
    );
  }, [posts]);

  const allMedia = useMemo(() => {
    return filteredPosts.flatMap((post: any) =>
      post.post_media.map((media: any, index: number) => ({
        media,
        post,
        index,
      })),
    );
  }, [filteredPosts]);

  const visibleMedia = allMedia.slice(0, visibleCount);

  useEffect(() => {
    const container = scrollRef.current;

    const handleScroll = () => {
      if (!container) return;

      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;

      if (scrollTop + containerHeight >= scrollHeight - 200) {
        setVisibleCount((prev) => prev + 8);
      }
    };

    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center w-[80%] h-[80%]">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className=" font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]"
        >
          <h1 className="font-inter font-medium text-[20px] text-[#000000]">
            Feed Management
          </h1> 

          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {visibleMedia.map(({ media, post, index }: any) => (
              <motion.div
                key={`${post.id}-${index}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.03,
                }}
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-xl break-inside-avoid group cursor-pointer"
                onClick={() =>
                {
                router.push(
  `/community/feed-management/${post.id}?mediaId=${media.id}`
)
               
                }
                  
                }
              >
                <img
                  src={media.media_url}
                  alt="post-media"
                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center gap-4 p-2"
                >
                    <div className="flex items-center justify-between w-full">

                 
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Heart size={18} color="#ffffff" />
                      <span className="text-sm font-inter font-bold text-white">
                        {post?.total_likes}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MessageSquare size={18} color="#ffffff" />
                      <span className="text-sm font-inter font-bold text-white">
                        {post?.total_comments}
                      </span>
                    </div>
                  </div>

                 
                  <Trash size={18} color="#e62828" className="cursor-pointer"/>
                     </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Page;