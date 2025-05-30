import React from 'react'
import { MdOutlineDateRange } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";
function VersionLogs({ logs }) {
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

    const statusList = [
        { title: "Document Custodian Initial Review", code: 1, value: "For Revision", color: "bg-gray-50" },
        { title: "Document Custodian Initial Review", code: 2, value: "APPROVED", color: "bg-gray-50" },
        { title: "Document Custodian Initial Review", code: 3, value: "Rejected", color: "bg-gray-50" },
        { title: "QMR Review", code: 4, value: "For Revision", color: "bg-gray-50" },
        { title: "QMR Review", code: 5, value: "Approved", color: "bg-gray-50" },
        { title: "QMR Review", code: 6, value: "Rejected", color: "bg-gray-50" },
        { title: "Final Review", code: 7, value: "New version", color: "bg-gray-50" },
    ];

    return (
        <div className='w-full py-2 max-h-[550px] overflow-y-auto'>
            {logs.length > 0 ?
                (
                    <>
                        <ol>
                            {logs.map((revision, index) => (
                                <li className=" mb-2  pt-2 pb-2 px-5 rounded-lg  dark:bg-gray-800" key={index}>
                                    <time className="block mb-2 text-sm font-normal leading-none text-gray-800 dark:text-gray-500 ml-2">Uploaded on {convertDate(revision.date_prepared)}
                                    </time>
                                    {revision.audit_logs && revision.audit_logs.length > 0 ? (
                                        revision.audit_logs.map((log) => {
                                            const matchedStatus = statusList.find((s) => s.code === log.status);
                                            return (
                                                <div
                                                    key={log.id}
                                                    className={`ml-2 border my-3 space-y-1 p-3 relative w-full rounded-md dark:bg-gray-700 text-sm font-normal text-gray-900 dark:text-gray-100 ${matchedStatus ? matchedStatus.color : ""
                                                        }`}
                                                >
                                                    <p><strong>Review Stage:</strong> {matchedStatus ? matchedStatus.title : "Unknown Stage"}</p>
                                                    <p><strong>Status:</strong> {matchedStatus ? matchedStatus.value : "Unknown Status"}</p>
                                                    <p><strong>Remarks:</strong> {log.remarks}</p>
                                                    <p><strong>Date:</strong> {log.audit_date}</p>
                                                    {log.audit_logs_comment && log.audit_logs_comment.length > 0 && (
                                                        <div className="mt-2 relative rounded ">
                                                            <h5 className="font-semibold text-center">Comments:</h5>
                                                            {log.audit_logs_comment.map((comment) => (
                                                                <div key={comment.id} className="p-3 bg-white dark:bg-gray-800 border rounded-lg mt-1 relative">
                                                                    <p className="flex"><strong><FaCircleUser className="text-blue-500 mr-2" size={20} /></strong> {comment.comments}</p>
                                                                    {/* <p className="absolute right-3 bottom-1  text-gray-600 text-xs">{comment.comment_date}</p> */}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-gray-500 text-center py-3 bg-gray-50 rounded-lg">No review logs available.</p>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </>
                ) : (
                    <p>No version logs available.</p>
                )}
        </div>
    )
}

export default VersionLogs