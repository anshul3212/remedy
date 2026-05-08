// "use client";

// import { useBlog } from "@/context/blogContext";
// import axios from "axios";
// import { useState, useRef, useEffect } from "react";
// import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";

// type Props = {
//   upload?: boolean;
// };

// export default function ImageResize({ upload }: Props) {
//   const { media, setMedia } = useBlog();

//   const [mediaType, setMediaType] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
//   const [submit, setSubmit] = useState(false);

//   const [image, setImage] = useState<string | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);

//   const [openCropModal, setOpenCropModal] = useState(false);

//   const [loading, setLoading] = useState(false);

//   const [crop, setCrop] = useState<Crop>({
//     unit: "%",
//     width: 70,
//     height: 40,
//     x: 15,
//     y: 30,
//   });

//   const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

//   const imgRef = useRef<HTMLImageElement | null>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const uploadFile = async () => {
//     if (!file) return;

//     const token = localStorage.getItem("token");

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         "http://3.13.92.66/api/v1/auth/get-media-url",
//         {
//           file_name: file.name,
//           content_type: file.type || mediaType,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const uploadUrl = res.data.data.upload_url;
//       const key = res.data.data.key;

//       if (!uploadUrl) return;

//       await axios.put(uploadUrl, croppedImage || file, {
//         headers: {
//           "Content-Type": file.type,
//         },
//       });

//       setMedia({
//         media_url: key,
//         media_type: mediaType.toUpperCase(),
//       });

//       setSubmit(true);
//       setLoading(false);

//       alert("file uploaded successfully");
//     } catch (error) {
//       console.log("Upload error:", error);
//       setLoading(false);
//     }
//   };
//   /* ================= PREFILL MEDIA ================= */
// useEffect(() => {
//   if (!media) return;
//   if (!media.media_url) return;

//   const type =
//     media.media_type === "IMAGE"
//       ? "Image"
//       : media.media_type === "VIDEO"
//       ? "Video"
//       : "Audio";

//   setMediaType(type);
//   setPreview(media.media_url);
// }, [media]);

//   useEffect(() => {
//     if (upload) {
//       setFile(null);
//       setMediaType("");
//       setImage(null);
//       setPreview(null);
//       setCroppedImage(null);
//       setCompletedCrop(null);
//       setOpenCropModal(false);

//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//     }
//   }, [upload]);

//   useEffect(() => {
//     if (!file || mediaType !== "Image") return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       setImage(reader.result as string);
//       setPreview(null);
//     };
//     reader.readAsDataURL(file);
//   }, [file, mediaType]);

//   const handleCrop = () => {
//     if (!completedCrop || !imgRef.current) return;

//     const imageEl = imgRef.current;
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     const scaleX = imageEl.naturalWidth / imageEl.width;
//     const scaleY = imageEl.naturalHeight / imageEl.height;

//     canvas.width = completedCrop.width;
//     canvas.height = completedCrop.height;

//     ctx?.drawImage(
//       imageEl,
//       completedCrop.x * scaleX,
//       completedCrop.y * scaleY,
//       completedCrop.width * scaleX,
//       completedCrop.height * scaleY,
//       0,
//       0,
//       completedCrop.width,
//       completedCrop.height
//     );

//     canvas.toBlob((blob) => {
//       if (!blob) return;

//       const url = URL.createObjectURL(blob);
//       setPreview(url);
//       setCroppedImage(blob);
//     }, "image/jpeg");
//   };

//   return (
//     <div className="flex items-center justify-between gap-2 h-full w-full">

//       {/* MEDIA TYPE */}
//       <div className="flex flex-col gap-4 justify-between h-full w-[30%]">
//         <div className="flex flex-col gap-2">
//           <label className="font-medium text-sm">Select Media Type</label>

