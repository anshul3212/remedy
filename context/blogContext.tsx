"use client";

import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

/* ================= TYPES ================= */

export interface BlogCategory {
  id: number;
  name: string;
  created_at:string;
  total_blogs:string;
}
export interface BlogMedia {
  id: string;
  blog_id: string;

  media_url: string;
  media_type: string;

  thumbnail_url: string | null;

  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: number;
  uuid: string;
  type: string;
  title: string;
  description: string;
  readTime: number;
  updatedAt: string;
  blog_categories: BlogCategory[];
  blog_media: BlogMedia[];
}


/* ================= CONTEXT TYPE ================= */

interface BlogContextType {
  blogs: Blog[];
  category: BlogCategory[];
  setCategory:any;
  categories:any;
  media:  any;
  setMedia:any;
  fetchBlogs:any;
  loading:boolean;
  setLoading:any;
}

/* ================= CONTEXT ================= */

const BlogContext = createContext<BlogContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export function BlogProvider({ children }: { children: ReactNode }) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [category, setCategory] = useState<BlogCategory[]>([]);
  const [media, setMedia] = useState({
  media_url: "",
  media_type: "",
});
const [loading, setLoading] = useState(false);

    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const res = await axios.get("/api/getAllBlogs");

        const formattedBlogs: Blog[] = res.data.blogs.map((b: any) => ({
          id: Number(b.id),
          uuid: b.uuid,
          blog_media: b.blog_media || [], 
          blog_categories: b.blog_categories || [],
          type: b.type,
          title: b.title,
          description: b.description,
          readTime: b.read_time,
          updatedAt: new Date(b.updated_at).toLocaleDateString(),
        }));
        setBlogs(formattedBlogs);
        setLoading(false)
      } catch (error) {
        console.log("Blog fetch error:", error);
      }
    };

    useEffect(()=>{fetchBlogs()},[])
  
  const categories = async () => {
      const token = localStorage.getItem("token");
      try {
        setLoading(true)
        const res = await axios.get(
          `http://3.13.92.66/api/v1/admin/blog/get-all-categories?page=1&limit=50`,{
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
        );
        setCategory(res.data.data.categories);
        setLoading(false);
      } catch (error) {
        console.log("Category fetch error:", error);
      }
    };

  useEffect(() => {
    
    categories();
  }, []);

  return (
    <BlogContext.Provider value={{ blogs, category, setCategory,categories, media ,setMedia,fetchBlogs,loading,setLoading }}>
      {children}
    </BlogContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useBlog() {
  const ctx = useContext(BlogContext);
  if (!ctx) {
    throw new Error("useBlog must be used inside BlogProvider");
  }
  return ctx;
}