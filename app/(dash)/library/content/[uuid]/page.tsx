// "use client";

// import ImageResize from "@/components/ui/imageResize";
// import Input from "@/components/ui/input";
// import TextEditor from "@/components/ui/textArea";
// import { useBlog } from "@/context/blogContext";
// import axios from "axios";
// import { ChevronDown } from "lucide-react";
// import { useParams } from "next/navigation";
// import { useEffect, useRef, useState } from "react";


//  const mediaTypeMap: Record<string, string> = {
//   IMAGE: "ARTICLE",
//   VIDEO: "VIDEO",
//   AUDIO: "AUDIO",
// };

// const page = () => {
//   const { uuid } = useParams();
//   const { blogs, category,media,fetchBlogs,setMedia } = useBlog();
//   const [title, setTitle] = useState("");
 
//   const [readTime, setReadTime] = useState("");
//   const [content, setContent] = useState("");
//   const dropdownRef = useRef<HTMLDivElement | null>(null);

//   const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
//   const [open, setOpen] = useState(false);


//   const handleToggle = (id: number) => {
//     setSelectedCategories((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
//     );
//   };
//   useEffect(() => {
//     const handleClickOutside = (e: any) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
 
//   const blog = blogs.find(
//     (b) => b.uuid.trim().toLowerCase() === String(uuid).trim().toLowerCase(),
//   );

  
// useEffect(() => {
//   if (!blog) return;

//   setTitle(blog.title || "");
//   setReadTime(String(blog.readTime || ""));
//   setContent(blog.description || "");

//   if (blog.blog_categories?.length) {
//     const ids = blog.blog_categories.map(
//       (c: any) => Number(c.mstr_categories?.id)
//     );
//     setSelectedCategories(ids);
//   }
//   console.log(blog.blog_media)

//   if (blog.blog_media?.length > 0) {
//     setMedia({
//       media_url: blog.blog_media[0].media_url,
//       media_type: blog.blog_media[0].media_type,
//     });
//   }
// }, [blog]);  

// const updateBlog = async () => {
//   const token = localStorage.getItem("token");

//   try {
//     const payload = {
//   blog_id: String(blog?.id),

//   type: media?.media_type
//     ? mediaTypeMap[media.media_type] || media.media_type
//     : blog?.type || "ARTICLE",

//   title,

//   description: content,

//   category: selectedCategories.map(String),

//   ...(media && {
//     media: [
//       {
//         media_url: media.media_url,
//         media_type: media.media_type,
//         thumbnail_url: media.thumbnail_url || "",
//       },
//     ],
//   }),
// };

//     console.log(payload);

//     const res = await axios.post(
//       "http://3.13.92.66/api/v1/admin/blog/update-blog",
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log(res.data);

//     fetchBlogs();

//     alert("updated");
//   } catch (error: any) {
//     console.log(error.response?.data || error);
//   }
// };


//   return (
//     <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
//       <h2 className="font-inter font-medium text-[20px] text-[#000000]">
//         Blog Deatils
//       </h2>

//       <div className="w-full h-150 flex justify-between gap-4">
//         <div className="h-80 w-[70%]  border border-[#3f3e3e] rounded-xl p-4">
//           <ImageResize />
//         </div>

//         <div className=" w-[30%] flex flex-col gap-4">
//           <div ref={dropdownRef} className="relative w-full">
//             <div
//               onClick={() => setOpen((prev) => !prev)}
//               className="border border-[#4C4C52] p-2 rounded-sm cursor-pointer font-normal text-sm text-[#000000bf] font-inter flex items-center justify-between"
//             >
//               <span className="truncate w-full">
//               {selectedCategories.length > 0
//     ? category
//         .filter((c) => selectedCategories.includes(Number(c.id))) 
//         .map((c) => c.name.replace(/_/g, " "))
//         .join(", ")
//     : "Please select categories"}
//     </span>

//     <ChevronDown size={14} color="#000000bf" className="shrink-0" />
//             </div>

