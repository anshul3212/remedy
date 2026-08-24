"use client";

import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [visible, setVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const maskEmail = (email: string) => {
    if (!email.includes("@")) return email;

    const [name, domain] = email.split("@");

    if (name.length <= 2) {
      return `${name[0]}xxxx@${domain}`;
    }

    return `${"x".repeat(
      Math.max(name.length - 2, 1),
    )}${name.slice(-2)}@${domain}`;
  };

  const passwordValidation = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const isStrongPassword =
    passwordValidation.length &&
    passwordValidation.uppercase &&
    passwordValidation.lowercase &&
    passwordValidation.number &&
    passwordValidation.special;

  const isStep1Disabled = !email.trim() || sendingOtp;

  const isStep2Disabled = !email.trim() || !otp.trim() || verifyingOtp;

  const isStep3Disabled =
    !isStrongPassword ||
    password !== confirmPassword ||
    !password ||
    !confirmPassword ||
    resettingPassword;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [countdown]);

  const forgetPassword = async () => {
  if (!email.trim()) return;

  try {
    setSendingOtp(true);

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_DEV_URL}/admin/user/forgot-password`,
      { email_id : email }
    );

    if (!res.data.success) {
      toast.error(res.data.message || "Invalid email");
      return false;
    }

    toast.success("OTP send successfully");

    setStep(2);

    return true;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.error?.message ||
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    toast.error(errorMessage);

    return false;
  } finally {
    setSendingOtp(false);
  }
};

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    const success = await forgetPassword();

    if (success) {
      setCountdown(30);
    }
  };

  const verifyOtp = async () => {
    if (!email.trim()) return;
    if (!otp.trim()) return;

    try {
      setVerifyingOtp(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_DEV_URL}/admin/user/verify-email-code`,
        { email_id:email, code:otp },
      );
      toast.success("OTP verified");
      /* ================= REDIRECT ================= */
      setStep(3);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(errorMessage);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const resetPassword = async () => {
    try {
      setResettingPassword(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_DEV_URL}/admin/user/reset-password`,
        { email_id:email,new_password:password }
      );
      setEmail("");
      setOtp("");
      toast.success("password changed successfully");
      /* ================= REDIRECT ================= */
      router.push("/login");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(errorMessage);
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <div className="flex justify-between h-full items-center relative overflow-hidden gap-4 rounded-xl font-inter">
      <div className=" w-full flex flex-col gap-8 items-center justify-center">
        <div className="relative w-25 h-25 rounded-full overflow-hidden">
          <Image
            src={"/logo.png"}
            alt="logo"
            fill
            className="object-cover absolute"
          />
        </div>
        <div className="flex flex-col text-white">
          <h1 className="font-inter text-5xl font-bold leading-6.5 tracking-widest">
            Welcome!
          </h1>
          <div>
            <h1 className="font-inter text-5xl font-bold px-20 tracking-widest">
              to heyRMDY
            </h1>
          </div>
        </div>
      </div>
      <div className=" h-full p-4 w-[70%] bg-white rounded-xl flex flex-col gap-4 justify-center">
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h1 className="text-3xl font-bold text-center text-[#333] ">
              Forgot Password
            </h1>

            <p className="text-center text-[#747474] ">
              Enter your email address to receive an OTP.
            </p>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#333]">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4  border rounded-lg outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <button
              disabled={isStep1Disabled || sendingOtp || !email.trim()}
              onClick={forgetPassword}
              className={`w-full h-12  rounded-lg bg-[#8B5CF6] text-white font-medium cursor-pointer ${
                isStep1Disabled || sendingOtp || !email.trim() ? "opacity-50" : "opactity-100"
              }`}
            >
              {sendingOtp ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h1 className="text-3xl font-bold text-center text-[#333]">
              Verify OTP
            </h1>

            <p className="text-center text-[#747474] ">We sent an OTP to</p>

            <p className="text-center font-semibold text-[#333] ">
              {maskEmail(email)}
            </p>

            <button
              onClick={() => setStep(1)}
              className="block mx-auto  text-sm text-[#8B5CF6] cursor-pointer"
            >
              Not your email?
            </button>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#333]">
                  Enter OTP
                </label>
                <button
                  onClick={handleResendOtp}
                  disabled={countdown > 0}
                  className={`text-sm font-medium ${
                    countdown > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#333] cursor-pointer"
                  }`}
                >
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                </button>
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full h-12 px-4  border rounded-lg outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <button
              onClick={verifyOtp}
              disabled={isStep2Disabled || verifyingOtp || (!email.trim() && !otp.trim())}
              className={`w-full h-12  rounded-lg bg-[#8B5CF6] text-white font-medium cursor-pointer ${
                isStep2Disabled || verifyingOtp || (!email.trim() && !otp.trim()) ? "opacity-50" : "opactity-100"
              }`}
            >
              { verifyingOtp ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h1 className="text-3xl font-bold text-center text-[#333]">
              Create New Password
            </h1>

            <p className="text-center text-[#747474] ">
              Enter your new password below.
            </p>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-[#333]">
                  New Password
                </label>


                <div className="flex items-center">
                <input
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type={`${visible ? "text" : "password"}`}
                  className="w-full h-12 px-4  border border-r-0 rounded-l-lg outline-none pl-4"
                />
                <div
                  className="border w-12 h-12 flex items-center justify-center border-l rounded-r-lg cursor-pointer"
                  onClick={() => setVisible((prev) => !prev)}
                >
                  {!visible ? (
                    <Eye color="#000" size={20} />
                  ) : (
                    <EyeOff color="#000" size={20} />
                  )}
                </div>
              </div>

                <div className=" text-xs flex flex-col gap-1 mt-2">
                  <p
                    className={
                      passwordValidation.length
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    ✓ Minimum 8 characters
                  </p>

                  <p
                    className={
                      passwordValidation.uppercase
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    ✓ One uppercase letter
                  </p>

                  <p
                    className={
                      passwordValidation.lowercase
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    ✓ One lowercase letter
                  </p>

                  <p
                    className={
                      passwordValidation.number
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    ✓ One number
                  </p>

                  <p
                    className={
                      passwordValidation.special
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    ✓ One special character
                  </p>
                </div>
              </div>

              <div>
                 <div className="flex items-center">
                <input
                  required
                  placeholder="Enter password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                  type={`${confirmVisible ? "text" : "password"}`}
                  className="w-full h-12 px-4  border border-r-0 rounded-l-lg outline-none pl-4"
                />
                <div
                  className="border w-12 h-12 flex items-center justify-center border-l rounded-r-lg cursor-pointer"
                  onClick={() => setConfirmVisible((prev) => !prev)}
                >
                  {!confirmVisible ? (
                    <Eye color="#000" size={20} />
                  ) : (
                    <EyeOff color="#000" size={20} />
                  )}
                </div>
              </div>

                {confirmPassword && password !== confirmPassword && (
                  <p className="text-red-500 text-xs ">
                    Passwords do not match
                  </p>
                )}
              </div>
            </div>



            <button
              disabled={isStep3Disabled || resettingPassword || (!password.trim() && !confirmPassword.trim())}
              onClick={resetPassword}
              className={`w-full h-12  rounded-lg bg-[#8B5CF6] text-white font-medium cursor-pointer ${
                isStep3Disabled || resettingPassword || (!password.trim() && !confirmPassword.trim())? "opacity-50" : "opactity-100"
              }`}
            >
              {resettingPassword ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
