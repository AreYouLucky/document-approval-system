export default function FancyButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                ` relative border-2 border-white rounded-xl  duration-500 group cursor-pointer text-sky-50  overflow-hidden h-14 w-56  bg-gray-800 p-2 flex justify-center items-center font-extrabold  ${disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            <div className="absolute z-10 w-48 h-48 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-gray-700 delay-150 group-hover:delay-75"></div>
            <div className="absolute z-10 w-40 h-40 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-gray-600 delay-150 group-hover:delay-100"></div>
            <div className="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-gray-500 delay-150 group-hover:delay-150"></div>
            <div className="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-gray-500 delay-150 group-hover:delay-200"></div>
            <div className="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-gray-500 delay-150 group-hover:delay-300"></div>
            <p className="z-10">{children}</p>
        </button>
    );
}
