"use client";

import { useBlog } from "@/context/blogContext";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ReactCrop, {
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type Props = {
  upload?: boolean;
  initialMedia?: {
    media_url?: string;
    media_key?: string;
    media_type?: string;
    thumbnail_url?: string;
    thumbnail_key?: string;
  };
};

export default function ImageResize({
  upload,
  initialMedia,
}: Props) {
  const { setMedia } = useBlog();

  const [mediaType, setMediaType] =
    useState("");

  const [file, setFile] =
    useState<File | null>(null);

  const [thumbnailFile, setThumbnailFile] =
    useState<File | null>(null);

  const [uploadedPreview, setUploadedPreview] =
    useState<string | null>(null);

  const [thumbnailPreview, setThumbnailPreview] =
    useState<string | null>(
      initialMedia?.thumbnail_url || null
    );

  const [localPreview, setLocalPreview] =
    useState<string | null>(null);

  const previewUrl =
    localPreview || uploadedPreview;

  const [cropSource, setCropSource] =
    useState<string | null>(null);

  const [croppedImage, setCroppedImage] =
    useState<Blob | null>(null);

  const [openCropModal, setOpenCropModal] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [previewKey, setPreviewKey] =
    useState(Date.now());

  const [thumbnailPreviewKey, setThumbnailPreviewKey] =
    useState(Date.now());

  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 70,
    height: 40,
    x: 15,
    y: 30,
  });

  const [completedCrop, setCompletedCrop] =
    useState<PixelCrop | null>(null);

  /* ================= THUMBNAIL CROP ================= */

  const [
    thumbnailCropSource,
    setThumbnailCropSource,
  ] = useState<string | null>(null);

  const [thumbnailCrop, setThumbnailCrop] =
    useState<Crop>({
      unit: "%",
      width: 70,
      height: 70,
      x: 15,
      y: 15,
    });

  const [
    thumbnailCompletedCrop,
    setThumbnailCompletedCrop,
  ] = useState<PixelCrop | null>(null);

  const [
    openThumbnailCropModal,
    setOpenThumbnailCropModal,
  ] = useState(false);

  const thumbnailImgRef =
    useRef<HTMLImageElement | null>(null);

  const imgRef =
    useRef<HTMLImageElement | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const thumbnailInputRef =
    useRef<HTMLInputElement | null>(null);

  /* ================= OBJECT URL REFS ================= */

  const mediaObjectUrlRef =
    useRef<string | null>(null);

  const thumbnailObjectUrlRef =
    useRef<string | null>(null);

  const createMediaPreviewUrl = (
    blob: Blob | File
  ) => {
    if (mediaObjectUrlRef.current) {
      URL.revokeObjectURL(
        mediaObjectUrlRef.current
      );
    }

    const url = URL.createObjectURL(blob);

    mediaObjectUrlRef.current = url;

    return url;
  };

  const createThumbnailPreviewUrl = (
    blob: Blob | File
  ) => {
    if (
      thumbnailObjectUrlRef.current
    ) {
      URL.revokeObjectURL(
        thumbnailObjectUrlRef.current
      );
    }

    const url = URL.createObjectURL(blob);

    thumbnailObjectUrlRef.current =
      url;

    return url;
  };

  /* ================= ALLOWED TYPES ================= */

  const allowedTypesMap: Record<
    string,
    string
  > = {
    Image:
      "PNG, JPG, JPEG, WEBP, GIF, AVIF",
    Video: "MP4, WEBM, OGG",
    Audio: "MP3, WAV, OGG, MP4 AUDIO",
  };

 /* ================= PREFILL ================= */

