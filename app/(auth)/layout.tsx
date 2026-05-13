
// export default function AuthLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <div className="relative flex w-screen h-screen items-center justify-center px-30 overflow-hidden bg-gradient-to-br from-slate-900 via-gray-800 to-slate-700">

//       {/* Background Blur Circles */}
//       <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-cyan-500/30 rounded-full blur-3xl" />
      
//       <div className="absolute bottom-[-120px] right-[-100px] w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />

//       {/* Glass Container */}
//       <div className="relative z-10 w-full h-[80%] rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
//         {children}
//       </div>
//     </div>
//   );
// }


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
    </div>
  );
}

// import AuthTestimonails from "@/components/common/authTestimonials";

// export default function AuthLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <div className="relative w-full min-h-screen overflow-hidden">
      
//       {/* Background Testimonials */}
//       <div className="absolute inset-0">
//         <AuthTestimonails />
//       </div>

//       {/* Dark Overlay */}
//       <div className="absolute inset-0 bg-black/40 z-10" />

//       {/* Center Login Card */}
//       <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
//         <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }