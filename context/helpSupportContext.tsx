"use client";

import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import toast from "react-hot-toast";

/* ================= TYPES ================= */

export interface HelpSupport {
  id: number;

  user_id: number;

  description: string;

  created_at: string;

  updated_at: string;

  user: {
    email: string;

    name: string;

    user_name?: string;

    profile_image?: string | null;
  };
}

interface HelpSupportContextType {
  helps: HelpSupport[];

  totalHelps: number; 

  loading: boolean;

  /* PAGINATION */
  page: number;

  limit: number;

  totalPages: number;

  setPage: React.Dispatch<React.SetStateAction<number>>;
}

/* ================= CONTEXT ================= */

const HelpSupportContext = createContext<
  HelpSupportContextType | undefined
>(undefined);

/* ================= PROVIDER ================= */

export function HelpSupportProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [helps, setHelps] = useState<
    HelpSupport[]
  >([]);


  const [totalHelps, setTotalHelps] =
    useState(0);

  const [loading, setLoading] = useState(false);

  /* ================= PAGINATION ================= */

  const [page, setPage] = useState(1);

  const limit = 20;

  const totalPages = Math.ceil(
    totalHelps / limit
  );

  /* ================= FETCH DATA ================= */

  
    const fetchHelpData = async () => {
      try {
        setLoading(true);
        const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin-token="))
      ?.split("=")[1];
    if (!token) return;

        const res = await axios.get(
          `/api/getHelp?page=${page}&limit=${limit}`,
          {
          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",
          },
        },
        );

        const formattedHelps =
          res.data.helps.map((h: any) => ({
            id: Number(h.id),

            user_id: Number(h.user_id),

            description: h.description,

            created_at: new Date(
              h.created_at
            ).toLocaleDateString(),

            updated_at: h.updated_at,

            user: {
              email: h.users?.email_id,

              name: `${
                h.users?.users_profile
                  ?.first_name || ""
              } ${
                h.users?.users_profile
                  ?.last_name || ""
              }`,

              user_name:
                h.users?.users_profile
                  ?.user_name,

              profile_image:
                h.users?.users_profile
                  ?.profile_image || null,
            },
          }));

        setHelps(formattedHelps);

        setTotalHelps(
          res.data.pagination.total
        );
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


// useEffect(() => {
//     fetchHelpData();
//   }, [page]);

 


  
  /* ================= PROVIDER ================= */

  return (
    <HelpSupportContext.Provider
      value={{
        helps,


        totalHelps,

        loading,

        page,

        limit,

        totalPages,

        setPage,
      }}
    >
      {children}
    </HelpSupportContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useHelpSupport() {
  const ctx = useContext(
    HelpSupportContext
  );

  if (!ctx) {
    throw new Error(
      "useHelpSupport must be used inside HelpSupportProvider"
    );
  }

  return ctx;
}