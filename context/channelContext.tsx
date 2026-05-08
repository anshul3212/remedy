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
  description: string;
  category_id: string | null;
  total_members: string; // coming as string in API
  created_at: string;
  updated_at: string;

  channel_members: ChannelMember[];

  _count: ChannelCount;
}

export interface ChannelResponse {
  message: string;
  channels: Channel[];

}

/* ================= CONTEXT TYPE ================= */

interface ChannelContextType {
  channels: Channel[];
  fetchChannels: () => Promise<void>;
  loading: boolean;
  setLoading: (val: boolean) => void;
}

/* ================= CONTEXT ================= */

const ChannelContext = createContext<ChannelContextType | undefined>(
  undefined
);

/* ================= PROVIDER ================= */

export function ChannelProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH CHANNELS ================= */

  const fetchChannels = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await axios.get<ChannelResponse>(
        "http://localhost:3000/api/getAllChannels",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      setChannels(res.data.channels || []);
      setLoading(false);
    } catch (error) {
      console.log("Channel fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INIT ================= */

  useEffect(() => {
    fetchChannels();
  }, []);

  return (
    <ChannelContext.Provider
      value={{
        channels,
        fetchChannels,
        loading,
        setLoading,
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
    throw new Error("useChannel must be used inside ChannelProvider");
  }

  return ctx;
}