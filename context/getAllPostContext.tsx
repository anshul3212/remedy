"use client";

import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import toast from "react-hot-toast";

/* ================= TYPES ================= */



export interface PostMedia {
  id: string;
  media_url: string;
  media_type: string;
}

export interface Post {
  id: string;
  post_type: string;
  channel_id: string | null;
  user_id: string;

  title: string;
  description: string;

  total_likes: string;
  total_dislikes: string;
  total_comments: string;

  is_edited: boolean;

  created_at: string;
  updated_at: string;
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

export interface PostResponse {
  message: string;
  post: Post[];
  pagination: Pagination;
}

/* ================= CONTEXT TYPE ================= */

interface PostContextType {
  posts: Post[];

  fetchPosts: (pageNumber?: number) => Promise<void>;

  loading: boolean;

  loadingMore: boolean;

  setLoading: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  /* ================= PAGINATION ================= */

  page: number;

  setPage: React.Dispatch<
    React.SetStateAction<number>
  >;

  limit: number;

  pagination: Pagination | null;

  hasNextPage: boolean;
}

/* ================= CONTEXT ================= */

const PostContext =
  createContext<PostContextType | undefined>(
    undefined
  );

/* ================= PROVIDER ================= */

export function PostProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [posts, setPosts] = useState<Post[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [loadingMore, setLoadingMore] =
    useState(false);

  /* ================= PAGINATION ================= */

  const [page, setPage] = useState(1);

  const limit = 20;

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  /* ================= FETCH POSTS ================= */

  const fetchPosts = async (
    pageNumber: number = 1
  ) => {
    const token = document.cookie
      .split("; ")
      .find((row) =>
        row.startsWith("admin-token=")
      )
      ?.split("=")[1];

    if (!token) return;

    try {
      /* ================= LOADING ================= */

      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      /* ================= API ================= */

      const res =
        await axios.get<PostResponse>(
          `/api/getAllPosts?page=${pageNumber}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

      const newPosts =
        res.data.post || [];

      /* ================= POSTS ================= */

      if (pageNumber === 1) {
        // First page → replace
        setPosts(newPosts);
      } else {
        // Next page → append
        setPosts((prev) => [
          ...prev,
          ...newPosts,
        ]);
      }

      /* ================= PAGINATION ================= */

      setPagination(
        res.data.pagination
      );

      setPage(pageNumber);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  /* ================= HAS NEXT PAGE ================= */

  const hasNextPage =
    pagination?.hasNextPage ?? true;

  return (
    <PostContext.Provider
      value={{
        posts,

        fetchPosts,

        loading,

        loadingMore,

        setLoading,

        page,

        setPage,

        limit,

        pagination,

        hasNextPage,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

/* ================= HOOK ================= */

export function usePost() {
  const ctx = useContext(PostContext);

  if (!ctx) {
    throw new Error(
      "usePost must be used inside PostProvider"
    );
  }

  return ctx;
}