//           <div className="grid grid-cols-3 gap-4 mt-2">
//             {["Audio", "Video", "Image"].map((c) => (
//               <label
//                 key={c}
//                 className="flex items-center gap-2 cursor-pointer font-inter font-medium text-[14px] text-[#747272]"
//               >
//                 <input
//                   type="radio"
//                   name="mediaType"
//                   value={c}
//                   checked={mediaType === c}
//                   onChange={(e) => {
//                     setMediaType(e.target.value);
//                     setFile(null);
//                     setPreview(null);
//                     setImage(null);
//                     setOpenCropModal(false);

//                     if (fileInputRef.current) {
//                       fileInputRef.current.value = "";
//                     }
//                   }}
//                 />
//                 {c}
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* UPLOAD BUTTON */}
//         <button
//           onClick={uploadFile}
//           disabled={loading || !file}
//           className={`px-4 py-2 rounded-md text-white cursor-pointer ${
//             loading || !file
//               ? "bg-[#7e7b7b]"
//               : "bg-[linear-gradient(280.07deg,#A34E25_0%,#734C82_65%,#522762_100%)] active:scale-[0.9]"
//           }`}
//         >
//           upload file
//         </button>
//       </div>

//       {/* RIGHT PANEL */}
//       <div className="flex flex-col justify-between gap-2 border border-[#d1cfcf] h-full rounded-xl w-[70%] p-2">

//         <div className="flex flex-col items-center justify-center gap-3 w-full h-full">

//           {/* CLOUD PLACEHOLDER */}
//           {!file && (
//             <div className="flex flex-col items-center justify-center text-[#747272]">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-16 h-16 mb-2 opacity-70"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M3 15a4 4 0 004 4h9a4 4 0 100-8 5.5 5.5 0 00-10.7-1.5A3.5 3.5 0 003 15z"
//                 />
//               </svg>

//               <p className="text-sm">No file selected</p>
//               <p className="text-xs text-gray-400">
//                 {mediaType
//                   ? `Upload your ${mediaType.toLowerCase()}`
//                   : "please select media type"}
//               </p>
//             </div>
//           )}

//           {/* FILE INPUT */}
//           <div className="flex items-center justify-center gap-3">
//             <input
//               ref={fileInputRef}
//               disabled={!mediaType}
//               type="file"
//               id="fileUpload"
//               accept={
//                 mediaType === "Image"
//                   ? "image/*"
//                   : mediaType === "Video"
//                   ? "video/*"
//                   : "audio/*"
//               }
//               className="hidden"
//               onChange={(e) => {
//                 const f = e.target.files?.[0] || null;
//                 if (!f) return;

//                 setFile(f);
//                 setPreview(null);
//                 setCroppedImage(null);

//                 if (mediaType === "Image") {
//                   setOpenCropModal(true);
//                 }
//               }}
//             />

//             <label
//               htmlFor="fileUpload"
//               className={` text-white px-4 py-2 rounded cursor-pointer text-sm font-medium  ${mediaType?"bg-green-500 active:scale-[0.9] transition":"bg-[#7e7b7b]"}`}
//             >
//               Choose File
//             </label>

//             {file && (
//               <span className="text-sm text-[#747272] truncate max-w-50">
//                 {file.name}
//               </span>
//             )}
//           </div>
//         </div>

//         {/* PREVIEWS */}
//         {mediaType === "Image" && preview && (
//           <img src={preview} className="w-full h-50 object-contain rounded" />
//         )}

//         {mediaType === "Video" && file && (
//           <video controls className="w-full h-50 mt-2">
//             <source src={URL.createObjectURL(file)} />
//           </video>
//         )}

//         {mediaType === "Audio" && file && (
//           <audio controls className="w-full h-50 mt-2">
//             <source src={URL.createObjectURL(file)} />
//           </audio>
//         )}
//       </div>

//       {/* CROPPER MODAL */}
//       {openCropModal && mediaType === "Image" && image && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white w-[90%] max-w-2xl p-4 rounded-lg shadow-lg">

