const DashCard = (props:any) => {
    return (
        <div className="w-45 h-38 bg-[#ffffff] p-4 rounded-xl shadow-[0px_0px_2px_0px_#00000040] flex flex-col justify-between">
                <div className="flex items-center justify-between ">
                    <h2 className="font-inter text-[#272424] font-semibold text-[12px]">{props.heading}</h2>
                    <div className={`border ${props.borderColor} ${props.bgColor} rounded-full flex items-center justify-center w-8 h-8`}>
                        {props.icon}
                    </div>
                </div>
                
                    <h3 className="text-[#272424] font-inter font-bold text-[20px]">{props.numbers}</h3>
                    <span className="text-[#30AC56] font-inter font-semibold text-[10px]">{props.text}</span>
               
            </div>
    );
}

export default DashCard;