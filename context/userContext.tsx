

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

  selectedUser: User | null;

  selectUser: (id: number) => void;

  clearSelected: () => void;

  addUser: (user: User) => void;

  removeUser: (id: number) => void;

  updateUser: (user: User) => void;

  totalUsers: number;

  loading: boolean;

  /* ✅ PAGINATION */
  page: number;
  limit: number;
  totalPages: number;

  setPage: React.Dispatch<React.SetStateAction<number>>;
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

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [totalUsers, setTotalUsers] = useState(0);

  const [loading, setLoading] = useState(false);

  /* ================= PAGINATION ================= */

  const [page, setPage] = useState(1);

  const limit = 20;

  const totalPages = Math.ceil(totalUsers / limit);

  /* ================= FETCH USERS ================= */

  useEffect(() => {
    const usersData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `/api/getAllUsers?page=${page}&limit=${limit}`
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

        /* ✅ FIX */
        setTotalUsers(
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

    usersData();
  }, [page]);

  /* ---------- CRUD ---------- */

  const addUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
  };

  const removeUser = (id: number) => {
    setUsers((prev) =>
      prev.filter((u) => u.id !== id)
    );

    setSelectedUser((prev) =>
      prev?.id === id ? null : prev
    );
  };

  const updateUser = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === updatedUser.id
          ? updatedUser
          : u
      )
    );

    setSelectedUser((prev) =>
      prev?.id === updatedUser.id
        ? updatedUser
        : prev
    );
  };

  /* ---------- SELECT ---------- */

  const selectUser = (id: number) => {
    const found =
      users.find((u) => u.id === id) || null;

    setSelectedUser(found);
  };

  const clearSelected = () =>
    setSelectedUser(null);

  /* ---------- PROVIDER ---------- */

  return (
    <UserContext.Provider
      value={{
        users,

        totalUsers,

        loading,

        selectedUser,

        selectUser,

        clearSelected,

        addUser,

        removeUser,

        updateUser,

        /* ✅ PAGINATION */
        page,
        limit,
        totalPages,
        setPage,
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