//             {open && (
//               <div className="absolute z-9999 mt-1 w-full bg-white border rounded-sm  max-h-60 overflow-y-auto">
//                 {category.map((data) => (
//                   <label
//                     key={data.id}
//                     className="flex items-center  gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer font-inter font-medium text-[14px] text-[#747272] "
//                   >
//                     <input
//                       type="checkbox"                 
//   checked={selectedCategories.includes(Number(data.id))}
//   onChange={() => handleToggle(Number(data.id))}
//                       className="accent-[#944d43]"
//                     />
//                     {data.name.replace(/_/g, " ")}
//                   </label>
//                 ))}
//               </div>
//             )}
//           </div>

//           <Input
//             label={"Title"}
//             type={"text"}
//             value={title}
//             onChange={(e: any) => setTitle(e.target.value)}
//             placeholder={"Enter title"}
//           />

//           <div className="flex items-center gap-6 ">
//             <Input
//               label={"Read Time"}
//               type={"text"}
//               value={readTime}
//               onChange={(e: any) => setReadTime(e.target.value)}
//               placeholder={"Enter time"}
//               width={"w-[30%]"}
//             />

            
//           </div>
//         </div>
//       </div>

//       <div>
//         <TextEditor setContent={setContent} content={content} />
//       </div>
//       <button onClick={updateBlog} className="text-white rounded-sm w-30 px-2 py-3 bg-green-500 self-center cursor-pointer">updated</button>
//     </div>
//   );
// };

// export default page;












// "use client";

// import ImageResize from "@/components/ui/imageResize";
// import Input from "@/components/ui/input";
// import TextEditor from "@/components/ui/textArea";
// import { useBlog } from "@/context/blogContext";
// import axios from "axios";
// import { ChevronDown } from "lucide-react";
// import { useParams } from "next/navigation";
// import { useEffect, useRef, useState } from "react";

// const mediaTypeMap: Record<string, string> = {
//   IMAGE: "ARTICLE",
//   VIDEO: "VIDEO",
//   AUDIO: "AUDIO",
// };

// const page = () => {
//   const { uuid } = useParams();

//   const { blogs, category, fetchBlogs } = useBlog();

//   const [title, setTitle] = useState("");
//   const [readTime, setReadTime] = useState("");
//   const [content, setContent] = useState("");

//   const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
//   const [open, setOpen] = useState(false);

//   const dropdownRef = useRef<HTMLDivElement | null>(null);

//   const handleToggle = (id: number) => {
//     setSelectedCategories((prev) =>
//       prev.includes(id)
//         ? prev.filter((item) => item !== id)
//         : [...prev, id]
//     );
//   };

//   useEffect(() => {
//     const handleClickOutside = (e: any) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const blog = blogs.find(
//     (b) =>
//       b.uuid?.trim().toLowerCase() === String(uuid)?.trim().toLowerCase()
//   );

//   /* ================= PREFILL ================= */
//   useEffect(() => {
//     if (!blog) return;

//     setTitle(blog.title || "");
//     setReadTime(String(blog.readTime || ""));
//     setContent(blog.description || "");

//     console.log("BLOG:", blog);
//   console.log("MEDIA:", blog?.blog_media);

//     if (blog.blog_categories?.length) {
//       const ids = blog.blog_categories.map((c: any) =>
//         Number(c.mstr_categories?.id)
//       );
//       setSelectedCategories(ids);
//     }
//   }, [blog]);

//   /* ================= UPDATE BLOG ================= */
//   const updateBlog = async () => {
//     const token = localStorage.getItem("token");

//     try {
//       const payload = {
//         blog_id: String(blog?.id),

//         type: blog?.type || "ARTICLE",

//         title,
//         description: content,

//         category: selectedCategories.map(String),

//         ...(blog?.blog_media?.[0] && {
//           media: [
//             {
//               media_url: blog.blog_media[0].media_url,
//               media_type: blog.blog_media[0].media_type,
//               thumbnail_url: "",
//             },
//           ],
//         }),
//       };

