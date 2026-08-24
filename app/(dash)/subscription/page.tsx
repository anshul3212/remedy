"use client";

import SubscriptionTable from "@/components/ui/subscriptionTable";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const page = () => {
  const [openModal, setOpenModal] = useState(false);
  const modalRef = useRef<HTMLFormElement | null>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [feature, setFeature] = useState("");
  const [featureError, setFeatureError] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");


  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          modalRef.current &&
          !modalRef.current.contains(event.target as Node)
        ) {
          setOpenModal(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (features.length === 0) {
      setFeatureError(true);
      return;
    }


    setName("");
    setPrice("");
    setDuration("");
    setFeatures([]);
    setFeature("");
    setFeatureError(false);

    setOpenModal(false);
  };

  return (
    <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <div className="flex flex-col ">
        <h1 className="font-inter font-medium text-[20px] text-[#000000]">
          Subscriptions
        </h1>

        <div className="flex items-center justify-between">
          <span className="font-normal text-[#2F2F30] font-inter text-sm">
            Manage and monitor all user accounts across the platform
          </span>

          <button
            onClick={() => setOpenModal(true)}
            className="cursor-pointer bg-[#8B5CF6] px-4 py-2 rounded-md flex items-center justify-center gap-1"
          >
            <Plus size={12} color="#ffffff" />

            <span className="text-[#ffffff] font-inter font-semibold text-[11px] ">
              Create New Plan
            </span>
          </button>
        </div>
      </div>

      <SubscriptionTable />

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form
          ref={modalRef}
            className="flex flex-col gap-4 bg-white p-4 rounded-md w-125"
            onSubmit={handleSubmit}
          >
            {/* Plan Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#2F2F30] font-inter">
                Plan Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter plan name"
                required
                className="border border-gray-300 rounded-md px-4 py-3 outline-none text-sm font-inter text-[#747474]"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#2F2F30] font-inter">
                Price
              </label>

              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                placeholder="Enter price"
                required
                min={0}
                className="border border-gray-300 rounded-md px-4 py-3 outline-none text-sm font-inter text-[#747474]"
              />
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#2F2F30] font-inter">
                Duration
              </label>

              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                className="border border-gray-300 rounded-md px-4 py-3 outline-none text-sm font-inter text-[#747474]"
              >
                <option value="" disabled>
                  Select duration
                </option>

                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            {/* Features */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#2F2F30] font-inter">
                Features
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter feature"
                  value={feature}
                  onChange={(e) => setFeature(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-3 outline-none text-sm font-inter text-[#747474] flex-1"
                />

                <button
                  type="button"
                  onClick={() => {
                    if (feature.trim() !== "") {
                      setFeatures([...features, feature]);
                      setFeature("");
                      setFeatureError(false);
                    }
                  }}
                  className="bg-[#8B5CF6] text-white px-4 rounded-md text-sm font-inter cursor-pointer"
                >
                  Add
                </button>
              </div>

              {/* Features List */}
              <div className="flex flex-wrap gap-2 mt-2">
                {features.map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#F3F0FF] text-[#8B5CF6] px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    <span>{item}</span>

                    <button
                      type="button"
                      onClick={() =>
                        setFeatures(
                          features.filter((_, i) => i !== index)
                        )
                      }
                      className="text-red-500 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {featureError && (
                <span className="text-red-500 text-xs font-inter">
                  At least one feature is required
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-sm text-[#333333] cursor-pointer font-inter"
              >
                Cancel
              </button>

              <button
              disabled={
    !name.trim() ||
    !price ||
    !duration ||
    features.length === 0
  }
                type="submit"
                className={`${
    !name.trim() ||
    !price ||
    !duration ||
    features.length === 0
      ? "bg-[#C4B5FD] text-white cursor-not-allowed"
      : "bg-[#8B5CF6] text-white cursor-pointer"
  }  text-white px-5 py-2 rounded-md text-sm cursor-pointer font-inter`}
              >
                Create Plan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default page;