//             <h2 className="text-lg font-semibold mb-3">Crop Image</h2>

//             <ReactCrop
//               crop={crop}
//               onChange={(c) => setCrop(c)}
//               onComplete={(c) => setCompletedCrop(c)}
//             >
//               <img
//                 ref={imgRef}
//                 src={image}
//                 className="w-full h-40 object-contain"
//               />
//             </ReactCrop>

//             <div className="flex justify-end gap-3 mt-4">
//               <button
//                 onClick={() => {
//                   setOpenCropModal(false);
//                   setFile(null);
//                   setImage(null);
//                   setPreview(null);
//                   setCroppedImage(null);
//                   setCompletedCrop(null);

//                   if (fileInputRef.current) {
//                     fileInputRef.current.value = "";
//                   }
//                 }}
//                 className="bg-gray-300 px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={() => {
//                   handleCrop();
//                   setOpenCropModal(false);
//                 }}
//                 className="bg-green-500 px-4 py-2 rounded"
//               >
//                 Crop Image
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// }





// "use client";

// import { useBlog } from "@/context/blogContext";
// import axios from "axios";
// import { useState, useRef, useEffect } from "react";
// import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";

// type Props = {
//   upload?: boolean;
//   initialMedia?: {
//     media_url: string;
//     media_type: string;
//   };
// };

// export default function ImageResize({ upload, initialMedia }: Props) {
//   const { setMedia } = useBlog();

//   const [mediaType, setMediaType] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [croppedImage, setCroppedImage] = useState<Blob | null>(null);

//   const [image, setImage] = useState<string | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);

//   const [openCropModal, setOpenCropModal] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [crop, setCrop] = useState<Crop>({
//     unit: "%",
//     width: 70,
//     height: 40,
//     x: 15,
//     y: 30,
//   });

//   const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

//   const imgRef = useRef<HTMLImageElement | null>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   /* ================= PREFILL FIX ================= */
//   useEffect(() => {
//     if (!initialMedia?.media_url) return;

//     const type =
//       initialMedia.media_type === "IMAGE"
//         ? "Image"
//         : initialMedia.media_type === "VIDEO"
//         ? "Video"
//         : "Audio";

//     setMediaType(type);

//     // IMPORTANT: only preview, not file state
//     setPreview(initialMedia.media_url);

//     // sync global state only ONCE per change
//     setMedia((prev: any) => {
//       if (
//         prev?.media_url === initialMedia.media_url &&
//         prev?.media_type === initialMedia.media_type
//       ) {
//         return prev; // prevent loop
//       }
//       return {
//         media_url: initialMedia.media_url,
//         media_type: initialMedia.media_type,
//       };
//     });
//   }, [initialMedia]);

//   /* ================= UPLOAD ================= */
//   const uploadFile = async () => {
//     if (!file) return;

//     const token = localStorage.getItem("token");

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         "http://3.13.92.92/api/v1/auth/get-media-url",
//         {
//           file_name: file.name,
//           content_type: file.type || mediaType,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const uploadUrl = res.data.data.upload_url;
//       const key = res.data.data.key;

//       await axios.put(uploadUrl, croppedImage || file, {
//         headers: {
//           "Content-Type": file.type,
//         },
//       });

//       const newMedia = {
//         media_url: key,
//         media_type: mediaType.toUpperCase(),
//       };

//       setMedia(newMedia);
//       setPreview(key);

//       setLoading(false);
//       alert("file uploaded successfully");
//     } catch (error) {
//       console.log(error);
//       setLoading(false);
//     }
//   };

//   /* ================= FILE LOAD ================= */
//   useEffect(() => {
//     if (!file || mediaType !== "Image") return;

//     const reader = new FileReader();

//     reader.onload = () => {
//       setImage(reader.result as string);
//     };

//     reader.readAsDataURL(file);
//   }, [file, mediaType]);