//       const res = await axios.post(
//         "http://3.13.92.66/api/v1/admin/blog/update-blog",
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log(res.data);

//       fetchBlogs();
//       alert("updated");
//     } catch (error: any) {
//       console.log(error.response?.data || error);
//     }
//   };

//   return (
//     <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">

//       <h2 className="font-inter font-medium text-[20px] text-[#000000]">
//         Blog Deatils
//       </h2>

//       <div className="w-full h-150 flex justify-between gap-4">

//         {/* MEDIA COMPONENT WITH PREFILL FIX */}
//         <div className="h-80 w-[70%] border border-[#3f3e3e] rounded-xl p-4">

//           <ImageResize
//             initialMedia={
//               blog?.blog_media?.[0]
//                 ? {
//                     media_url: blog.blog_media[0].media_url,
//                     media_type: blog.blog_media[0].media_type,
//                   }
//                 : undefined
//             }
//           />

//         </div>

//         {/* RIGHT SIDE */}
//         <div className="w-[30%] flex flex-col gap-4">

//           {/* CATEGORY DROPDOWN */}
//           <div ref={dropdownRef} className="relative w-full">

//             <div
//               onClick={() => setOpen((prev) => !prev)}
//               className="border border-[#4C4C52] p-2 rounded-sm cursor-pointer font-normal text-sm text-[#000000bf] flex items-center justify-between"
//             >
//               <span className="truncate w-full">

//                 {selectedCategories.length > 0
//                   ? category
//                       .filter((c) =>
//                         selectedCategories.includes(Number(c.id))
//                       )
//                       .map((c) =>
//                         c.name.replace(/_/g, " ")
//                       )
//                       .join(", ")
//                   : "Please select categories"}

//               </span>

//               <ChevronDown size={14} color="#000000bf" />
//             </div>

//             {open && (
//               <div className="absolute z-50 mt-1 w-full bg-white border rounded-sm max-h-60 overflow-y-auto">

//                 {category.map((data) => (
//                   <label
//                     key={data.id}
//                     className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedCategories.includes(
//                         Number(data.id)
//                       )}
//                       onChange={() =>
//                         handleToggle(Number(data.id))
//                       }
//                     />
//                     {data.name.replace(/_/g, " ")}
//                   </label>
//                 ))}

//               </div>
//             )}
//           </div>

//           {/* TITLE */}
//           <Input
//             label={"Title"}
//             type={"text"}
//             value={title}
//             onChange={(e: any) => setTitle(e.target.value)}
//             placeholder={"Enter title"}
//           />

//           {/* READ TIME */}
//           <Input
//             label={"Read Time"}
//             type={"text"}
//             value={readTime}
//             onChange={(e: any) => setReadTime(e.target.value)}
//             placeholder={"Enter time"}
//             width={"w-[30%]"}
//           />

//         </div>
//       </div>

//       {/* TEXT EDITOR */}
//       <div>
//         <TextEditor setContent={setContent} content={content} />
//       </div>

//       {/* UPDATE BUTTON */}
//       <button
//         onClick={updateBlog}
//         className="text-white rounded-sm w-30 px-2 py-3 bg-green-500 self-center cursor-pointer"
//       >
//         updated
//       </button>

//     </div>
//   );
// };

// export default page;













// "use client";

// import ImageResize from "@/components/ui/imageResize";
// import Input from "@/components/ui/input";
// import TextEditor from "@/components/ui/textArea";
// import { useBlog } from "@/context/blogContext";
// import axios from "axios";
// import { ChevronDown } from "lucide-react";
// import { useParams } from "next/navigation";
// import { useEffect, useRef, useState } from "react";

// const mediaTypeMap: Record<string, string> = {
//   IMAGE: "ARTICLE",
//   VIDEO: "VIDEO",
//   AUDIO: "AUDIO",
// };

// const page = () => {
//   const { uuid } = useParams();

//   const { blogs, category, fetchBlogs,media,setMedia } = useBlog();

