const Input = (props: any) => {
  return (
    <div className={`flex flex-col ${props.width?props.width:"w-full"}  gap-3 justify-center`}>
      <label className=" font-medium font-inter text-sm text-[#000000] ">
        {props.label}
      </label>
      <input
        required
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        className=" font-normal text-sm text-[#000000bf] font-inter  border border-[#4C4C52] rounded-sm outline-none w-full h-10 pl-4"
      />
    </div>
  );
};

export default Input;