//   /* ================= CROP ================= */
//   const handleCrop = () => {
//     if (!completedCrop || !imgRef.current) return;

//     const imageEl = imgRef.current;
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     const scaleX = imageEl.naturalWidth / imageEl.width;
//     const scaleY = imageEl.naturalHeight / imageEl.height;

//     canvas.width = completedCrop.width;
//     canvas.height = completedCrop.height;

//     ctx?.drawImage(
//       imageEl,
//       completedCrop.x * scaleX,
//       completedCrop.y * scaleY,
//       completedCrop.width * scaleX,
//       completedCrop.height * scaleY,
//       0,
//       0,
//       completedCrop.width,
//       completedCrop.height
//     );

//     canvas.toBlob((blob) => {
//       if (!blob) return;

//       const url = URL.createObjectURL(blob);
//       setPreview(url);
//       setCroppedImage(blob);
//     }, "image/jpeg");
//   };

//   return (
//     <div className="flex items-center justify-between gap-2 h-full w-full">

//       {/* LEFT */}
//       <div className="flex flex-col gap-4 justify-between h-full w-[30%]">

//         <div className="flex flex-col gap-2">
//           <label className="font-medium text-sm">Select Media Type</label>

//           <div className="grid grid-cols-3 gap-4 mt-2">
//             {["Audio", "Video", "Image"].map((c) => (
//               <label
//                 key={c}
//                 className="flex items-center gap-2 cursor-pointer font-inter font-medium text-[14px] text-[#747272]"
//               >
//                 <input
//                   type="radio"
//                   name="mediaType"
//                   value={c}
//                   checked={mediaType === c}
//                   onChange={(e) => {
//                     setMediaType(e.target.value);

//                     // IMPORTANT: only clear user selection
//                     setFile(null);
//                     setPreview(null);
//                     setImage(null);
//                   }}
//                 />
//                 {c}
//               </label>
//             ))}
//           </div>
//         </div>

//         <button
//           onClick={uploadFile}
//           disabled={loading || !file}
//           className={`px-4 py-2 rounded-md text-white cursor-pointer ${
//             loading || !file
//               ? "bg-[#7e7b7b]"
//               : "bg-[linear-gradient(280.07deg,#A34E25_0%,#734C82_65%,#522762_100%)]"
//           }`}
//         >
//           upload file
//         </button>
//       </div>

//       {/* RIGHT */}
//       <div className="flex flex-col justify-between gap-2 border border-[#d1cfcf] h-full rounded-xl w-[70%] p-2">

//         <div className="flex flex-col items-center justify-center gap-3 w-full h-full">

//           {!preview && (
//             <div className="text-[#747272] text-sm">
//               No file selected
//             </div>
//           )}

//           <input
//   key={mediaType}   // ✅ IMPORTANT FIX (forces re-init when type changes)
//   ref={fileInputRef}
//   type="file"
//   hidden
//   accept={
//     mediaType === "Image"
//       ? "image/*"
//       : mediaType === "Video"
//       ? "video/*"
//       : "audio/*"
//   }
//   onChange={(e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;

//     // ✅ allow reselect same file again
//     e.target.value = "";

//     setFile(f);

//     if (mediaType === "Image") {
//       setOpenCropModal(true);
//     } else {
//       setPreview(URL.createObjectURL(f));
//     }

//     // ✅ override prefilled media ONLY when user selects new file
//     setMedia({
//       media_url: URL.createObjectURL(f),
//       media_type: mediaType.toUpperCase(),
//     });
//   }}
// />

//           <label className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">
//             Choose File
//           </label>
//         </div>

//         {/* PREVIEW (WORKING PREFILL FIXED) */}
//         {preview && (
//           mediaType === "Image" ? (
//             <img src={preview} className="w-full h-50 object-contain rounded" />
//           ) : mediaType === "Video" ? (
//             <video controls className="w-full h-50">
//               <source src={preview} />
//             </video>
//           ) : (
//             <audio controls className="w-full">
//               <source src={preview} />
//             </audio>
//           )
//         )}
//       </div>

