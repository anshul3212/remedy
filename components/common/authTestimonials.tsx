// "use client";

// import Image from "next/image";
// import { useState, useEffect } from "react";

// interface TextSlide {
//   id: number;
//   text: string;
// }

// const AuthTestimonails = () => {
//   const textSlides: TextSlide[] = [
//     {
//       id: 1,
//       text: `“I feel confident imposing change on myself. It's a lot more progressing fun than looking back. That's why I ultricies enim at malesuada nibh diam on tortor neaded to throw curve balls.”`,
//     },
//     {
//       id: 2,
//       text: `“I feel confident imposing change on myself. It's a lot more progressing fun than looking back. That's why I ultricies enim at malesuada nibh diam on tortor neaded to throw curve balls.”`,
//     },
//     {
//       id: 3,
//       text: `“I feel confident imposing change on myself. It's a lot more progressing fun than looking back. That's why I ultricies enim at malesuada nibh diam on tortor neaded to throw curve balls.”`,
//     },
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIsAnimating(true);
//       setTimeout(() => {
//         setCurrentIndex((prevIndex) => (prevIndex + 1) % textSlides.length);
//         setIsAnimating(false);
//       }, 500);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [textSlides.length]);

//   const handleDotClick = (index: number) => {
//     setIsAnimating(true);
//     setTimeout(() => {
//       setCurrentIndex(index);
//       setIsAnimating(false);
//     }, 500);
//   };
 
//   return (
//     <aside className="bg-[linear-gradient(134.68deg,#05B7CE_14.12%,#06B2CC_15.75%,#1B5DB2_41.2%,#2828A1_59.62%,#2D139B_68.28%)] flex flex-col  justify-center h-screen ">
//       {/* Main Text Container */}
//       <div className="flex flex-col gap-10 px-20">
//         {/* SVG */}
//         <div>
//           <svg
//             width="40"
//             height="40"
//             viewBox="0 0 40 40"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M7.60156 16.1797C7.41927 16.1797 7.23698 16.1862 7.05469 16.1992C6.8724 16.2122 6.70312 16.2318 6.54688 16.2578C6.59896 16.0755 6.65755 15.8867 6.72266 15.6914C6.78776 15.4961 6.85938 15.3073 6.9375 15.125C7.04167 14.8906 7.16536 14.6562 7.30859 14.4219C7.45182 14.1875 7.58854 13.9531 7.71875 13.7188C7.84896 13.4844 8.01172 13.276 8.20703 13.0938C8.40234 12.9115 8.57812 12.7161 8.73438 12.5078C8.91667 12.2995 9.11198 12.1237 9.32031 11.9805C9.52865 11.8372 9.72396 11.6745 9.90625 11.4922C10.0625 11.3099 10.2513 11.1667 10.4727 11.0625C10.694 10.9583 10.8958 10.8411 11.0781 10.7109C11.2865 10.6068 11.4753 10.5026 11.6445 10.3984C11.8138 10.2943 11.9896 10.2161 12.1719 10.1641C12.3281 10.0859 12.4844 10.0143 12.6406 9.94922C12.7969 9.88412 12.9401 9.82552 13.0703 9.77344C13.3047 9.66927 13.4935 9.59115 13.6367 9.53906C13.7799 9.48698 13.8516 9.46094 13.8516 9.46094L13.0312 6.21875C13.0312 6.21875 12.9466 6.23828 12.7773 6.27734C12.6081 6.31641 12.3672 6.375 12.0547 6.45312C11.8984 6.50521 11.7227 6.55078 11.5273 6.58984C11.332 6.62891 11.1172 6.67448 10.8828 6.72656C10.6745 6.77865 10.4466 6.85677 10.1992 6.96094C9.95182 7.0651 9.69792 7.16927 9.4375 7.27344C9.17708 7.3776 8.89714 7.48177 8.59766 7.58594C8.29818 7.6901 8.00521 7.84635 7.71875 8.05469C7.43229 8.23698 7.13281 8.41276 6.82031 8.58203C6.50781 8.7513 6.19531 8.95312 5.88281 9.1875C5.6224 9.44792 5.32943 9.69531 5.00391 9.92969C4.67839 10.1641 4.39844 10.4375 4.16406 10.75C3.8776 11.0625 3.60417 11.375 3.34375 11.6875C3.08333 12 2.84896 12.3385 2.64062 12.7031C2.38021 13.0417 2.16536 13.3932 1.99609 13.7578C1.82682 14.1224 1.65104 14.487 1.46875 14.8516C1.3125 15.2422 1.16927 15.6198 1.03906 15.9844C0.908854 16.349 0.791667 16.7135 0.6875 17.0781C0.479167 17.8333 0.329427 18.5495 0.238281 19.2266C0.147135 19.9036 0.0885417 20.5417 0.0625 21.1406C0.0104167 21.7396 -0.00911458 22.2865 0.00390625 22.7812C0.0169271 23.276 0.0494792 23.7057 0.101562 24.0703C0.101562 24.2266 0.114583 24.3893 0.140625 24.5586C0.166667 24.7279 0.179688 24.8646 0.179688 24.9688C0.205729 25.0469 0.21875 25.112 0.21875 25.1641C0.21875 25.2161 0.21875 25.2422 0.21875 25.2422H0.296875C0.661458 26.9349 1.52083 28.3477 2.875 29.4805C4.22917 30.6133 5.80469 31.1797 7.60156 31.1797C9.6849 31.1797 11.4557 30.444 12.9141 28.9727C14.3724 27.5013 15.1016 25.737 15.1016 23.6797C15.1016 21.5964 14.3724 19.8255 12.9141 18.3672C11.4557 16.9089 9.6849 16.1797 7.60156 16.1797ZM25.9609 16.1797C25.7786 16.1797 25.5964 16.1862 25.4141 16.1992C25.2318 16.2122 25.0495 16.2318 24.8672 16.2578C24.9193 16.0755 24.9779 15.8867 25.043 15.6914C25.1081 15.4961 25.1927 15.3073 25.2969 15.125C25.375 14.8906 25.4857 14.6562 25.6289 14.4219C25.7721 14.1875 25.9219 13.9531 26.0781 13.7188C26.2083 13.4844 26.3646 13.276 26.5469 13.0938C26.7292 12.9115 26.8984 12.7161 27.0547 12.5078C27.237 12.2995 27.4323 12.1237 27.6406 11.9805C27.849 11.8372 28.0443 11.6745 28.2266 11.4922C28.4089 11.3099 28.6042 11.1667 28.8125 11.0625C29.0208 10.9583 29.2161 10.8411 29.3984 10.7109C29.6068 10.6068 29.7956 10.5026 29.9648 10.3984C30.1341 10.2943 30.3099 10.2161 30.4922 10.1641C30.6745 10.0859 30.8372 10.0143 30.9805 9.94922C31.1237 9.88412 31.2604 9.82552 31.3906 9.77344C31.651 9.66927 31.8464 9.59115 31.9766 9.53906C32.1068 9.48698 32.1719 9.46094 32.1719 9.46094L31.3906 6.21875C31.3906 6.21875 31.2995 6.23828 31.1172 6.27734C30.9349 6.31641 30.6875 6.375 30.375 6.45312C30.2188 6.50521 30.043 6.55078 29.8477 6.58984C29.6523 6.62891 29.4505 6.67448 29.2422 6.72656C29.0078 6.77865 28.7669 6.85677 28.5195 6.96094C28.2721 7.0651 28.0182 7.16927 27.7578 7.27344C27.4974 7.3776 27.2174 7.48177 26.918 7.58594C26.6185 7.6901 26.3255 7.84635 26.0391 8.05469C25.7526 8.23698 25.4531 8.41276 25.1406 8.58203C24.8281 8.7513 24.5286 8.95312 24.2422 9.1875C23.9557 9.44792 23.6562 9.69531 23.3438 9.92969C23.0312 10.1641 22.7448 10.4375 22.4844 10.75C22.1979 11.0625 21.9245 11.375 21.6641 11.6875C21.4036 12 21.1693 12.3385 20.9609 12.7031C20.7266 13.0417 20.5182 13.3932 20.3359 13.7578C20.1536 14.1224 19.9714 14.487 19.7891 14.8516C19.6328 15.2422 19.4896 15.6198 19.3594 15.9844C19.2292 16.349 19.112 16.7135 19.0078 17.0781C18.8255 17.8333 18.6823 18.5495 18.5781 19.2266C18.474 19.9036 18.4089 20.5417 18.3828 21.1406C18.3568 21.7396 18.3503 22.2865 18.3633 22.7812C18.3763 23.276 18.3958 23.7057 18.4219 24.0703C18.4479 24.2266 18.4674 24.3893 18.4805 24.5586C18.4935 24.7279 18.513 24.8646 18.5391 24.9688C18.5391 25.0469 18.5456 25.112 18.5586 25.1641C18.5716 25.2161 18.5781 25.2422 18.5781 25.2422H18.6172C18.9818 26.9349 19.8411 28.3477 21.1953 29.4805C22.5495 30.6133 24.138 31.1797 25.9609 31.1797C28.0182 31.1797 29.7826 30.444 31.2539 28.9727C32.7253 27.5013 33.4609 25.737 33.4609 23.6797C33.4609 21.5964 32.7253 19.8255 31.2539 18.3672C29.7826 16.9089 28.0182 16.1797 25.9609 16.1797Z"
//               fill="white"
//             />
//           </svg>
//         </div>
//         {/* text */}

