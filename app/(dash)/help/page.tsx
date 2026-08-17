import HelpTable from "@/components/ui/helpTable";
import Image from "next/image";

const Page = () => {
  return (
    <div className=" font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <h1 className="font-inter font-medium text-[20px] text-[#000000]">
        Help & Support
      </h1>

      {/* <div className="flex flex-wrap gap-4">
  {Array.from({ length: 15 }).map((_, index) => (
    <div
      key={index}
      className="p-4 rounded-xl border w-[30%] border-[#706f6f63] flex flex-col items-center justify-center gap-4"
    >
      <div className="w-20 h-20 rounded-full relative overflow-hidden">
        <Image
          src={"/logo.png"}
          alt="user profile"
          fill
          className="object-cover relative"
        />
      </div>

      <div className="flex flex-col items-center justify-center">
        <span className="font-inter text-sm font-medium text-[#333333]">
          user name
        </span>

        <span className="font-inter text-lg font-medium text-[#747474]">
          email
        </span>
      </div>

      <div className="flex items-center justify-between w-full">
        <span className="font-inter text-sm font-medium text-[#7d7d7d]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Saepe rem facere, nesciunt neque tenetur numquam cumque
          tempora eveniet id porro culpa adipisci nam enim distinctio,
          sunt consequatur!
        </span>
      </div>

      <div className="flex items-center">
        <button className="px-4 py-2 bg-green-400 border border-[#fdfdfd] rounded-md text-white text-sm font-inter font-medium">
          Resolved
        </button>
      </div>
    </div>
  ))}
</div> */}

<HelpTable/>
    </div>
  );
};

export default Page;