//       {/* CROPPER */}
//       {openCropModal && image && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white w-[90%] max-w-2xl p-4">

//             <ReactCrop
//               crop={crop}
//               onChange={(c) => setCrop(c)}
//               onComplete={(c) => setCompletedCrop(c)}
//             >
//               <img ref={imgRef} src={image} />
//             </ReactCrop>

//             <div className="flex justify-end gap-3 mt-3">
//               <button onClick={() => setOpenCropModal(false)}>
//                 Cancel
//               </button>

//               <button
//                 onClick={() => {
//                   handleCrop();
//                   setOpenCropModal(false);
//                 }}
//               >
//                 Crop
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// }











// "use client";

// import { useBlog } from "@/context/blogContext";
// import axios from "axios";
// import { useState, useRef, useEffect } from "react";
// import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";

// type Props = {
//   upload?: boolean;
//   initialMedia?: {
//     media_url: string;
//     media_type: string;
//   };
// };

// export default function ImageResize({ upload, initialMedia }: Props) {
//   const { setMedia } = useBlog();

//   const [mediaType, setMediaType] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [croppedImage, setCroppedImage] = useState<Blob | null>(null);

//   const [image, setImage] = useState<string | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);

//   const [openCropModal, setOpenCropModal] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [crop, setCrop] = useState<Crop>({
//     unit: "%",
//     width: 70,
//     height: 40,
//     x: 15,
//     y: 30,
//   });

//   const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

//   const imgRef = useRef<HTMLImageElement | null>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   /* ================= UPLOAD ================= */
//   const uploadFile = async () => {
//     if (!file) return;

//     const token = localStorage.getItem("token");

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         "http://3.13.92.66/api/v1/auth/get-media-url",
//         {
//           file_name: file.name,
//           content_type: file.type || mediaType,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const uploadUrl = res.data.data.upload_url;
//       const key = res.data.data.key;

//       await axios.put(uploadUrl, croppedImage || file, {
//         headers: {
//           "Content-Type": file.type,
//         },
//       });

//       setMedia({
//         media_url: key,
//         media_type: mediaType.toUpperCase(),
//       });

//       setLoading(false);
//       alert("file uploaded successfully");
//     } catch (error) {
//       console.log("Upload error:", error);
//       setLoading(false);
//     }
//   };

//   /* ================= PREFILL FIX ================= */
//   useEffect(() => {
//     if (!initialMedia?.media_url) return;

//     const type =
//       initialMedia.media_type === "IMAGE"
//         ? "Image"
//         : initialMedia.media_type === "VIDEO"
//         ? "Video"
//         : "Audio";

//     setMediaType(type);

//     setPreview(initialMedia.media_url);
//     setFile(null);
//     setImage(null);
//     setCroppedImage(null);
//     setCompletedCrop(null);
//   }, [initialMedia]);

//   /* ================= RESET ================= */
//   useEffect(() => {
//     if (upload) {
//       setFile(null);
//       setMediaType("");
//       setImage(null);
//       setPreview(null);
//       setCroppedImage(null);
//       setCompletedCrop(null);
//       setOpenCropModal(false);

//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//     }
//   }, [upload]);

//   /* ================= IMAGE LOAD ================= */
//   useEffect(() => {
//     if (!file || mediaType !== "Image") return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       setImage(reader.result as string);
//       setPreview(null);
//     };
//     reader.readAsDataURL(file);
//   }, [file, mediaType]);

//   /* ================= CROP ================= */
//   const handleCrop = () => {
//     if (!completedCrop || !imgRef.current) return;

//     const imageEl = imgRef.current;
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     const scaleX = imageEl.naturalWidth / imageEl.width;
//     const scaleY = imageEl.naturalHeight / imageEl.height;

