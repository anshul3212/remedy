import AuthTestimonails from "@/components/common/authTestimonials";


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <>
    <div className="flex">
        <div className="w-full lg:w-[30%] h-full">
            {children}
        </div>
        <div className="w-full hidden lg:block">
            <AuthTestimonails/>
        </div>
    </div>    
    </>
  );
}