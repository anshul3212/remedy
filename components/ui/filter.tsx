"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface FilterOption<T extends string = string> {
  value: T;
  label: string;
}

interface FilterSelectorProps<T extends string = string> {
  value?: T;
  options: FilterOption<T>[];
  onSelect: (value: T) => void;
  placeholder?: string;
  width?: string;
}

const FilterSelector = <T extends string>({
  value,
  options,
  onSelect,
  placeholder = "Select",
  width = "min-w-50",
}: FilterSelectorProps<T>) => {
  const [open, setOpen] = useState(false);

  const selectorRef =
    useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find(
    (option) => option.value === value,
  );

  const selectedLabel =
    selectedOption?.label || placeholder;

  const handleSelect = (value: T) => {
    onSelect(value);
    setOpen(false);
  };

  /* ================= CLICK OUTSIDE ================= */

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  return (
    <div
      ref={selectorRef}
      className={`relative ${width}`}
    >
      {/* SELECTED VALUE */}

      <div
        onClick={() =>
          setOpen((prev) => !prev)
        }
        className="bg-white h-12 w-full flex items-center justify-between px-4 rounded-[5.75px] border-[0.41px] border-[#D8D8D8] cursor-pointer"
      >
        <span className="text-black text-[14px] font-medium truncate">
          {selectedLabel}
        </span>

        <ChevronDown
          size={20}
          color="black"
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* DROPDOWN */}

      {open && (
        <div className="absolute top-[calc(100%+1px)] left-0 w-full max-h-64 overflow-y-auto scrollbar-track-transparent scrollbar-thin scrollbar-thumb-white bg-white border border-[#D8D8D8] z-50 rounded-sm">
          {options.map((option) => {
            const isSelected =
              value === option.value;

            return (
              <div
                key={option.value}
                onClick={() =>
                  handleSelect(
                    option.value,
                  )
                }
                className={`w-full h-16 px-4 flex items-center justify-between text-left cursor-pointer ${
                  isSelected
                    ? "bg-[#8A2BE2]/20"
                    : ""
                }`}
              >
                <span className="text-black text-[14px] font-medium">
                  {option.label}
                </span>

                <div className="w-4 h-4 rounded-full border border-[#B8B8B8] flex items-center justify-center">
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[#8A2BE2]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterSelector;