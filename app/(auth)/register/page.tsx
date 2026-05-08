"use client";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

const SignUpLeft = () => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <aside className="flex flex-col items-center h-screen p-10 ">
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
            Register Account
          </h3>
          <span className=" font-normal text-sm text-[#000000bf]">
            Sign up to continue to heyRMDY.
          </span>
        </div>

        <form className="flex flex-col gap-6  w-75 lg:w-100 md:w-125">
          <Input
            label={"Email Address"}
            type={"email"}
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            placeholder={"Enter email address"}
          />

          {/* Password */}
          <div className="flex flex-col gap-3 justify-center">
            <div className="flex items-center justify-between">
              <label className=" font-medium text-sm text-[#000000] ">
                Password
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

          <span className=" text-sm font-normal text-[#000000]">
            By registering you agree to the heyRMDY{" "}
            <span className="cursor-pointer text-[#3381F8]">Terms of Use</span>
          </span>

          <Button text={"Register"} />
        </form>

        <p className=" text-sm font-normal text-[#000000]">
          Already have an account ?{" "}
          <Link href={"/login"} className="font-semibold text-[#3381F8]">
            Login
          </Link>
        </p>
      </div>
    </aside>
  );
};

export default SignUpLeft;