useEffect(() => {
  if (!initialMedia?.media_url)
    return;

  if (
    file ||
    localPreview ||
    uploadedPreview
  )
    return;

  const type =
    initialMedia.media_type ===
    "IMAGE"
      ? "Image"
      : initialMedia.media_type ===
          "VIDEO"
        ? "Video"
        : "Audio";

  setMediaType(type);


  setUploadedPreview(
    initialMedia.media_url
  );

    setThumbnailPreview(
      initialMedia.thumbnail_url ||
        null
    );

  setPreviewKey(Date.now());

  setThumbnailPreviewKey(
    Date.now()
  );

  
}, [
  initialMedia,
  file,
  localPreview,
]);


  /* ================= RESET ================= */

  useEffect(() => {
    if (upload) {
      setMediaType("");

      setFile(null);

      setThumbnailFile(null);

      setThumbnailPreview(null);

      setUploadedPreview(null);

      setLocalPreview(null);

      setCropSource(null);

      setCroppedImage(null);

      setCompletedCrop(null);

      setOpenCropModal(false);

      setThumbnailCropSource(null);

      setThumbnailCompletedCrop(
        null
      );

      setOpenThumbnailCropModal(
        false
      );

      setPreviewKey(Date.now());

      setThumbnailPreviewKey(
        Date.now()
      );

      if (fileInputRef.current)
        fileInputRef.current.value =
          "";

      if (
        thumbnailInputRef.current
      )
        thumbnailInputRef.current.value =
          "";

      if (
        mediaObjectUrlRef.current
      ) {
        URL.revokeObjectURL(
          mediaObjectUrlRef.current
        );
      }

      if (
        thumbnailObjectUrlRef.current
      ) {
        URL.revokeObjectURL(
          thumbnailObjectUrlRef.current
        );
      }
    }
  }, [upload]);

  /* ================= CLEANUP ================= */

  useEffect(() => {
    return () => {
      if (
        mediaObjectUrlRef.current
      ) {
        URL.revokeObjectURL(
          mediaObjectUrlRef.current
        );
      }

      if (
        thumbnailObjectUrlRef.current
      ) {
        URL.revokeObjectURL(
          thumbnailObjectUrlRef.current
        );
      }
    };
  }, []);

  /* ================= MEDIA TYPE CHANGE ================= */

  const handleMediaTypeChange = (
    value: string
  ) => {
    const normalized =
      value === "Image"
        ? "Image"
        : value === "Video"
          ? "Video"
          : "Audio";

    setMediaType(normalized);

    setFile(null);

    setThumbnailFile(null);

    setThumbnailPreview(null);

    setLocalPreview(null);

    setUploadedPreview(null);

    setCropSource(null);

    setCroppedImage(null);

    setCompletedCrop(null);

    setOpenCropModal(false);

    setThumbnailCropSource(null);

    setThumbnailCompletedCrop(
      null
    );

    setOpenThumbnailCropModal(
      false
    );

    setPreviewKey(Date.now());

    setThumbnailPreviewKey(
      Date.now()
    );

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }

    if (
      thumbnailInputRef.current
    ) {
      thumbnailInputRef.current.value =
        "";
    }
  };

  /* ================= HANDLE IMAGE CROP ================= */

  const handleCrop = () => {
    if (
      !completedCrop ||
      !imgRef.current
    )
      return;

    const imageEl = imgRef.current;

    const canvas =
      document.createElement(
        "canvas"
      );

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    const scaleX =
      imageEl.naturalWidth /
      imageEl.width;

    const scaleY =
      imageEl.naturalHeight /
      imageEl.height;

    canvas.width =
      completedCrop.width;

    canvas.height =
      completedCrop.height;

    ctx.drawImage(
      imageEl,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width *
        scaleX,
      completedCrop.height *
        scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob((blob) => {
      if (!blob) return;

      setCroppedImage(blob);

      const url =
        createMediaPreviewUrl(
          blob
        );

      setLocalPreview(url);

      setPreviewKey(Date.now());

      setOpenCropModal(false);
    }, "image/jpeg");
  };

  /* ================= HANDLE THUMBNAIL CROP ================= */

  const handleThumbnailCrop = () => {
    if (
      !thumbnailCompletedCrop ||
      !thumbnailImgRef.current
    )
      return;

    const imageEl =
      thumbnailImgRef.current;

    const canvas =
      document.createElement(
        "canvas"
      );

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    const scaleX =
      imageEl.naturalWidth /
      imageEl.width;

    const scaleY =
      imageEl.naturalHeight /
      imageEl.height;

    canvas.width =
      thumbnailCompletedCrop.width;

    canvas.height =
      thumbnailCompletedCrop.height;

    ctx.drawImage(
      imageEl,
      thumbnailCompletedCrop.x *
        scaleX,
      thumbnailCompletedCrop.y *
        scaleY,
      thumbnailCompletedCrop.width *
        scaleX,
      thumbnailCompletedCrop.height *
        scaleY,
      0,
      0,
      thumbnailCompletedCrop.width,
      thumbnailCompletedCrop.height
    );

    canvas.toBlob((blob) => {
      if (!blob) return;

      const croppedThumbFile =
        new File(
          [blob],
          thumbnailFile?.name ||
            "thumbnail.jpg",
          {
            type: "image/jpeg",
          }
        );

      const url =
        createThumbnailPreviewUrl(
          blob
        );

      setThumbnailFile(
        croppedThumbFile
      );

      setThumbnailPreview(url);

      setThumbnailPreviewKey(
        Date.now()
      );

      setOpenThumbnailCropModal(
        false
      );
    }, "image/jpeg");
  };

  /* ================= UPLOAD ================= */

  const uploadFile = async () => {


    if (!file && !thumbnailFile)
  return;


 const isVideoOrAudio =
    mediaType === "Video" ||
    mediaType === "Audio";

  const isNewMediaUploaded =
    !!file;

  const isThumbnailMissing =
    !thumbnailFile;

  if (
    isVideoOrAudio &&
    isNewMediaUploaded &&
    isThumbnailMissing
  ) {
   
    toast.error("Please upload thumbnail")

    return;
  }

    const token =
      localStorage.getItem(
        "token"
      );

    try {
      setLoading(true);

      let mediaUrl =
        initialMedia?.media_url ||
        null;

      let mediaKey =
        initialMedia?.media_key ||
        null;

      if (file) {
        const res =
          await axios.post(
            `${process.env.NEXT_PUBLIC_DEV_AUTH_URL}/get-media-url`,
            {
              file_name:
                file.name,
              content_type:
                file.type ||
                mediaType,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type":
                  "application/json",
              },
            }
          );

        const uploadUrl =
          res.data.data
            .upload_url;

        mediaKey =
          res.data.data.key;

        mediaUrl =
          res.data.data
            .media_url ||
          uploadUrl.split("?")[0];

        const uploadData =
          croppedImage ?? file;

        await axios.put(
          uploadUrl,
          uploadData,
          {
            headers: {
              "Content-Type":
                file.type ||
                "application/octet-stream",
            },
          }
        );
      }

      let thumbnailKey =
        initialMedia?.thumbnail_key ||
        null;

      if (thumbnailFile) {
        const thumbRes =
          await axios.post(
            `${process.env.NEXT_PUBLIC_DEV_AUTH_URL}/get-media-url`,
            {
              file_name:
                thumbnailFile.name,
              content_type:
                thumbnailFile.type,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type":
                  "application/json",
              },
            }
          );

        const thumbUploadUrl =
          thumbRes.data.data
            .upload_url;

        thumbnailKey =
          thumbRes.data.data.key;

        await axios.put(
          thumbUploadUrl,
          thumbnailFile,
          {
            headers: {
              "Content-Type":
                thumbnailFile.type,
            },
          }
        );

        const latestThumbPreview =
  createThumbnailPreviewUrl(
    thumbnailFile
  );

setThumbnailPreview(
  latestThumbPreview
);

setThumbnailPreviewKey(
  Date.now()
);

        

        setThumbnailPreview(
          latestThumbPreview
        );

        setThumbnailPreviewKey(
          Date.now()
        );
      }

      setMedia({
        media_url: mediaKey || "",
        media_type:
          mediaType.toUpperCase(),
        thumbnail_url:
          thumbnailKey || "",
      });

      if (file) {
        const latestPreview =
          croppedImage
            ? createMediaPreviewUrl(
                croppedImage
              )
            : createMediaPreviewUrl(
                file
              );

        setLocalPreview(
          latestPreview
        );

        setUploadedPreview(null);

        setPreviewKey(Date.now());
      } else {
        setUploadedPreview(
          mediaUrl
        );

        setPreviewKey(Date.now());
      }

      setFile(null);

      setCroppedImage(null);
toast.success("file uploaded successfully")
      
    } catch (error:any) {
      const message =
      error?.response?.data?.message ||  
      error?.response?.data?.error ||    
      error.message ||                   
      "Something went wrong";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const isChanged =
    !!file ||
    !!thumbnailFile ||
    !!croppedImage;

  return (
    <div className="flex items-center justify-between gap-2 h-full w-full">
      {/* LEFT */}

      <div className="flex flex-col gap-4  h-full w-[30%]">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">
            Select Media Type
          </label>

          <div className="grid grid-cols-3 gap-4 mt-2">
            {[
              "Audio",
              "Video",
              "Image",
            ].map((c) => (
              <label
                key={c}
                className="flex items-center gap-2 cursor-pointer font-inter font-medium text-[14px] text-[#747272]"
              >
                <input
                  type="radio"
                  name="mediaType"
                  value={c}
                  checked={
                    mediaType === c
                  }
                  onChange={(e) =>
                    handleMediaTypeChange(
                      e.target.value
                    )
                  }
                />

                {c}
              </label>
            ))}
          </div>

          {mediaType && (
            <span className="text-xs text-[#747272] mt-1">
              Allowed types:{" "}
              {
                allowedTypesMap[
                  mediaType
                ]
              }
            </span>
          )}
        </div>

        <button
          onClick={uploadFile}
          disabled={
            loading || !isChanged
          }
          className={`px-4 py-2 rounded-md text-white cursor-pointer ${
            loading || !isChanged
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
              <p className="text-sm">
                No file selected
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <input
              ref={fileInputRef}
              disabled={!mediaType}
              type="file"
              id="fileUpload"
              accept={
                mediaType ===
                "Image"
                  ? "image/png,image/jpeg,image/jpg,image/webp,image/gif,image/avif"
                  : mediaType ===
                        "Video"
                    ? "video/mp4,video/webm,video/ogg"
                    : "audio/mpeg,audio/wav,audio/ogg,audio/mp4"
              }
              className="hidden"
              onChange={(e) => {
                const f =
                  e.target
                    .files?.[0];

                if (!f) return;

                /* ================= ALLOWED TYPES ================= */

  const allowedTypes =
    mediaType === "Image"
      ? [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/webp",
          "image/gif",
          "image/avif",
        ]
      : mediaType === "Video"
        ? [
            "video/mp4",
            "video/webm",
            "video/ogg",
          ]
        : [
            "audio/mpeg",
            "audio/wav",
            "audio/ogg",
            "audio/mp4",
          ];

  if (!allowedTypes.includes(f.type)) {
    toast.error("File type not supported")

    e.target.value = "";

    return;
  }

                const MAX_SIZE =
                  40 *
                  1024 *
                  1024;

                if (
                  f.size >
                  MAX_SIZE
                ) {
                  toast.error("File size should be less than 40MB")
                  
                  return;
                }

                setFile(f);

                setUploadedPreview(
                  null
                );

                setLocalPreview(
                  null
                );

                setCropSource(
                  null
                );

                setCroppedImage(
                  null
                );

                const url =
                  createMediaPreviewUrl(
                    f
                  );

                if (
                  mediaType ===
                  "Image"
                ) {
                  setCropSource(
                    url
                  );

                  setOpenCropModal(
                    true
                  );
                } else {
                  setLocalPreview(
                    url
                  );

                  setPreviewKey(
                    Date.now()
                  );
                }
              }}
            />

            <label
              htmlFor="fileUpload"
              className={`text-white px-4 py-2 rounded cursor-pointer text-sm font-medium ${
                mediaType
                  ? "bg-green-500"
                  : "bg-[#7e7b7b]"
              }`}
            >
              Choose File
            </label>
          </div>
        </div>

        {/* PREVIEW */}

        {mediaType === "Image" &&
          typeof previewUrl ===
            "string" &&
          previewUrl.trim() !==
            "" && (
            <img
              key={previewKey}
              src={previewUrl}
              alt=""
              className="w-full h-50 object-contain rounded"
            />
          )}

        {mediaType === "Video" &&
          previewUrl && (
            <video
              key={previewKey}
              controls
              className="w-full h-50 mt-2"
            >
              <source
                src={previewUrl}
              />
            </video>
          )}

        {mediaType === "Audio" &&
          previewUrl && (
            <audio
              key={previewKey}
              controls
              className="w-full h-50 mt-2"
            >
              <source
                src={previewUrl}
              />
            </audio>
          )}

        {/* THUMBNAIL SECTION */}

        {(mediaType === "Video" ||
          mediaType ===
            "Audio") && (
          <div className="flex items-center flex-col  gap-3  border-t p-2">
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/avif"
              className="hidden"
              id="thumbnailUpload"
              onChange={(e) => {
                const f =
                  e.target
                    .files?.[0];

                if (!f) return;

                 /* ================= ALLOWED TYPES ================= */

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/gif",
    "image/avif",
  ];

  if (!allowedTypes.includes(f.type)) {
    toast.error("Thumbnail file type not supported")

    e.target.value = "";

    return;
  }

                const MAX_SIZE =
                  5 *
                  1024 *
                  1024;

                if (
                  f.size >
                  MAX_SIZE
                ) {
                  toast.error("Thumbnail should be less than 5MB")
                  return;
                }

                const url =
                  createThumbnailPreviewUrl(
                    f
                  );

                setThumbnailFile(
                  f
                );

                setThumbnailCropSource(
                  url
                );

                setOpenThumbnailCropModal(
                  true
                );
              }}
            />

            <label
              htmlFor="thumbnailUpload"
              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer text-sm "
            >
              Choose Thumbnail
            </label>

            {thumbnailPreview && (
              <img
                key={
                  thumbnailPreviewKey
                }
                src={
                  thumbnailPreview
                }
                className="w-full h-40 object-contain rounded border"
              />
            )}
          </div>
        )}
      </div>

      {/* IMAGE CROP MODAL */}

      {openCropModal &&
        mediaType ===
          "Image" &&
        cropSource && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] max-w-2xl p-4 rounded-lg shadow-lg">
              <ReactCrop
                crop={crop}
                onChange={(c) =>
                  setCrop(c)
                }
                onComplete={(c) =>
                  setCompletedCrop(
                    c
                  )
                }
              >
                <img
                  ref={imgRef}
                  src={cropSource}
                  className="w-full h-40 object-contain"
                />
              </ReactCrop>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() =>
                    setOpenCropModal(
                      false
                    )
                  }
                  className="bg-gray-300 px-4 py-2 rounded font-inter text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    handleCrop
                  }
                  className="bg-green-500 px-4 py-2 rounded text-white font-inter text-sm font-medium"
                >
                  Crop Image
                </button>
              </div>
            </div>
          </div>
        )}

      {/* THUMBNAIL CROP MODAL */}

      {openThumbnailCropModal &&
        thumbnailCropSource && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] max-w-2xl p-4 rounded-lg shadow-lg">
              <ReactCrop
                crop={
                  thumbnailCrop
                }
                onChange={(c) =>
                  setThumbnailCrop(
                    c
                  )
                }
                onComplete={(c) =>
                  setThumbnailCompletedCrop(
                    c
                  )
                }
              >
                <img
                  ref={
                    thumbnailImgRef
                  }
                  src={
                    thumbnailCropSource
                  }
                  className="w-full h-40 object-contain"
                />
              </ReactCrop>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() =>
                    setOpenThumbnailCropModal(
                      false
                    )
                  }
                  className="bg-gray-300 px-4 py-2 rounded font-inter text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    handleThumbnailCrop
                  }
                  className="bg-green-500 px-4 py-2 rounded text-white font-inter text-sm font-medium"
                >
                  Crop Thumbnail
                </button>
              </div>
            </div>
          </div>
        )}
        <Toaster/>
    </div>
  );
}