//         <p
//           className={`font-medium  text-2xl text-[#FFFFFF] transition-all duration-500 ${
//             isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
//           }`}
//         >
//           {textSlides[currentIndex].text}
//         </p>

//         {/* profile */}

//         <div className="flex gap-6">
//           <Image
//             src={"/logo.png"}
//             alt="profile"
//             width={55}
//             height={55}
//             className="rounded-full object-cover"
//           />

//           <div className="flex flex-col items-start justify-between">
//             <h5 className=" font-medium text-lg text-[#FFFFFF]">
//               Richard Drews
//             </h5>
//             <span className=" font-normal text-sm text-[#FFFFFF80]">
//               Web Designer
//             </span>
//           </div>
//         </div>

//         {/* Pagination Dots */}
//         <div className="flex gap-2">
//           {textSlides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => handleDotClick(index)}
//               className={`transition-all duration-300 rounded-full ${
//                 index === currentIndex
//                   ? "bg-[#FFFFFF] w-8 h-3"
//                   : "bg-[#FFFFFF]/30 w-3 h-3 hover:bg-slate-500"
//               }`}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default AuthTestimonails;





"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const AuthTestimonails = () => {
  const bgImages = [
    "/logo.png",
    "/health.jpeg",
    "/logo.png",
    "/images.jpeg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (prev) => (prev + 1) % bgImages.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="relative h-screen overflow-hidden">

      {/* Background Images */}
      {bgImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentIndex
              ? "opacity-100 scale-100"
              : "opacity-0 scale-110"
          }`}
        >
          <Image
            src={img}
            alt="background"
            fill
            priority
            className="object-cover transition-transform duration-4000m ease-linear animate-[zoom_6s_linear_infinite]"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      ))}
    </aside>
  );
};

export default AuthTestimonails;