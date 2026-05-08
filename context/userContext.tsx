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

export interface User {
  id: number;
  uuid: string;
  name?: string;
  email?: string;
  condition?: string;
  status?: "active" | "inactive";
  joined?: string;
}



interface UserContextType {
  users: User[];
  selectedUser: User | null;
  selectUser: (id: number) => void;
  clearSelected: () => void;
  addUser: (user: User) => void;
  removeUser: (id: number) => void;
  updateUser: (user: User) => void;
  totalUsers:number;
}

/* ================= CONTEXT ================= */

const UserContext = createContext<UserContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);

  
   useEffect(() => {
  const usersData = async () => {
    try {
      const res = await axios.get("/api/getAllUsers");
      const formattedUsers = res.data.users.map((u: any) => ({
      id: Number(u.id),
      uuid: u.uuid,
      email: u.email_id,
      name: `${u.users_profile?.first_name} ${u.users_profile?.last_name}`,
      condition: "NAN", 
      status: u.is_active ? "active" : "inactive",
      joined: new Date(u.created_at).toLocaleDateString(),
    }));

      setUsers(formattedUsers);
      setTotalUsers(res.data.totalUsers);

    } catch (error: any) {
      console.log(error);
    }
  };

  usersData();
}, []);
  /* ---------- CRUD ---------- */

  const addUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
  };

  const removeUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));

    // if deleted user is selected → clear
    setSelectedUser((prev) => (prev?.id === id ? null : prev));
  };

  const updateUser = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );

    // keep selected user in sync
    setSelectedUser((prev) =>
      prev?.id === updatedUser.id ? updatedUser : prev
    );
  };

  /* ---------- SELECT ---------- */

  const selectUser = (id: number) => {
    const found = users.find((u) => u.id === id) || null;
    setSelectedUser(found);
  };

  const clearSelected = () => setSelectedUser(null);

  /* ---------- PROVIDER ---------- */

  return (
    <UserContext.Provider
      value={{
        users,
        totalUsers,
        selectedUser,
        selectUser,
        clearSelected,
        addUser,
        removeUser,
        updateUser,
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
    throw new Error("useUser must be used inside UserProvider");
  }
  return ctx;
}