//     canvas.width = completedCrop.width;
//     canvas.height = completedCrop.height;

//     ctx?.drawImage(
//       imageEl,
//       completedCrop.x * scaleX,
//       completedCrop.y * scaleY,
//       completedCrop.width * scaleX,
//       completedCrop.height * scaleY,
//       0,
//       0,
//       completedCrop.width,
//       completedCrop.height
//     );

//     canvas.toBlob((blob) => {
//       if (!blob) return;

//       const url = URL.createObjectURL(blob);
//       setPreview(url);
//       setCroppedImage(blob);
//     }, "image/jpeg");
//   };

//   return (
//     <div className="flex items-center justify-between gap-2 h-full w-full">

//       {/* MEDIA TYPE */}
//       <div className="flex flex-col gap-4 justify-between h-full w-[30%]">

//         <div className="flex flex-col gap-2">
//           <label className="font-medium text-sm">Select Media Type</label>

//           <div className="grid grid-cols-3 gap-4 mt-2">
//             {["Audio", "Video", "Image"].map((c) => (
//               <label
//                 key={c}
//                 className="flex items-center gap-2 cursor-pointer font-inter font-medium text-[14px] text-[#747272]"
//               >
//                 <input
//                   type="radio"
//                   name="mediaType"
//                   value={c}
//                   checked={mediaType === c}
//                   onChange={(e) => {
//                     setMediaType(e.target.value);
//                     setFile(null);
//                     setPreview(null);
//                     setImage(null);
//                     setOpenCropModal(false);

//                     if (fileInputRef.current) {
//                       fileInputRef.current.value = "";
//                     }
//                   }}
//                 />
//                 {c}
//               </label>
//             ))}
//           </div>
//         </div>

//         <button
//           onClick={uploadFile}
//           disabled={loading || !file}
//           className={`px-4 py-2 rounded-md text-white cursor-pointer ${
//             loading || !file
//               ? "bg-[#7e7b7b]"
//               : "bg-[linear-gradient(280.07deg,#A34E25_0%,#734C82_65%,#522762_100%)]"
//           }`}
//         >
//           upload file
//         </button>
//       </div>

//       {/* RIGHT PANEL */}
//       <div className="flex flex-col justify-between gap-2 border border-[#d1cfcf] h-full rounded-xl w-[70%] p-2">

//         <div className="flex flex-col items-center justify-center gap-3 w-full h-full">

//           {/* FIX: SHOW PREFILL ALSO */}
//           {!file && !preview && (
//             <div className="flex flex-col items-center justify-center text-[#747272]">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-16 h-16 mb-2 opacity-70"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M3 15a4 4 0 004 4h9a4 4 0 100-8 5.5 5.5 0 00-10.7-1.5A3.5 3.5 0 003 15z"
//                 />
//               </svg>

//               <p className="text-sm">No file selected</p>
//               <p className="text-xs text-gray-400">
//                 {mediaType
//                   ? `Upload your ${mediaType.toLowerCase()}`
//                   : "please select media type"}
//               </p>
//             </div>
//           )}

//           {/* FILE INPUT */}
//           <div className="flex items-center justify-center gap-3">
//             <input
//               ref={fileInputRef}
//               disabled={!mediaType}
//               type="file"
//               id="fileUpload"
//               accept={
//                 mediaType === "Image"
//                   ? "image/*"
//                   : mediaType === "Video"
//                   ? "video/*"
//                   : "audio/*"
//               }
//               className="hidden"
//               onChange={(e) => {
//                 const f = e.target.files?.[0] || null;
//                 if (!f) return;

//                 setFile(f);

//                 if (mediaType === "Image") {
//                   setOpenCropModal(true);
//                 } else {
//                   setPreview(URL.createObjectURL(f));
//                 }
//               }}
//             />

