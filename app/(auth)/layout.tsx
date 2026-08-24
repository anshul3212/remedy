import { Toaster } from "react-hot-toast";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <div className="relative flex w-screen h-screen items-center justify-center overflow-hidden bg-[linear-gradient(280.07deg,#A34E25_0%,#734C82_65%,#522762_100%)]">

      {/* Blur Glow Effects */}
      <div className="absolute -top-30 -left-30 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      <div className="absolute -bottom-37.5 -right-30 w-125 h-125 bg-pink-400/10 rounded-full blur-3xl" />

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-5xl mx-6 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden h-[70%]">
        {children}
      </div>
      <Toaster/>
    </div>
  );
}