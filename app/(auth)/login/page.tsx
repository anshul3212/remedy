"use client";

import Image from "next/image";

import {  useState } from "react";
import Input from "@/components/ui/input";

import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

const LoginLeft = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
 
  const [checked, setChecked] = useState(false);


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isDisabled = !email.trim() || !password.trim();


  const payload = {
    email_id: email,
    password: password,
  };
  

const handleLogin = async () => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_DEV_AUTH_URL}/sign-in-admin`,
      payload
    );


    const token = res.data.data.auth_key;

    /* ================= COOKIE EXPIRY ================= */

    if (checked) {
      // 30 days
      const expiryDate = new Date();

      expiryDate.setDate(
        expiryDate.getDate() + 30
      );

      document.cookie = `token=${token}; path=/; expires=${expiryDate.toUTCString()}`;
    } else {
      // Session cookie
      document.cookie = `token=${token}; path=/`;
    }

    /* ================= LOCAL STORAGE ================= */

    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "user_name",
      res.data.data.full_name
    );

    localStorage.setItem(
      "user_image",
      res.data.data.profile_image
    );

    /* ================= RESET ================= */

    setEmail("");

    setPassword("");

    /* ================= REDIRECT ================= */

    router.push("/users");
  } catch (error) {
    alert("invalid email or password");

    console.log(error);
  }
};


  return (
    <aside className=" flex justify-between h-full items-center relative overflow-hidden gap-4 rounded-xl ">
      <div className=" w-full flex flex-col gap-8 items-center justify-center">
<div className="relative w-30 h-30 rounded-full overflow-hidden">
          <Image
            src={"/logo.png"}
            alt="logo"
            fill
            className="object-cover absolute"
          />
        </div>
        <div className="flex flex-col text-white">
        <h1 className="font-inter text-5xl font-bold leading-6.5 tracking-widest">Welcome!</h1>
        <div>
        <h1 className="font-inter text-5xl font-bold px-20 tracking-widest">to heyRMDY</h1>
        </div>
        </div>
      </div>
      
      <div className="bg-[white] p-4 rounded-xl h-full flex flex-col items-center justify-center">
      <div className="flex items-center justify-center">
        {/* <div className="relative w-20 h-20 rounded-full overflow-hidden">
          <Image
            src={"/logo.png"}
            alt="logo"
            fill
            className="object-cover absolute"
          />
        </div> */}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <h3 className="font-medium  text-[#000000] text-5xl">
            Sign In
          </h3>
        </div>

        <form
          className="flex flex-col gap-6 w-75 lg:w-100 md:w-125"
          onSubmit={(e) => e.preventDefault()}
        >
          <Input
            label={"Email Address"}
            type={"email"}
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            placeholder={"Enter email address"}
          />

          <div className="flex flex-col gap-3 justify-center">
            <div className="flex items-center justify-between">
              <label className=" font-medium text-sm text-[#000000] ">
                Password
              </label>
              <label className=" font-normal text-sm text-[#0f0f0fbf] cursor-pointer" onClick={()=>router.push("/forget-password")}>
                Forgot password?
              </label>
            </div>
            <div className="flex items-center">
              <input
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type={`${visible ? "text" : "password"}`}
                className=" font-normal text-sm text-[#000000bf] border border-[#4C4C52] rounded-l-sm outline-none w-full h-10 pl-4"
              />
              <div
                className="border-[#4C4C52] border w-12 h-10 flex items-center justify-center border-l-0 rounded-r-sm cursor-pointer"
                onClick={() => setVisible((prev) => !prev)}
              >
                {!visible ? (
                  <Eye color="#000" size={20} />
                ) : (
                  <EyeOff color="#000" size={20} />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-start gap-2">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => setChecked((prev) => !prev)}
              className="appearance-none w-5 h-5 bg-[#e0dddd] border border-[#4C4C52] rounded-sm cursor-pointer
                   checked:bg-[#4C4C52] checked:border-[#4C4C52]
                   relative flex items-center justify-center
                   before:content-['✓'] before:text-white before:text-sm before:opacity-0
                   checked:before:opacity-100 transition-all duration-200"
            />
            <label className=" font-medium text-sm text-[#000000] ">
              Remember me
            </label>
          </div>

          
<button
type="submit"
        className={`bg-[linear-gradient(280.07deg,#A34E25_0%,#734C82_65%,#522762_100%)] w-full text-[#ffffff] h-10 rounded-sm fontr-inter  font-normal text-lg cursor-pointer transition-all duration-300 ${
    isDisabled
      ? "opacity-50 cursor-not-allowed"
      : "opacity-100 cursor-pointer"
  }`}
        onClick={handleLogin}
      >
        Sign In
      </button>
        </form>

       
      </div>
      </div>
    </aside>
  );
};

export default LoginLeft;
