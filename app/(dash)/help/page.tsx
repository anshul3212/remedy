import HelpTable from "@/components/ui/helpTable";
import Image from "next/image";

const Page = () => {
  return (
    <div className=" font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <h1 className="font-inter font-medium text-[20px] text-[#000000]">
        Help & Support
      </h1>


<HelpTable/>
    </div>
  );
};

export default Page;
