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

export interface ReportUserProfile {
  user_name: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
}

export interface ReportUser {
  id: string;
  email_id: string;
  users_profile: ReportUserProfile | null;
}

/* ================= POSTS ================= */

export interface ReportedPost {
  id: string;
  title: string;
  description: string;
  created_at: string;

  users: ReportUser;

  channels: {
    id: string;
    name: string;
    description: string;
  } | null;

  post_reports: {
    id: string;
    reason: string;
    created_at: string;
    users: ReportUser;
  }[];

  _count: {
    post_reports: number;
  };
}

/* ================= COMMENTS ================= */

export interface ReportedComment {
  id: string;
  comment: string;
  created_at: string;

  users: ReportUser;

  posts: {
    id: string;
    title: string;
    description: string;
  };

  comment_reports: {
    id: string;
    reason: string;
    created_at: string;
    users: ReportUser;
  }[];

  _count: {
    comment_reports: number;
  };
}

/* ================= API RESPONSE ================= */

export interface ReportResponse {
  message: string;
  data: {
    posts: ReportedPost[];
    comments: ReportedComment[];
  };
}

/* ================= CONTEXT TYPE ================= */

interface ReportContextType {
  reportedPosts: ReportedPost[];
  reportedComments: ReportedComment[];

  loading: boolean;
  fetchReportedContent: () => Promise<void>;
}

/* ================= CONTEXT ================= */

const ReportContext = createContext<ReportContextType | undefined>(
  undefined
);

/* ================= PROVIDER ================= */

export function ReportedContentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [reportedPosts, setReportedPosts] = useState<
    ReportedPost[]
  >([]);
  const [reportedComments, setReportedComments] = useState<
    ReportedComment[]
  >([]);

  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */

  const fetchReportedContent = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await axios.get<ReportResponse>(
        "/api/getAllReportedContent",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setReportedPosts(res.data.data.posts || []);
      setReportedComments(res.data.data.comments || []);
    } catch (error) {
      console.log("Report fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedContent();
  }, []);

  return (
    <ReportContext.Provider
      value={{
        reportedPosts,
        reportedComments,
        loading,
        fetchReportedContent,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useReportedContent() {
  const ctx = useContext(ReportContext);

  if (!ctx) {
    throw new Error("useReportedContent must be used inside ReportedContentProvider");
  }

  return ctx;
}