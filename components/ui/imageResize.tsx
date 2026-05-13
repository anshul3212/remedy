"use client";

import { useBlog } from "@/context/blogContext";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type Props = {
  upload?: boolean;
  initialMedia?: {
    media_url: string;
    media_type: string;
    thumbnail_url?: string;
  };
};

export default function ImageResize({ upload, initialMedia }: Props) {
  const { setMedia } = useBlog();

  const [mediaType, setMediaType] = useState("");

  const [file, setFile] = useState<File | null>(null);

  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const previewUrl = localPreview || uploadedPreview;

  const [cropSource, setCropSource] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
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
  const objectUrlRef = useRef<string | null>(null);

  const createPreviewUrl = (blob: Blob | File) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const url = URL.createObjectURL(blob);
    objectUrlRef.current = url;
    return url;
  };

  /* ================= PREFILL ================= */
  useEffect(() => {
    if (!initialMedia?.media_url) return;

    if (file) return; // prevent override when editing new file

    const type =
      initialMedia.media_type === "IMAGE"
        ? "Image"
        : initialMedia.media_type === "VIDEO"
        ? "Video"
        : "Audio";

    setMediaType(type);
    setUploadedPreview(initialMedia.media_url);

    setFile(null);
    setLocalPreview(null);
    setCropSource(null);
    setCroppedImage(null);
    setCompletedCrop(null);
  }, [initialMedia, file]);

  /* ================= RESET ================= */
  useEffect(() => {
    if (upload) {
      setMediaType("");
      setFile(null);
      setUploadedPreview(null);
      setLocalPreview(null);
      setCropSource(null);
      setCroppedImage(null);
      setCompletedCrop(null);
      setOpenCropModal(false);

      if (fileInputRef.current) fileInputRef.current.value = "";
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    }
  }, [upload]);

  /* ================= CLEANUP ================= */
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  /* ================= MEDIA TYPE CHANGE ================= */
  const handleMediaTypeChange = (value: string) => {
    const normalized =
      value === "Image"
        ? "Image"
        : value === "Video"
        ? "Video"
        : "Audio";

    setMediaType(normalized);

    setFile(null);
    setLocalPreview(null);
    setCropSource(null);
    setCroppedImage(null);
    setCompletedCrop(null);
    setOpenCropModal(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ================= HANDLE CROP ================= */
  const handleCrop = () => {
    if (!completedCrop || !imgRef.current) return;

    const imageEl = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleX = imageEl.naturalWidth / imageEl.width;
    const scaleY = imageEl.naturalHeight / imageEl.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
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

      setCroppedImage(blob);
      const url = createPreviewUrl(blob);
      setLocalPreview(url);
      setOpenCropModal(false);
    }, "image/jpeg");
  };

  /* ================= UPLOAD ================= */
  const uploadFile = async () => {
    if (!file) return;

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_DEV_AUTH_URL}/get-media-url`,
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

      alert("file uploaded successfully");
    } catch (error) {
      console.log("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 h-full w-full">

      {/* LEFT */}
      <div className="flex flex-col gap-4 justify-between h-full w-[30%]">

        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">
            Select Media Type
          </label>

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
                  onChange={(e) => handleMediaTypeChange(e.target.value)}
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

      {/* RIGHT */}
      <div className="flex flex-col justify-between gap-2 border border-[#d1cfcf] h-full rounded-xl w-[70%] p-2">

        <div className="flex flex-col items-center justify-center gap-3 w-full h-full">

          {!previewUrl && (
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
                  ? "image/png,image/jpeg,image/jpg"
                  : mediaType === "Video"
                  ? "video/*"
                  : "audio/*"
              }
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;

                const MAX_SIZE = 20 * 1024 * 1024;
                if (f.size > MAX_SIZE) {
                  alert("File size should be less than 20MB");
                  return;
                }

                const isImage = mediaType === "Image";

                if (isImage) {
                  const allowedTypes = [
                    "image/png",
                    "image/jpeg",
                    "image/jpg",
                  ];

                  if (!allowedTypes.includes(f.type)) {
                    alert("Only PNG, JPG and JPEG images are allowed");
                    return;
                  }
                }

                setFile(f);

                const url = createPreviewUrl(f);
                setLocalPreview(url);

                if (isImage) {
                  setCropSource(url);
                  setOpenCropModal(true);
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
        {mediaType === "Image" && previewUrl && (
          <img src={previewUrl} className="w-full h-50 object-contain rounded" />
        )}

        {mediaType === "Video" && previewUrl && (
          <video controls className="w-full h-50 mt-2">
            <source src={previewUrl} />
          </video>
        )}

        {mediaType === "Audio" && previewUrl && (
          <audio controls className="w-full h-50 mt-2">
            <source src={previewUrl} />
          </audio>
        )}
      </div>

      {/* CROP MODAL */}
      {openCropModal && mediaType === "Image" && cropSource && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-2xl p-4 rounded-lg shadow-lg">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
            >
              <img ref={imgRef} src={cropSource} className="w-full h-40 object-contain" />
            </ReactCrop>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setOpenCropModal(false)} className="bg-gray-300 px-4 py-2 rounded">
                Cancel
              </button>

              <button onClick={handleCrop} className="bg-green-500 px-4 py-2 rounded">
                Crop Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