//             <label
//               htmlFor="fileUpload"
//               className={`text-white px-4 py-2 rounded cursor-pointer text-sm font-medium ${
//                 mediaType
//                   ? "bg-green-500"
//                   : "bg-[#7e7b7b]"
//               }`}
//             >
//               Choose File
//             </label>
//           </div>
//         </div>

//         {/* FIXED PREVIEW */}
//         {mediaType === "Image" && (preview || file) && (
//           <img
//             src={preview || (file ? URL.createObjectURL(file) : "")}
//             className="w-full h-50 object-contain rounded"
//           />
//         )}

//         {mediaType === "Video" && (file || preview) && (
//           <video controls className="w-full h-50 mt-2">
//             <source src={preview || URL.createObjectURL(file!)} />
//           </video>
//         )}

//         {mediaType === "Audio" && (file || preview) && (
//           <audio controls className="w-full h-50 mt-2">
//             <source src={preview || URL.createObjectURL(file!)} />
//           </audio>
//         )}
//       </div>

//       {/* CROPPER */}
//       {openCropModal && mediaType === "Image" && image && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white w-[90%] max-w-2xl p-4 rounded-lg shadow-lg">

//             <ReactCrop
//               crop={crop}
//               onChange={(c) => setCrop(c)}
//               onComplete={(c) => setCompletedCrop(c)}
//             >
//               <img ref={imgRef} src={image} className="w-full h-40 object-contain" />
//             </ReactCrop>

//             <div className="flex justify-end gap-3 mt-4">
//               <button
//                 onClick={() => setOpenCropModal(false)}
//                 className="bg-gray-300 px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={() => {
//                   handleCrop();
//                   setOpenCropModal(false);
//                 }}
//                 className="bg-green-500 px-4 py-2 rounded"
//               >
//                 Crop Image
//               </button>
//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }









"use client";

import { useBlog } from "@/context/blogContext";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type Props = {
  upload?: boolean;
  initialMedia?: {
    media_url: string;
    media_type: string;
  };
};

