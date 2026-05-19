"use client";

import ImageResize from "@/components/ui/imageResize";
import Input from "@/components/ui/input";
import TextEditor from "@/components/ui/textArea";
import { useBlog } from "@/context/blogContext";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const mediaTypeMap: Record<string, string> = {
  IMAGE: "ARTICLE",
  VIDEO: "VIDEO",
  AUDIO: "AUDIO",
};

const Page = () => {
  const { uuid } = useParams();

  const { category, fetchBlogs, media, setMedia } = useBlog();

  const [blog, setBlog] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [readTime, setReadTime] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  /* ================= FETCH BLOG ================= */
  const fetchBlogById = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`/api/getBlogById/${uuid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlog(res.data.blog);
    } catch (error:any) {
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

  useEffect(() => {
    if (uuid) fetchBlogById();
  }, [uuid,setBlog]);

  /* ================= PREFILL ================= */
  useEffect(() => {
    if (!blog) return;


    setTitle(blog.title || "");
    setReadTime(String(blog.read_time || ""));
    setContent(blog.description || "");

    if (blog.blog_categories?.length) {
      setSelectedCategories(
        blog.blog_categories.map((c: any) => Number(c.mstr_categories?.id))
      );
    }

    if (blog.blog_media?.length > 0) {
      const m = blog.blog_media[0];

      setMedia({
        media_url: m.media_url,
        media_key: m.media_key,
        media_type: m.media_type,
        thumbnail_url: m.thumbnail_url || "",
        thumbnail_key: m.thumbnail_key || "",
      });
    }
  }, [blog]);

  /* ================= CATEGORY TOGGLE ================= */
  const handleToggle = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  /* ================= CLOSE DROPDOWN ================= */
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  /* ================= UPDATE BLOG ================= */

const updateBlog = async () => {
  /* ================= VALIDATIONS ================= */

if (!title.trim()) {
  toast.error("Please enter title")
  
  return;
}

if (!readTime.trim()) {
  toast.error("Please enter read time")
  return;
}

if (!content.trim()) {
  toast.error("Please enter content")
  return;
}

if (!selectedCategories.length) {
  toast.error("Please select at least one category")
  return;
}

if (!media?.media_url) {
  toast.error("Please upload media")
  return;
}

/* VIDEO/AUDIO THUMBNAIL CHECK */

const isVideoOrAudio =
  media?.media_type === "VIDEO" ||
  media?.media_type === "AUDIO";

if (
  isVideoOrAudio &&
  !media?.thumbnail_url
) {
  toast.error("Please upload thumbnail")
  return;
}
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!blog) return;

    const payload: any = {
      blog_id: String(blog.id),
    };

    /* ================= ONLY CHANGED FIELDS ================= */

    if (title.trim() !== blog.title) {
      payload.title = title;
    }

    if (content.trim() !== blog.description) {
      payload.description = content;
    }

    if (readTime.trim() !== String(blog.read_time || "")) {
      payload.read_time = Number(readTime);
    }

    /* ================= CATEGORY ================= */

    const oldCategories =
      blog.blog_categories?.map((c: any) =>
        String(c.mstr_categories?.id),
      ) || [];

    const newCategories = selectedCategories.map(String);

    if (
      JSON.stringify(oldCategories.sort()) !==
      JSON.stringify(newCategories.sort())
    ) {
      payload.category = newCategories;
    }

    /* ================= MEDIA ================= */

    const oldMedia = blog.blog_media?.[0];

    const mediaChanged =
      media?.media_url !== oldMedia?.media_url ||
      media?.thumbnail_url !== oldMedia?.thumbnail_url;

    if (mediaChanged && media?.media_url) {
      payload.type = media?.media_type
        ? mediaTypeMap[media.media_type] || media.media_type
        : blog.type;

      payload.media = [
        {
          media_url: media.media_url,

          // IMPORTANT
          media_key:
            media.media_key || oldMedia?.media_key,

          media_type:
            media.media_type || oldMedia?.media_type,

          thumbnail_url:
            media.thumbnail_url ||
            oldMedia?.thumbnail_url,

          thumbnail_key:
            media.thumbnail_key ||
            oldMedia?.thumbnail_key,
        },
      ];
    }

    /* ================= NOTHING CHANGED ================= */

    if (Object.keys(payload).length === 1) {
      toast.error("No changes found");
      setLoading(false);
      return;
    }

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_DEV_URL}/blog/update-blog`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    await fetchBlogById();
    toast.success("Blog Updated successfully");
await fetchBlogs();
    
    
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
  /* ================= UI ================= */
  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center w-[80%] h-[80%]">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
          <h2 className="text-[20px] font-medium">Blog Details</h2>

          <div className="flex gap-4 h-[80%]">
            <div className="w-[70%] border rounded-xl p-4">
              <ImageResize
                initialMedia={
                  media?.media_url
                    ? {
                        media_url:
                          blog?.blog_media?.[0]?.media_url,
                        media_key:
                          blog?.blog_media?.[0]?.media_key,
                        media_type:
                          blog?.blog_media?.[0]?.media_type,
                        thumbnail_url:
                          blog?.blog_media?.[0]?.thumbnail_url ||
                          "",
                        thumbnail_key:
                          blog?.blog_media?.[0]?.thumbnail_key ||
                          "",
                      }
                    : undefined
                }

                
              />
            </div>

            <div className="w-[30%] flex flex-col gap-4">
              {/* CATEGORY */}
                         <div ref={dropdownRef} className="relative w-full">
               <div
                  onClick={() => setOpen((prev) => !prev)}
                  className="border border-[#4C4C52] p-2 rounded-sm cursor-pointer font-normal text-sm text-[#000000bf] flex items-center justify-between"
                >
                  <span className="truncate w-full">
                    {selectedCategories.length > 0
                      ? category
                          .filter((c) =>
                            selectedCategories.includes(Number(c.id)),
                          )
                          .map((c) => c.name.replace(/_/g, " "))
                          .join(", ")
                      : "Please select categories"}
                  </span>

                  <ChevronDown size={14} color="#000000bf" />
                </div>

                {open && (
                  <div className="absolute z-50 mt-1 w-full bg-white border rounded-sm max-h-60 overflow-y-auto">
                    {category.map((data) => (
                      <label
                        key={data.id}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer font-inter font-medium text-[14px] text-[#747272]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(Number(data.id))}
                          onChange={() => handleToggle(Number(data.id))}
                        />

                        {data.name.replace(/_/g, " ")}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {/* TITLE */}
              <Input
                label="Title"
                type="text"
                value={title}
                onChange={(e: any) =>
                  setTitle(e.target.value)
                }
              />

              {/* READ TIME */}
              <Input
                label="Read Time"
                type="text"
                value={readTime}
                onChange={(e: any) =>
                  setReadTime(e.target.value)
                }
                width="w-[30%]"
              />
            </div>
          </div>

          <TextEditor
            content={content}
            setContent={setContent}
          />

          <button
            onClick={updateBlog}
            className="text-white rounded-sm w-30 px-2 py-3 bg-green-500 self-center cursor-pointer"
          >
            Update
          </button>
          <Toaster/>
        </div>
      )}
    </>
  );
};

export default Page;