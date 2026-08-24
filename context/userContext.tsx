

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

export interface User {
  id: number;
  uuid: string;
  name?: string;
  email?: string;
  condition?: string;
  status?: "active" | "inactive";
  joined?: string;
  profile_image?: string;
}

interface UserContextType {
  users: User[];
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchUsers: () => Promise<void>;

  /* ✅ PAGINATION */
  page: number;
  total: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  totalPages: number;
}

/* ================= CONTEXT ================= */

const UserContext = createContext<UserContextType | undefined>(
  undefined
);

/* ================= PROVIDER ================= */

export function UserProvider({
  children,
}: {
  children: ReactNode;
}) {
    const [users, setUsers] = useState<User[]>([]);

  

  const [loading, setLoading] = useState(false);

  /* ================= PAGINATION ================= */
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);

  const limit = 20;

  const totalPages = Math.ceil(total / limit);

  /* ================= FETCH USERS ================= */

    const fetchUsers= async () => {
      try {
        setLoading(true);
        const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin-token="))
      ?.split("=")[1];
    if (!token) return;

        const res = await axios.get(
          `/api/getAllUsers?page=${page}&limit=${limit}`,
          {
          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",
          },
        },
        );


        const formattedUsers = res.data.users.map(
          (u: any) => ({
            id: Number(u.id),

            uuid: u.uuid,

            email: u.email_id,

            name: `${u.users_profile?.first_name || ""} ${
              u.users_profile?.last_name || ""
            }`,

            condition: "NAN",

            status: u.is_active
              ? "active"
              : "inactive",

            joined: new Date(
              u.created_at
            ).toLocaleDateString(),

            profile_image:
              u.users_profile?.profile_image,
          })
        );

        setUsers(formattedUsers);
        setTotal(
          res.data.pagination.totalUsers
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

  /* ---------- PROVIDER ---------- */

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        setLoading,
        fetchUsers,


        /* ✅ PAGINATION */
        page,
        limit,
        totalPages,
        setPage,
        total
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useUser() {
  const ctx = useContext(UserContext);

  if (!ctx) {
    throw new Error(
      "useUser must be used inside UserProvider"
    );
  }

  return ctx;
}