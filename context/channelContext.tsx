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

export interface ChannelMemberUserProfile {
  user_name: string | null;
}

export interface ChannelMemberUser {
  users_profile: ChannelMemberUserProfile | null;
}

export interface ChannelMember {
  users: ChannelMemberUser;
}

export interface ChannelCount {
  posts: number;
}

export interface Channel {
  id: string;
  created_by: string;
  name: string;
  user_name: string | null;
  image: string | null;
  channel_type: string;
  description: string;
  category_id: string | null;
  total_members: string;
  created_at: string;
  updated_at: string;
  users:any;
  channel_members: ChannelMember[];

  _count: ChannelCount;
}

/* ================= PAGINATION ================= */

export interface Pagination {
  totalChannels: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ChannelResponse {
  message: string;

  channels: Channel[];

  pagination: Pagination;
}

/* ================= CONTEXT TYPE ================= */

interface ChannelContextType {
  channels: Channel[];

  fetchChannels: () => Promise<void>;

  loading: boolean;

  setLoading: (val: boolean) => void;

  /* ✅ PAGINATION */

  page: number;

  setPage: React.Dispatch<
    React.SetStateAction<number>
  >;

  limit: number;

  totalPages: number;

  totalChannels: number;
}

/* ================= CONTEXT ================= */

const ChannelContext =
  createContext<ChannelContextType | undefined>(
    undefined
  );

/* ================= PROVIDER ================= */

export function ChannelProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [channels, setChannels] = useState<
    Channel[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  /* ================= PAGINATION ================= */

  const [page, setPage] = useState(1);

  const [totalChannels, setTotalChannels] =
    useState(0);

  const limit = 20;

  const totalPages = Math.ceil(
    totalChannels / limit
  );

  /* ================= FETCH CHANNELS ================= */

  const fetchChannels = async () => {
    const token = localStorage.getItem(
      "token"
    );

    try {
      setLoading(true);

      const res =
        await axios.get<ChannelResponse>(
          `/api/getAllChannels?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

      setChannels(res.data.channels || []);

      /* ✅ PAGINATION */
      setTotalChannels(
        res.data.pagination.totalChannels
      );
    } catch (error) {
      console.log(
        "Channel fetch error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= INIT ================= */

  useEffect(() => {
    fetchChannels();
  }, [page]);

  return (
    <ChannelContext.Provider
      value={{
        channels,

        fetchChannels,

        loading,

        setLoading,

        /* ✅ PAGINATION */
        page,
        setPage,
        limit,
        totalPages,
        totalChannels,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useChannel() {
  const ctx = useContext(ChannelContext);

  if (!ctx) {
    throw new Error(
      "useChannel must be used inside ChannelProvider"
    );
  }

  return ctx;
}