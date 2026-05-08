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

export interface ReportedPost {
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

  // post owner
  users: User;

  // channel info
  channels: Channel | null;

  // post media
  post_media: PostMedia[];

  // all reports
  post_reports: PostReport[];

  // report count
  _count: ReportCount;
}

export interface ReportResponse {
  message: string;
  post: ReportedPost[];
}

/* ================= CONTEXT TYPE ================= */

interface ReportContextType {
  reportedPosts: ReportedPost[];
  fetchReportedPosts: () => Promise<void>;
  loading: boolean;
  setLoading: any;
}

/* ================= CONTEXT ================= */

const ReportContext = createContext<ReportContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export function ReportProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [reportedPosts, setReportedPosts] = useState<ReportedPost[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH REPORTS ================= */

  const fetchReportedPosts = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:3000/api/getAllReportedPosts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    //   console.log(res.data);

      setReportedPosts(res.data.post || []);
    } catch (error) {
      console.log("Reported posts fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= USE EFFECT ================= */

  useEffect(() => {
    fetchReportedPosts();
  }, []);

  return (
    <ReportContext.Provider
      value={{
        reportedPosts,
        fetchReportedPosts,
        loading,
        setLoading,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useReport() {
  const ctx = useContext(ReportContext);

  if (!ctx) {
    throw new Error("useReport must be used inside ReportProvider");
  }

  return ctx;
}