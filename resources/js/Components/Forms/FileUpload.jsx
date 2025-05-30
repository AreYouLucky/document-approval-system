import { FileInput, Label } from "flowbite-react";
import { useRef } from "react";
import { RiFileUploadFill } from "react-icons/ri";
import { FaFileAlt } from "react-icons/fa";


const FileUpload = ({
    className,
    title = "",
    subtitle = "",
    fileName="",
    ...props
}) => {
    const fileInputRef = useRef(null);

    return (
        <div className="flex w-full items-center justify-center">
            <Label
                htmlFor="dropzone-file"
                className={`flex h-50 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600 ${className}`}
            >
                {fileName === '' ? (<div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <RiFileUploadFill size={'50'} />
                    <p className="mb-2 text-sm text-gray-800 dark:text-gray-400 font-semibold">
                        {title}
                    </p>
                    <p className="text-xs text-gray-800 dark:text-gray-400">{subtitle}</p>
                </div>) :  (<div className="flex flex-col items-center justify-center pb-6 pt-5 px-2">
                    <FaFileAlt  size={'50'} />
                    <p className="mt-2 text-sm text-gray-800 dark:text-gray-400 font-semibold text-center">
                        {fileName}
                    </p>
                </div>)
                }
                <FileInput id="dropzone-file" ref={fileInputRef} className="hidden" {...props} />
            </Label>
        </div>
    );
};

export default FileUpload;
