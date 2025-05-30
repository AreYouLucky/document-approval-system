import { FaFileWord, FaArrowAltCircleLeft } from "react-icons/fa";
import { FaBuildingUser } from "react-icons/fa6";
import { BiSolidInfoSquare } from "react-icons/bi";
import { PiEmpty } from "react-icons/pi";
import { HiCursorClick } from "react-icons/hi";


function AuditDocumentInfo({ document, children }) {

    const process_type = [
        { name: "NEW", value: 1 },
        { name: "REVISION", value: 2 },
        { name: "DELETE", value: 3 },
    ];

    const division = [
        { name: "FAD", value: 1 },
        { name: "IRAD", value: 2 },
        { name: "CRPD", value: 3 },
        { name: "OD-MISPS", value: 4 },
    ];
    const convertDate = (date) => {
        if (!date) return "";
        const parsedDate = new Date(date);
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
        };
        const humanReadableDate = parsedDate.toLocaleString("en-US", options);
        return humanReadableDate;
    };
    return (
        <div className='w-full grid grid-cols-11 mb-3 gap-3 roboto-thin'>
            <div className='md:col-span-5 col-span-11 bg-gray-50 dark:bg-gray-800 rounded-lg  border px-5 text-gray-800 flex items-center'>
                {children}
            </div>
            <div className='md:col-span-6 col-span-11  bg-gray-50 dark:bg-gray-800 rounded-lg  border p-6 text-gray-800 '>
                <div className='w-full flex flex-row gap-10 '>
                    <div>
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white"> Document Title: {' '} {document?.latest_revision.title}</h2>
                        <div className="p-2 rounded-lg w-full ">
                            <ul className="space-y-1 text-gray-800 dark:text-gray-400 text-sm roboto-sm ml-2 list-disc list-inside">
                                <li>
                                    <b className="mr-2 font-semibold">Process: </b>
                                    <span >
                                        {process_type.find(pt => pt.value === Number(document.latest_revision?.process_type))?.name || "Unknown Process"}
                                    </span>
                                </li>
                                <li>
                                    <b className="mr-2 font-semibold">Document Type: </b> {document.latest_revision?.document_type || "N/A"}
                                </li>
                                <li>
                                    <b className="mr-2 font-semibold">Version No: </b> {document.latest_revision?.version_no || "N/A"}
                                </li>
                                <li>
                                    <b className="mr-2 font-semibold">Code: </b> {document.code || "N/A"}
                                </li>
                            </ul>
                        </div>

                        <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
                            <FaBuildingUser size={20} className='text-gray-500 mr-2 font-semibold' />
                            Division: {' '}
                            {division.find(dv => Number(dv.value) === Number(document.division))?.name || "Unknown Division"}
                        </h2>
                        <div className="w-full  p-3 rounded-lg">
                            <ul className="space-y-1 text-gray-800 dark:text-gray-400 text-sm  w-full list-disc list-inside">
                                <li>
                                    <b className='mr-2 font-semibold'>Initiator: </b> {' '}
                                    {document.latest_revision?.initiator || 'NA'}
                                </li>
                                <li>
                                    <b className='mr-2 font-semibold'>Date Prepared: </b> {' '}{convertDate(document.latest_revision?.date_prepared || 'NA')}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-50 flex items-center">
                            <BiSolidInfoSquare size={20} className='text-gray-500 mr-2' />
                            Reasons/Details of Request: {' '}
                        </h3>
                        <p className='text-base  mb-2 text-gray-900 dark:text-gray-50'>
                            {document.latest_revision?.reasons || 'NA'}
                        </p>
                        <div className="flex items-center mb-2">
                            {document.latest_revision?.supporting_documents === '' ? (<span className="px-3 py-1 text-xs font-medium text-center inline-flex items-center text-white bg-gray-400 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <PiEmpty size={20} className='text-gray-50 mr-2' />
                                Not available
                            </span>) : (<a href={document.latest_revision?.supporting_documents} target='_blank' className="px-3 py-1 text-xs font-medium text-center inline-flex items-center text-white bg-gray-600 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <HiCursorClick size={15} className='text-gray-50 mr-2' />
                                Supporting Documents
                            </a>)}
                        </div>

                    </div>
                </div>

            </div>

        </div>
    )
}

export default AuditDocumentInfo