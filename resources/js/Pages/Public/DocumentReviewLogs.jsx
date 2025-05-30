import React, { memo, useEffect, useState } from "react";
import Modal from "@/Components/Forms/Modal";
import PrimaryButton from "@/Components/Forms/PrimaryButton";
import { MdOutlineDateRange } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";

function DocumentReviewLogs({ show, onClose, id = 0 }) {
    const [document, setDocument] = useState([]);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (id === 0) {
            return;
        }
        getDocumentTimeline()
    }, [id])

    const getDocumentTimeline = () => {
        setProcessing(true)
        axios.get('/get-document-timeline/' + id).then(
            res => {
                setDocument(res.data)
                setProcessing(false)
            }
        )
    }

    const statusList = [
        { title: "Document Custodian Initial Review", code: 1, value: "For Revision", color: "bg-yellow-50" },
        { title: "Document Custodian Initial Review", code: 2, value: "APPROVED", color: "bg-blue-50" },
        { title: "Document Custodian Initial Review", code: 3, value: "Rejected", color: "bg-red-50" },
        { title: "QMR Review", code: 4, value: "For Revision", color: "bg-yellow-50" },
        { title: "QMR Review", code: 5, value: "Approved", color: "bg-blue-50" },
        { title: "QMR Review", code: 6, value: "Rejected", color: "bg-red-50" },
        { title: "Final Review", code: 7, value: "New version", color: "bg-blue-50" },
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
        <>
            <Modal show={show} onClose={onClose} maxWidth="4xl">
                <div className="px-15">
                    <div className=" p-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 rounded-xl">
                        <div className="">
                            <h2 className="text-xl w-full px-5 pt-5 text-center roboto-bold">DOCUMENT TIMELINE</h2>
                        </div>
                        <div className="w-full px-5 mt-2 nunito-sm">
                            <div className="w-full max-h-[80vh] px-5 pb-5 overflow-y-auto rounded-lg">
                                <ol className="relative border-s border-gray-200 dark:border-gray-700">
                                    {processing === false ?
                                        <>
                                            {document.map((revision, index) => (
                                                <li className="mt-2 mb-4 ms-6  p-5 rounded-lg  dark:bg-gray-800 border" key={index}>
                                                    <span className="mr-2 absolute flex items-center justify-center w-6 h-6 bg-gray-800 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                                        <MdOutlineDateRange size={16} className="text-gray-50" />
                                                    </span>
                                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white ml-2">{revision.title} v{revision.version_no}
                                                        {index === 0 && <span className="bg-slate-400 text-gray-50 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300 ms-3">Latest</span>}
                                                        {revision.is_new_version === 1 && <span className="bg-slate-500 text-gray-50 text-sm font-medium px-2.5 py-0.5 rounded-sm  ">Approved Version</span>}
                                                    </h3>
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
                                                                    <span className="absolute right-3 top-3  text-gray-600 text-xs"> {log.audit_date}</span>

                                                                    {log.audit_logs_comment && log.audit_logs_comment.length > 0 && (
                                                                        <div className="mt-2 relative rounded ">
                                                                            <h5 className="font-semibold text-center">Comments:</h5>
                                                                            {log.audit_logs_comment.map((comment) => (
                                                                                <div key={comment.id} className="p-3 bg-white border rounded-lg mt-1 relative">
                                                                                    <p className="flex"><strong><FaCircleUser className="text-blue-500 mr-2" size={20} /></strong> {comment.comments}</p>
                                                                                    <p className="absolute right-3 bottom-1  text-gray-600 text-xs">{comment.comment_date}</p>
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
                                        </> :
                                        <>
                                            <div className="w-full flex justify-center items-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                                <span className="ml-3 text-gray-500">
                                                    Loading...
                                                </span>
                                            </div>
                                        </>}
                                </ol>

                            </div>
                        </div>

                        <button className="rounded-lg dark:text-gray-50 text-gray-800 absolute top-5 right-5 font-bold" onClick={onClose}>
                            X
                        </button>
                    </div>
                </div>

            </Modal>
        </>
    )
}

export default DocumentReviewLogs