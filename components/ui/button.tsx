const Button = (props: any) => {
  return (
    <div>
      <button
        className={`bg-[linear-gradient(280.07deg,#A34E25_0%,#734C82_65%,#522762_100%)] w-full text-[#ffffff] h-10 rounded-sm  font-normal text-sm cursor-pointer`}
        onClick={props.onClick}
      >
        {props.text}
      </button>
    </div>
  );
};

export default Button;