//   const [title, setTitle] = useState("");
//   const [readTime, setReadTime] = useState("");
//   const [content, setContent] = useState("");

//   const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
//   const [open, setOpen] = useState(false);

//   const dropdownRef = useRef<HTMLDivElement | null>(null);

//   const handleToggle = (id: number) => {
//     setSelectedCategories((prev) =>
//       prev.includes(id)
//         ? prev.filter((item) => item !== id)
//         : [...prev, id]
//     );
//   };

//   useEffect(() => {
//     const handleClickOutside = (e: any) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const blog = blogs.find(
//     (b) =>
//       b.uuid?.trim().toLowerCase() === String(uuid)?.trim().toLowerCase()
//   );

//   /* ================= FIXED PREFILL ================= */
//   // useEffect(() => {
//   //   if (!blog) return;

//   //   setTitle(blog.title || "");
//   //   setReadTime(String(blog.readTime || ""));
//   //   setContent(blog.description || "");

//   //   if (blog.blog_categories?.length) {
//   //     const ids = blog.blog_categories.map((c: any) =>
//   //       Number(c.mstr_categories?.id)
//   //     );
//   //     setSelectedCategories(ids);
//   //   }

//   // }, [blog]);


//   useEffect(() => {
//   if (!blog) return;

//   setTitle(blog.title || "");
//   setReadTime(String(blog.readTime || ""));
//   setContent(blog.description || "");

//   if (blog.blog_categories?.length) {
//     const ids = blog.blog_categories.map((c: any) =>
//       Number(c.mstr_categories?.id)
//     );

//     setSelectedCategories(ids);
//   }

//   /* ================= SET MEDIA ================= */

//   if (blog.blog_media?.length > 0) {
//     setMedia({
//       media_url: blog.blog_media[0].media_url,
//       media_type: blog.blog_media[0].media_type,
//       thumbnail_url: blog.blog_media[0].thumbnail_url || "",
//     });
//   }

// }, [blog]);
//   /* ================= UPDATE BLOG ================= */
//   const updateBlog = async () => {
//     const token = localStorage.getItem("token");
//     if (!media.media_url) {
//     alert("Please upload media");
//     return;
//   }

//   if (!selectedCategories.length) {
//     alert("Please select at least one category");
//     return;
//   }

//   if (!title.trim()) {
//     alert("Please enter title");
//     return;
//   }

//   if (!readTime.trim()) {
//     alert("Please enter read time");
//     return;
//   }

//   if (!content.trim()) {
//     alert("Please enter content");
//     return;
//   }

//     try {
//       const payload = {
//   blog_id: String(blog?.id),

//   type: media?.media_type
//     ? mediaTypeMap[media.media_type] || media.media_type
//     : blog?.type || "ARTICLE",

//   title,
//   description: content,

//   category: selectedCategories.map(String),

//   media: [
//     {
//       media_url: media.media_url,
//       media_type: media.media_type,
//       thumbnail_url: media.thumbnail_url || "",
//     },
//   ],
// };

//       const res = await axios.post(
//         "http://3.13.92.66/api/v1/admin/blog/update-blog",
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       fetchBlogs();
//       alert("updated");
//     } catch (error: any) {
//       console.log(error.response?.data || error);
//     }
//   };

//   /* ================= RENDER ================= */
//   return (
//     <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">

//       <h2 className="font-inter font-medium text-[20px] text-[#000000]">
//         Blog Deatils
//       </h2>

//       <div className="w-full h-150 flex justify-between gap-4">

//         {/* MEDIA */}
//         <div className="h-80 w-[70%] border border-[#3f3e3e] rounded-xl p-4">

//           <ImageResize
//             key={blog?.id}   
//             initialMedia={
//               blog?.blog_media?.[0]
//                 ? {
//                     media_url: blog.blog_media[0].media_url,
//                     media_type: blog.blog_media[0].media_type,
//                   }
//                 : undefined
//             }
//           />

//         </div>

//         {/* RIGHT SIDE */}
//         <div className="w-[30%] flex flex-col gap-4">

