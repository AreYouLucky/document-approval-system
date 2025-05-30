import React from 'react';
import { FaFileAlt } from "react-icons/fa";
import { Tooltip } from 'flowbite-react';
import { FaFileDownload } from "react-icons/fa";
import { MdPageview } from "react-icons/md";
import DocumentReviewLogs from '@/Pages/Public/DocumentReviewLogs';
import { useState, useEffect } from 'react';
import { saveAs } from "file-saver";
import { Link, usePage, router } from '@inertiajs/react';

const PdfCard = ({ data }) => {
    const [id, setId] = useState(0);
    const [src, setSrc] = useState();
    const [isReviewDialogOpen, setReviewDialogOpen] = useState(false);
    const convertDate = (date) => {
        if (!date) return "";
        const parsedDate = new Date(date);
        return parsedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };
    const viewDocumentLogs = (id) => {
        setId(id);
        setReviewDialogOpen(true)
    }
    useEffect(() => {
        if (data.file_type === 1) {
            setSrc(`/storage/images/word.png`)
        } else {
            setSrc(`/storage/images/excel.png`)
        }
    }, [])

    const downloadFileFromUrl = async (event) => {
        event.preventDefault();
        if (data.document_dir === '') return
        try {
            const response = await fetch('/storage/iso_documents/' + data.document_dir);
            const blob = await response.blob();
            saveAs(blob, data.document_dir);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    return (
        <section className="relative pt-32 shadow-xl rounded-lg max-w-md mx-auto h-[310px] border overflow-hidden bg-white dark:bg-transparent">
            <div className="w-full rounded-lg">
                <div className="absolute top-0 left-0 w-full h-80 rounded-t-lg overflow-hidden z-0 px-10">
                    <img src={src} alt="" className="w-full h-[50%] object-contain" />
                </div>
                <div className="w-full px-4 pb-4 mt-2 pt-2 bg-gray-100 dark:bg-gray-800 rounded-b-lg relative z-10 min-h-[200px]">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <Tooltip content="View Document Versions" trigger="hover">
                                <button onClick={() => { router.visit('/view-document-versions/'+data.document_id) }}>
                                    <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-700 border-4 border-white rounded-full shadow-md  hover:scale-110 duration-300">
                                        <FaFileAlt className="text-slate-700 dark:text-gray-50 hover:text-blue-600" size={28} />
                                    </div>
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="text-left nunito-regular">
                        <h3 className="text-sm roboto-bold text-gray-900 dark:text-white mb-1">
                            {data.title} v{data.version_no}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                            Effectivity Date: {convertDate(data.effectivity_date)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                            {data.document_type}
                        </p>
                    </div>
                </div>
                <div className='flex gap-2 items-center absolute top-0 right-0 bg-gray-300 dark:bg-gray-500 bg-opacity-30 p-3 rounded-b-lg '>
                    <Tooltip content="Download Document" trigger="hover">
                        <button onClick={downloadFileFromUrl} className="flex items-center justify-center hover:scale-110 duration-300 ">
                            <FaFileDownload className="text-slate-700 dark:text-gray-50 hover:text-blue-600" size={20} />
                        </button>
                    </Tooltip>
                    <Tooltip content="Document Logs" trigger="hover">
                        <button onClick={() => viewDocumentLogs(data.document_id)} className="flex items-center justify-center hover:scale-110 duration-300">
                            <MdPageview className="text-slate-700 dark:text-gray-50 hover:text-blue-600" size={25} />
                        </button>
                    </Tooltip>
                </div>
            </div>
            <DocumentReviewLogs show={isReviewDialogOpen} onClose={() => setReviewDialogOpen(false)} id={id} />
        </section>
    );
};

export default PdfCard;
