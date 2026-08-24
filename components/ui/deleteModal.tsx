"use client";

import { X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type DeleteModalProps = {
  setOpenModal: (value: boolean) => void;
  id: string;
  onDelete: (id: string, reason: string) => Promise<void>;
  title?: string;
  placeholder?: string;
};

const DeleteModal = ({
  setOpenModal,
  id,
  onDelete,
  title = "Please Specify Deleting Reason",
  placeholder = "Enter Reason",
}: DeleteModalProps) => {
  const [reason, setReason] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    if (!reason.trim()) return;

    try {
      setDeleteLoading(true);

      await onDelete(id, reason);

      setReason("");
      setOpenModal(false);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleClose = () => {
    if (deleteLoading) return;

    setOpenModal(false);
    setReason("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="shadow-md bg-[white] border border-[#787878] rounded-2xl w-155.75 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-normal text-[black] font-inter">
            {title}
          </h2>

          <X
            color="black"
            size={23}
            onClick={handleClose}
            className="cursor-pointer"
          />
        </div>

        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-[#7d7d7d] p-2 rounded-md text-sm outline-none h-12"
        />

        <div className="flex justify-end gap-2">
          {/* Cancel Button */}
          <button
            disabled={deleteLoading}
            onClick={handleClose}
            className={`px-4 py-2 text-sm border border-[#7d7d7d] rounded-sm font-inter text-[12px] font-medium text-[#242323] min-w-35.75 ${
              deleteLoading
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
          >
            Cancel
          </button>

          {/* Delete Button */}
          <button
            disabled={!reason.trim() || deleteLoading}
            onClick={handleDelete}
            className={`px-4 py-2 text-sm rounded-sm font-inter text-[12px] font-medium text-[white] bg-red-500 min-w-35.75 ${
              !reason.trim() || deleteLoading
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
          >
            {deleteLoading ? "Deleting" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;