//           {/* CATEGORY */}
//           <div ref={dropdownRef} className="relative w-full">

//             <div
//               onClick={() => setOpen((prev) => !prev)}
//               className="border border-[#4C4C52] p-2 rounded-sm cursor-pointer font-normal text-sm text-[#000000bf] flex items-center justify-between"
//             >
//               <span className="truncate w-full">

//                 {selectedCategories.length > 0
//                   ? category
//                       .filter((c) =>
//                         selectedCategories.includes(Number(c.id))
//                       )
//                       .map((c) => c.name.replace(/_/g, " "))
//                       .join(", ")
//                   : "Please select categories"}

//               </span>

//               <ChevronDown size={14} color="#000000bf" />
//             </div>

//             {open && (
//               <div className="absolute z-50 mt-1 w-full bg-white border rounded-sm max-h-60 overflow-y-auto">

//                 {category.map((data) => (
//                   <label
//                     key={data.id}
//                     className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedCategories.includes(
//                         Number(data.id)
//                       )}
//                       onChange={() =>
//                         handleToggle(Number(data.id))
//                       }
//                     />
//                     {data.name.replace(/_/g, " ")}
//                   </label>
//                 ))}

//               </div>
//             )}
//           </div>

//           {/* TITLE */}
//           <Input
//             label={"Title"}
//             type={"text"}
//             value={title}
//             onChange={(e: any) => setTitle(e.target.value)}
//             placeholder={"Enter title"}
//           />

//           {/* READ TIME */}
//           <Input
//             label={"Read Time"}
//             type={"text"}
//             value={readTime}
//             onChange={(e: any) => setReadTime(e.target.value)}
//             placeholder={"Enter time"}
//             width={"w-[30%]"}
//           />

//         </div>
//       </div>

//       {/* TEXT EDITOR */}
//       <div>
//         <TextEditor setContent={setContent} content={content} />
//       </div>

//       {/* UPDATE */}
//       <button
//         onClick={updateBlog}
//         className="text-white rounded-sm w-30 px-2 py-3 bg-green-500 self-center cursor-pointer"
//       >
//         updated
//       </button>

//     </div>
//   );
// };

// export default page;











"use client";

import ImageResize from "@/components/ui/imageResize";
import Input from "@/components/ui/input";
import TextEditor from "@/components/ui/textArea";
import { useBlog } from "@/context/blogContext";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const mediaTypeMap: Record<string, string> = {
  IMAGE: "ARTICLE",
  VIDEO: "VIDEO",
  AUDIO: "AUDIO",
};