export default function ImageResize({ upload, initialMedia }: Props) {
  const { setMedia } = useBlog();

  const [mediaType, setMediaType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);

  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [openCropModal, setOpenCropModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 70,
    height: 40,
    x: 15,
    y: 30,
  });

  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ================= UPLOAD ================= */
  const uploadFile = async () => {
    if (!file) return;

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await axios.post(
        "http://3.13.92.66/api/v1/auth/get-media-url",
        {
          file_name: file.name,
          content_type: file.type || mediaType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const uploadUrl = res.data.data.upload_url;
      const key = res.data.data.key;

      // ✅ FIX: always fresh upload data
      const uploadData = croppedImage ?? file;

      await axios.put(uploadUrl, uploadData, {
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
      });

      setMedia({
        media_url: key,
        media_type: mediaType.toUpperCase(),
      });

      setLoading(false);
      alert("file uploaded successfully");
    } catch (error) {
      console.log("Upload error:", error);
      setLoading(false);
    }
  };

  /* ================= PREFILL ================= */
  useEffect(() => {
    if (!initialMedia?.media_url) return;

    const type =
      initialMedia.media_type === "IMAGE"
        ? "Image"
        : initialMedia.media_type === "VIDEO"
        ? "Video"
        : "Audio";

    setMediaType(type);
    setPreview(initialMedia.media_url);

    // reset file states
    setFile(null);
    setImage(null);
    setCroppedImage(null);
    setCompletedCrop(null);
  }, [initialMedia]);

  /* ================= RESET ================= */
  useEffect(() => {
    if (upload) {
      setFile(null);
      setMediaType("");
      setImage(null);
      setPreview(null);
      setCroppedImage(null);
      setCompletedCrop(null);
      setOpenCropModal(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [upload]);

  /* ================= IMAGE LOAD ================= */
  useEffect(() => {
    if (!file || mediaType !== "Image") return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setPreview(null);
    };
    reader.readAsDataURL(file);
  }, [file, mediaType]);

  /* ================= CROP ================= */
  const handleCrop = () => {
    if (!completedCrop || !imgRef.current) return;

    const imageEl = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const scaleX = imageEl.naturalWidth / imageEl.width;
    const scaleY = imageEl.naturalHeight / imageEl.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx?.drawImage(
      imageEl,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      setPreview(url);
      setCroppedImage(blob);
    }, "image/jpeg");
  };

  return (
    <div className="flex items-center justify-between gap-2 h-full w-full">

      {/* MEDIA TYPE */}
      <div className="flex flex-col gap-4 justify-between h-full w-[30%]">

        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">Select Media Type</label>

          <div className="grid grid-cols-3 gap-4 mt-2">
            {["Audio", "Video", "Image"].map((c) => (
              <label
                key={c}
                className="flex items-center gap-2 cursor-pointer font-inter font-medium text-[14px] text-[#747272]"
              >
                <input
                  type="radio"
                  name="mediaType"
                  value={c}
                  checked={mediaType === c}
                  onChange={(e) => {
                    setMediaType(e.target.value);
                    setFile(null);
                    setPreview(null);
                    setImage(null);
                    setCroppedImage(null);

                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={uploadFile}
          disabled={loading || !file}
          className={`px-4 py-2 rounded-md text-white cursor-pointer ${
            loading || !file
              ? "bg-[#7e7b7b]"
              : "bg-[linear-gradient(280.07deg,#A34E25_0%,#734C82_65%,#522762_100%)]"
          }`}
        >
          upload file
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col justify-between gap-2 border border-[#d1cfcf] h-full rounded-xl w-[70%] p-2">

        <div className="flex flex-col items-center justify-center gap-3 w-full h-full">

          {!file && !preview && (
            <div className="flex flex-col items-center justify-center text-[#747272]">
              <p className="text-sm">No file selected</p>
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <input
              ref={fileInputRef}
              disabled={!mediaType}
              type="file"
              id="fileUpload"
              accept={
                mediaType === "Image"
                  ? "image/*"
                  : mediaType === "Video"
                  ? "video/*"
                  : "audio/*"
              }
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;

                // ✅ FIX: always reset stale state
                setFile(null);
                setPreview(null);
                setImage(null);
                setCroppedImage(null);

                setTimeout(() => {
                  setFile(f);

                  if (mediaType === "Image") {
                    setOpenCropModal(true);
                  } else {
                    setPreview(URL.createObjectURL(f));
                  }
                }, 0);

                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            />

            <label
              htmlFor="fileUpload"
              className={`text-white px-4 py-2 rounded cursor-pointer text-sm font-medium ${
                mediaType ? "bg-green-500" : "bg-[#7e7b7b]"
              }`}
            >
              Choose File
            </label>
          </div>
        </div>

        {/* PREVIEW */}
        {mediaType === "Image" && (preview || file) && (
          <img
            src={preview || (file ? URL.createObjectURL(file) : "")}
            className="w-full h-50 object-contain rounded"
          />
        )}

        {mediaType === "Video" && (file || preview) && (
          <video controls className="w-full h-50 mt-2">
            <source src={preview || URL.createObjectURL(file!)} />
          </video>
        )}

        {mediaType === "Audio" && (file || preview) && (
          <audio controls className="w-full h-50 mt-2">
            <source src={preview || URL.createObjectURL(file!)} />
          </audio>
        )}
      </div>

      {/* CROPPER */}
      {openCropModal && mediaType === "Image" && image && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-2xl p-4 rounded-lg shadow-lg">

            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
            >
              <img ref={imgRef} src={image} className="w-full h-40 object-contain" />
            </ReactCrop>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setOpenCropModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleCrop();
                  setOpenCropModal(false);
                }}
                className="bg-green-500 px-4 py-2 rounded"
              >
                Crop Image
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}