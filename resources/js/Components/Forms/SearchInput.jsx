import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { CiSearch } from "react-icons/ci";
export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);


    return (
        <div className="flex w-full relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-20">
                <CiSearch className="text-gray-500 dark:text-gray-50" size={18} />
            </div>
            <input
                {...props}
                type={type}
                className="block py-2.5 ps-10 text-sm text-gray-900 border border-gray-600 rounded-lg w-80 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                ref={localRef}
            />
        </div>

    );

});