const page = () => {
  const { uuid } = useParams();

  const {
    blogs,
    category,
    fetchBlogs,
    media,
    setMedia,
  } = useBlog();

  const [title, setTitle] = useState("");
  const [readTime, setReadTime] = useState("");
  const [content, setContent] = useState("");

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  /* ================= FIND BLOG ================= */

  const blog = blogs.find(
    (b) =>
      b.uuid?.trim().toLowerCase() ===
      String(uuid)?.trim().toLowerCase()
  );

  /* ================= CATEGORY TOGGLE ================= */

  const handleToggle = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  /* ================= CLOSE DROPDOWN ================= */

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  /* ================= PREFILL BLOG ================= */

useEffect(() => {
  if (!blog) return;

  setTitle(blog.title || "");
  setReadTime(String(blog.readTime || ""));
  setContent(blog.description || "");

  /* ================= CATEGORY ================= */

  if (blog.blog_categories?.length) {
    const ids = blog.blog_categories.map((c: any) =>
      Number(c.mstr_categories?.id)
    );

    setSelectedCategories(ids);
  }

  /* ================= MEDIA ================= */

 if (blog.blog_media?.length > 0) {
  let mediaUrl = blog.blog_media[0].media_url;

  mediaUrl = decodeURIComponent(mediaUrl);

  /* extract ORIGINAL users/... file */
  const match = mediaUrl.match(
    /users\/\d+-[^?]+\.(jpg|jpeg|png|webp|mp4|mp3|mov)/i
  );

  if (match) {
    mediaUrl = `https://heyrmdy-dev.s3.us-east-2.amazonaws.com/${match[0]}`;
  }

  setMedia({
    media_url: mediaUrl,
    media_type: blog.blog_media[0].media_type,
    thumbnail_url:
      blog.blog_media[0].thumbnail_url || "",
  });
}
}, [blog, setMedia]);

  console.log(media)

  /* ================= UPDATE BLOG ================= */

  const updateBlog = async () => {
    const token = localStorage.getItem("token");

    /* ================= VALIDATIONS ================= */

    if (!media?.media_url) {
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
      const payload = {
        blog_id: String(blog?.id),

        type: media?.media_type
          ? mediaTypeMap[media.media_type] ||
            media.media_type
          : blog?.type || "ARTICLE",

        title,

        description: content,

        category: selectedCategories.map(String),

        media: [
          {
            media_url: media.media_url,
            media_type: media.media_type,
            thumbnail_url:
              media.thumbnail_url || "",
          },
        ],
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_DEV_URL}/blog/update-blog`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res.data);

      fetchBlogs();

      alert("updated");
    } catch (error: any) {
      console.log(error.response?.data || error);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <h2 className="font-inter font-medium text-[20px] text-[#000000]">
        Blog Deatils
      </h2>

      <div className="w-full h-150 flex justify-between gap-4">
        {/* ================= MEDIA ================= */}

        <div className="h-80 w-[70%] border border-[#3f3e3e] rounded-xl p-4">
          <ImageResize
    key={media?.media_url}
    initialMedia={
      media?.media_url
        ? {
            media_url: media.media_url,
            media_type: media.media_type,
            thumbnail_url: media.thumbnail_url || "",
          }
        : undefined
    }
  />
        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className="w-[30%] flex flex-col gap-4">
          {/* ================= CATEGORY ================= */}

          <div
            ref={dropdownRef}
            className="relative w-full"
          >
            <div
              onClick={() =>
                setOpen((prev) => !prev)
              }
              className="border border-[#4C4C52] p-2 rounded-sm cursor-pointer font-normal text-sm text-[#000000bf] flex items-center justify-between"
            >
              <span className="truncate w-full">
                {selectedCategories.length > 0
                  ? category
                      .filter((c) =>
                        selectedCategories.includes(
                          Number(c.id)
                        )
                      )
                      .map((c) =>
                        c.name.replace(/_/g, " ")
                      )
                      .join(", ")
                  : "Please select categories"}
              </span>

              <ChevronDown
                size={14}
                color="#000000bf"
              />
            </div>

            {open && (
              <div className="absolute z-50 mt-1 w-full bg-white border rounded-sm max-h-60 overflow-y-auto">
                {category.map((data) => (
                  <label
                    key={data.id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(
                        Number(data.id)
                      )}
                      onChange={() =>
                        handleToggle(
                          Number(data.id)
                        )
                      }
                    />

                    {data.name.replace(/_/g, " ")}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* ================= TITLE ================= */}

          <Input
            label={"Title"}
            type={"text"}
            value={title}
            onChange={(e: any) =>
              setTitle(e.target.value)
            }
            placeholder={"Enter title"}
          />

          {/* ================= READ TIME ================= */}

          <Input
            label={"Read Time"}
            type={"text"}
            value={readTime}
            onChange={(e: any) =>
              setReadTime(e.target.value)
            }
            placeholder={"Enter time"}
            width={"w-[30%]"}
          />
        </div>
      </div>

      {/* ================= TEXT EDITOR ================= */}

      <div>
        <TextEditor
          setContent={setContent}
          content={content}
        />
      </div>

      {/* ================= UPDATE BUTTON ================= */}

      <button
        onClick={updateBlog}
        className="text-white rounded-sm w-30 px-2 py-3 bg-green-500 self-center cursor-pointer"
      >
        updated
      </button>
    </div>
  );
};

export default page;