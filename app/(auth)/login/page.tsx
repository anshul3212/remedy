"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

const LoginLeft = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const [checked, setChecked] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const payload = {
    email_id: email,
    password: password,
  };
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_DEV_AUTH_URL}/sign-in-admin`,
        payload,
      );
       
      localStorage.setItem("token", res.data.data.auth_key);
      setEmail("");
      setPassword("");
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside className=" flex flex-col items-center h-screen p-10 ">
      <div className="flex items-center justify-center ">
        <div className="relative w-40 h-40 rounded-full overflow-hidden">
          <Image
            src={"/logo.png"}
            alt="logo"
            fill
            className="object-cover absolute"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-8 md:mt-20 lg:mt-16 gap-10">
        <div className="flex flex-col items-center justify-center gap-2">
          <h3 className="font-medium  text-[#000000] text-lg">
            Welcome Back !
          </h3>
          <span className=" font-normal text-sm text-[#000000bf]">
            Sign in to continue to heyRMDY.
          </span>
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
              <label className=" font-normal text-sm text-[#0f0f0fbf] cursor-pointer">
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

          <Button text={"Log In"} onClick={handleLogin} />
        </form>

        {/* <div className="mt-4 pt-2 text-center">
          <div className="signin-other-title">
            <h5 className="font-size-14 mb-3 text-muted fw-medium">
              - Sign in with -
            </h5>
          </div>

          
        </div> */}

        <p className=" text-sm font-normal text-[#000000]">
          Don't have an account ?{" "}
          <Link href={"/register"} className="font-semibold text-[#3381F8]">
            Signup now
          </Link>
        </p>
      </div>
    </aside>
  );
};

export default LoginLeft;
