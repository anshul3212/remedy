"use client";

import FilterSelector from "@/components/ui/filter";
import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import toast from "react-hot-toast";

/* ================= TYPES ================= */

export interface BlogCategory {
  id: number;
  name: string;
  created_at: string;
  total_blogs: number;
}

export interface BlogMedia {
  id: string;
  blog_id: string;
  media_key: string;
  media_url: string;
  media_type: string;
  thumbnail_key: string;
  thumbnail_url: string;

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
  status: string;

  blog_categories: BlogCategory[];

  // blog_media: BlogMedia[];
}

/* ================= API BLOG ================= */

interface ApiBlog {
  id: string | number;

  uuid: string;

  type: string;

  title: string;

  description: string;
  status: string;
  read_time: number;

  updated_at: string;

  blog_categories: BlogCategory[];

  blog_media: BlogMedia[];
}

/* ================= MEDIA STATE ================= */

interface MediaState {
  media_url: string;
  thumbnail_url: string;
  media_type: string;
  thumbnail_key?: string;
  media_key?: string;
}

/* ================= PAGINATION ================= */

export interface Pagination {
  currentPage: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPrevPage: boolean;
}

/* ================= API RESPONSE ================= */

interface BlogResponse {
  message: string;

  blogs: ApiBlog[];

  pagination: Pagination;
}

/* ================= CONTEXT TYPE ================= */

interface BlogContextType {
  blogs: Blog[];

  category: BlogCategory[];

  setCategory: Dispatch<SetStateAction<BlogCategory[]>>;

  media: MediaState;

  setMedia: Dispatch<SetStateAction<MediaState>>;

  fetchBlogs: () => Promise<void>;
  fetchCategories: () => Promise<void>;

  loading: boolean;

  setLoading: Dispatch<SetStateAction<boolean>>;

  filter: "ALL" | "AUDIO" | "VIDEO" | "ARTICLE" | "OTHER" ;

  setFilter: React.Dispatch<
    React.SetStateAction<"ALL" | "AUDIO" | "VIDEO" | "ARTICLE" | "OTHER">
  >;

  /* ================= PAGINATION ================= */

  page: number;

  setPage: Dispatch<SetStateAction<number>>;

  limit: number;

  pagination: Pagination | null;
}

/* ================= CONTEXT ================= */

const BlogContext = createContext<BlogContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export function BlogProvider({ children }: { children: ReactNode }) {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const [category, setCategory] = useState<BlogCategory[]>([]);

  const [media, setMedia] = useState<MediaState>({
    media_url: "",
    media_key: "",
    thumbnail_key: "",
    media_type: "",
    thumbnail_url: "",
  });

  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState<
    "ALL" | "ARTICLE" | "VIDEO" | "AUDIO" | "OTHER"
  >("ALL");

  /* ================= PAGINATION ================= */

  const [page, setPage] = useState(1);

  const limit = 20;

  const [pagination, setPagination] = useState<Pagination | null>(null);

  /* ================= FETCH BLOGS ================= */

  const fetchBlogs = async (): Promise<void> => {
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin-token="))
        ?.split("=")[1];
      if (!token) return;
    try {
      setLoading(true);

    
      let url =`/api/getAllBlogs?page=${page}&limit=${limit}`

      if (filter&& filter!=="ALL") {
        url += `&type=${filter}`;
      }

      const res = await axios.get<BlogResponse>(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",
          },
        },
      );

      const formattedBlogs: Blog[] = res.data.blogs.map((b: ApiBlog) => ({
        id: Number(b.id),

        uuid: b.uuid,

        blog_categories: b.blog_categories || [],

        type: b.type,

        title: b.title,

        description: b.description,

        readTime: b.read_time,
        status: b.status,

        updatedAt: new Date(b.updated_at).toLocaleDateString(),
      }));

      setBlogs(formattedBlogs);

      /* ================= SET PAGINATION ================= */

      setPagination(res.data.pagination);
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


  /* ================= CATEGORIES ================= */

  const fetchCategories = async (): Promise<void> => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin-token="))
      ?.split("=")[1];
    if (!token) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_DEV_URL}/admin/blog/get-all-categories?page=1&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",
          },
        },
      );

      setCategory(res.data.data.categories);
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


  return (
    <BlogContext.Provider
      value={{
        blogs,

        category,

        fetchCategories,

        setCategory,

        media,

        setMedia,

        fetchBlogs,

        loading,

        setLoading,

        filter,

        setFilter,

        /* ================= PAGINATION ================= */

        page,

        setPage,

        limit,

        pagination,
      }}
    >
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
