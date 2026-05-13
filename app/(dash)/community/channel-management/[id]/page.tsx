"use client";
import { useChannel } from "@/context/channelContext";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Trash, X } from "lucide-react";

const Page = () => {
  const { id } = useParams();
  const { channels } = useChannel();
  const [open, setOpen] = useState(false);

  const channel = channels.find(
    (ch) => ch.id.trim().toLowerCase() === String(id).trim().toLowerCase(),
  );

  if (!channel) {
  return (
    <div className="flex items-center justify-center w-[80%] h-[80%]">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
    </div>
  );
}
  return (
    
    <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <h1 className="font-inter font-medium text-[20px] text-[#000000]">
        Channel Details
      </h1>

      <div className="flex itens-center gap-4 h-full">
        <div className="p-4 rounded-xl border w-[30%] h-[40%] border-[#706f6f63] flex flex-col items-center justify-center gap-4">
          <div className="w-20 h-20 rounded-full relative overflow-hidden">
            {channel.image ? (
              <Image
                src={channel.image}
                alt="channel profile"
                fill
                className="object-cover relative"
              />
            ) : (
              <Image
                src={"/logo.png"}
                alt="channel profile"
                fill
                className="object-cover relative"
              />
            )}
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="font-inter text-sm font-medium text-[#333333]">
              {channel.users.users_profile.user_name}
            </span>
            <span className="font-inter text-lg font-medium text-[#747474]">
              {channel.name}
            </span>
          </div>

          <div className="flex items-center justify-between w-full">
            <span className="font-inter text-sm font-medium text-[#333333]">
              members:{" "}
              <span className="text-[#7d7d7d]">{channel.total_members}</span>
            </span>
            <span className="font-inter text-sm font-medium text-[#333333]">
              channel type:{" "}
              <span className="text-[#7d7d7d]">{channel.channel_type}</span>
            </span>
          </div>

          <div
            className="flex items-center justify-between w-full cursor-pointer"
          >
            <span className="font-inter text-sm font-medium text-[#333333]">
              total posts:{" "}
              <span className="text-[#7d7d7d]">{channel._count.posts}</span>
            </span>
            <span className="font-inter text-sm font-medium text-[#5c69df]"  onClick={() => setOpen(!open)}>
              click to view posts
            </span>
          </div>
        </div>

        <div
          className={`border h-full w-[68%] rounded-xl border-[#706f6f63] ${open ? "flex gap-6" : "hidden"} overflow-auto flex flex-col p-2`}
        >
            <div className="w-full flex items-center justify-end">
              <X size={30} color="#7d7d7d" onClick={()=>setOpen(false)} className="cursor-pointer"/>  
            </div>
            
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
  {channel?.posts?.length > 0 ? (
    channel.posts.map((post: any, index: number) => (
      <motion.div
        key={post.id}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.4,
          delay: index * 0.03,
        }}
        whileHover={{ scale: 1.02 }}
        className="relative overflow-hidden rounded-xl break-inside-avoid group cursor-pointer"
      >
        {/* Image */}
        <img
          src={post?.media_url || channel?.image}
          alt="post-media"
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center gap-4 p-2"
        >
          <div className="flex items-center justify-between w-full">

            {/* Likes */}
            <div className="flex items-center gap-6">

              <div className="flex items-center gap-2">
                <Heart size={18} color="#ffffff" />

                <span className="text-sm font-bold text-white">
                  {post?.total_likes}
                </span>
              </div>

              {/* Comments */}
              <div className="flex items-center gap-2">
                <MessageSquare size={18} color="#ffffff" />

                <span className="text-sm font-bold text-white">
                  {post?.total_comments}
                </span>
              </div>
            </div>

            {/* Delete */}
            <Trash
              size={18}
              color="#e62828"
              className="cursor-pointer"
            />
          </div>
        </motion.div>
      </motion.div>
    ))
  ) : (
    <div className=" p-2 text-lg text-[#7d7d7d] font-inter font-normal">No post found</div>
  )}
</div>
        </div>
      </div>
    </div>
    
   
    
)
};

export default Page;
