"use client";

import ImageResize from "@/components/ui/imageResize";
import Input from "@/components/ui/input";
import TextEditor from "@/components/ui/textArea";
import { useBlog } from "@/context/blogContext";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const page = () => {
  const { category, media,fetchBlogs,setMedia } = useBlog();

  

  const mediaTypeMap: Record<string, string> = {
  IMAGE: "ARTICLE",
  VIDEO: "VIDEO",
  AUDIO: "AUDIO",
};
  const [title, setTitle] = useState("");

  const [readTime, setReadTime] = useState("");
  const [content, setContent] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [open, setOpen] = useState(false);

  const[upload,setUpload]=useState(false);


  const handleToggle = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
    
  };




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
      media_url: media.media_url,
      media_type: media.media_type,
      thumbnail_url: "users/thumb.jpg",
    },
  ],
};



const uploadBlogs = async () => {
  
  const token = localStorage.getItem("token");
  if (!media.media_url) {
    alert("Please upload media");
    return;
  }

  if (!selectedCategories.length) {
    alert("Please select at least one category");
    return;
  }

  if (!title.trim()) {
    alert("Please enter title");
    return;
  }

  if (!readTime.trim()) {
    alert("Please enter read time");
    return;
  }

  if (!content.trim()) {
    alert("Please enter content");
    return;
  }


  try {

    

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_DEV_URL}/blog/create-blog`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    setUpload(prev => !prev);
      fetchBlogs();
      setTitle("");
    
      setReadTime("");
      setContent("");
      setSelectedCategories([]);
      setMedia({
  media_url: "",
  media_type: "",
})

alert("blog submitted successfully")

  } catch (error: any) {
    console.log(error.response?.data || error.message);
  }
};

  return (
    <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <h2 className="font-inter font-medium text-[20px] text-[#000000]">
        Blog Deatils
      </h2>

      <div className="w-full h-150 flex justify-between gap-4">
        <div className="h-80 w-[70%]  border border-[#3f3e3e] rounded-xl p-4">
          <ImageResize upload={upload}/>
        </div>

        <div className="  w-[30%] flex flex-col gap-4 ">
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
          .join(", ")
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
              width={"w-[30%]"}
            />

          </div>
        </div>
      </div>

      <div>
        <TextEditor setContent={setContent} content={content} />
      </div>

      <button onClick={uploadBlogs} className="text-white rounded-sm w-30 px-2 py-3 bg-green-500 self-center cursor-pointer">submit</button>

      
    </div>
  );
};

export default page;
