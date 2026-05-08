"use client";

import { useUser } from "@/context/userContext";
import { useParams } from "next/navigation";

const page = () => {
  const { uuid } = useParams(); 

  const { users } = useUser();

  const user = users.find(
    (u) => u.uuid.trim().toLowerCase() === String(uuid).trim().toLowerCase()
  );

  return (
    <div>
      {user ? <h1>{user.name}</h1> : <p>User not found</p>}
    </div>
  );
};

export default page;