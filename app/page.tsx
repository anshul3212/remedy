"use client"

import { useRouter } from "next/navigation";

const page = () => {

  const router = useRouter();
  return (
    <div>
      {/* bg-linear-to-l from-[#A34E25] via-[#734C82] to-[#522762] */}
      <div className="flex items-center justify-center mt-10">
        <button className="px-8 py-6 bg-[#3f013a] text-lg text-white cursor-pointer" onClick={()=>{router.push("/login")}}>login</button>
      </div>
    </div>
  );
}

export default page;