"use client";

import ImageResize from "@/components/ui/imageResize";
import Input from "@/components/ui/input";
import dynamic from "next/dynamic";
// import TextEditor from "@/components/ui/textArea";
import { useBlog } from "@/context/blogContext";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
const TextEditor = dynamic(() => import("@/components/ui/textArea"), {
  ssr: false,
  loading: () => <p></p>,
});

const Page = () => {
  const { category, media, fetchBlogs, setMedia, fetchCategories} = useBlog();
  const router = useRouter();

  const mediaTypeMap: Record<string, string> = {
    IMAGE: "ARTICLE",
    VIDEO: "VIDEO",
    AUDIO: "AUDIO",
  };
  const [title, setTitle] = useState("");

  const [readTime, setReadTime] = useState("");
  const [content, setContent] = useState("");
  const [loading,setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [open, setOpen] = useState(false);

  const [upload, setUpload] = useState(false);

  const handleToggle = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

useEffect(()=>{
  fetchCategories();
},[])

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const payload = {
    type: media?.media_type
      ? mediaTypeMap[media.media_type] || media.media_type
      : "",

    title: title,
    description: content,
    read_time: Number(readTime),

    category: selectedCategories,

    media: [
      {
        media_url: media.media_key,
        media_type: media.media_type,
        thumbnail_url: media.thumbnail_url,
      },
    ],
  };

  const uploadBlogs = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin-token="))
      ?.split("=")[1];
    if (!token) return;

    if (!media?.media_url?.trim() || !media?.media_type?.trim()) {
      toast.error("Please upload media");
      return;
    }

    if (
      (media.media_type === "VIDEO" || media.media_type === "AUDIO") &&
      !media?.thumbnail_url?.trim()
    ) {
      toast.error("Please upload thumbnail");
      return;
    }

    if (!selectedCategories.length) {
      toast.error("Please select at least one category");

      return;
    }

    if (!title.trim()) {
      toast.error("Please enter title");
      return;
    }

    if (!readTime.trim()) {
      toast.error("Please enter read time");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter content");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_DEV_URL}/admin/blog/create-blog`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setUpload((prev) => !prev);
      setTitle("");

      setReadTime("");
      setContent("");
      setSelectedCategories([]);
      setMedia({
        media_url: "",
        media_key: "",

        media_type: "",

        thumbnail_url: "",
        thumbnail_key: "",
      });
      toast.success("blog submitted successfully");
      router.push("/library");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Something went wrong";

      toast.error(message);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <h2 className="font-inter font-medium text-[20px] text-[#000000]">
        Blog Deatils
      </h2>

      <div className="w-full h-[80%] flex justify-between gap-4">
        <div className="w-[70%] h-full  border border-[#3f3e3e] rounded-xl p-4">
          <ImageResize upload={upload} />
        </div>

        <div className="h-full  w-[30%] flex flex-col gap-4 ">
          <div ref={dropdownRef} className="relative w-full">
            <div
              onClick={() => setOpen((prev) => !prev)}
              className="border border-[#4C4C52] p-2 rounded-sm cursor-pointer font-normal text-sm text-[#000000bf] font-inter flex items-center justify-between"
            >
              <span className="truncate w-full">
                {selectedCategories.length > 0
                  ? category
                      .filter((c) => selectedCategories.includes(c.id))
                      .map((c) => c.name.replace(/_/g, " "))
                      .join(" | ")
                  : "Please select categories"}
              </span>

              <ChevronDown size={14} color="#000000bf" className="shrink-0" />
            </div>

            {open && (
              <div className="absolute z-9999 mt-1 w-full bg-white border rounded-sm  max-h-60 overflow-y-auto">
                {category.map((data) => (
                  <label
                    key={data.id}
                    className="flex items-center  gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer font-inter font-medium text-[14px] text-[#747272] "
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(data.id)}
                      onChange={() => handleToggle(data.id)}
                      className="accent-[#944d43]"
                    />
                    {data.name.replace(/_/g, " ")}
                  </label>
                ))}
              </div>
            )}
          </div>

          <Input
            label={"Title"}
            type={"text"}
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
            placeholder={"Enter title"}
          />
          <div className="flex items-center gap-6 ">
            <Input
              label={"Read Time"}
              type={"text"}
              value={readTime}
              onChange={(e: any) => setReadTime(e.target.value)}
              placeholder={"Enter time"}
            />
          </div>
        </div>
      </div>

      <div>
        <TextEditor setContent={setContent} content={content} />
      </div>

      <button
        onClick={uploadBlogs}
        disabled ={loading}
        className={`text-white rounded-sm w-30 px-2 py-3 bg-green-500 self-center cursor-pointer ${loading?"opacity-50 cursor-not-allowed":""}`}
      >
        {loading?"Submiting":"Submit"}
      </button>
    </div>
  );
};

export default Page;
