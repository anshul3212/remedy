import ChannelTable from "@/components/ui/channelTable";

const page = () => {
    return (
        <div className="font-inter font-bold py-8 px-14 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-100px)]">
      <h1 className="font-inter font-medium text-[20px] text-[#000000]">
        Channel Management
      </h1>
      <div className="">
        <ChannelTable/>
      </div>
        </div>
    );
}

export default page;