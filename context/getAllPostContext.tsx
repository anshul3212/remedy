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

export interface UserProfile {
  user_name: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
}

export interface User {
  id: string;
  email_id: string;
  users_profile: UserProfile | null;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
}

export interface PostMedia {
  id: string;
  media_url: string;
  media_type: string;
}

export interface PostReport {
  id: string;
  post_id: string;
  user_id: string;
  reason: string;
  created_at: string;
  users: User;
}

export interface ReportCount {
  post_reports: number;
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

  users: User;
  channels: Channel | null;
  post_media: PostMedia[];
  post_reports: PostReport[];
  _count: ReportCount;
}

/* ================= API RESPONSE ================= */

export interface PostResponse {
  message: string;
  post: Post[];
}

/* ================= CONTEXT TYPE ================= */

interface PostContextType {
  posts: Post[];
  fetchPosts: () => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

/* ================= CONTEXT ================= */

const PostContext = createContext<PostContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export function PostProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH POSTS ================= */

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await axios.get<PostResponse>(
        "/api/getAllPosts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPosts(res.data.post || []);
    } catch (error) {
      console.log("Post fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider
      value={{
        posts,
        fetchPosts,
        loading,
        setLoading,
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
    throw new Error("usePost must be used inside PostProvider");
  }

  return ctx;
}