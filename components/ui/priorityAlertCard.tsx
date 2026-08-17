import Image from "next/image";

const options = ["View", "Hide", "Remove"];
const PriorityAlertCard = (props: any) => {
  return (
    <div className="flex items-center justify-between bg-[#F1F5F9] w-full rounded-[5px] p-2">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-full overflow-hidden relative">
          <Image
            src={props.image}
            alt="profile"
            fill
            unoptimized
            className="object-cover absolute"
          />
        </div>

        <div className="flex flex-col">
          <span className="font-inter font-semibold text-[11px] text-[#272424]">
            Flagged post : {props.info}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-inter font-semibold text-[11px] text-[#272424]">
              by <span className="text-[#8B5CF6]">{props.name}</span>
            </span>

            <div className="w-1 h-1 bg-black rounded-full" />
            <span className="font-inter font-semibold text-[11px] text-[#838383]">
              {props.time}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
        {options.map((label, index) => (
          <button
            key={label}
            onClick={() => props.setActive(index)}
            className={`flex items-center justify-center px-4 py-2  font-inter font-medium rounded-md transition-all duration-300 cursor-pointer text-xs
            ${
              props.active === index
                ? "bg-[#8B5CF6] text-white "
                : "text-[#838383] hover:bg-gray-200"
            }
          `}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PriorityAlertCard;
