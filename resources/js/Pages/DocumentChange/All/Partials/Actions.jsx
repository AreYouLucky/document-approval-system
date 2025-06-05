import React from 'react'
import { useState, useRef, useEffect } from 'react';
import DocumentReviewLogs from '@/Pages/Public/DocumentReviewLogs';
import { router, usePage } from '@inertiajs/react';
import { CiSquareMore } from "react-icons/ci";
import { saveAs } from 'file-saver';

function Actions({ item }) {
    const { auth } = usePage().props;
    const [id, setId] = useState(0);
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const [isReviewDialogOpen, setReviewDialogOpen] = useState(false);
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const viewDocumentLogs = (id) => {
        setId(id);
        setReviewDialogOpen(true)
    }


    const downloadFileFromUrl = async () => {
        try {
            console.log(item.document_dir)
            const response = await fetch('/storage/iso_documents/' + item.document_dir);
            const blob = await response.blob();
            saveAs(blob, item.document_dir);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };





    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={() => setOpen(!open)}
                className="m-1"
            >
                <CiSquareMore className="w-7 h-7 text-gray-500 dark:text-white" />
            </button>

            {open && (
                <div className="absolute right-0 w-44 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-opacity-5 z-50 col-span-4 animate-slideInRight">
                    <div className="py-1 text-sm text-gray-700 dark:text-gray-100">
                        {auth.user.full_name == item.process_owner &&
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => { router.visit('/request-document-change/' + item.code) }}>
                                Request Change
                            </button>
                        }
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => { router.visit('/view-document-versions/' + item.document_id) }}>
                            Version Logs
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={downloadFileFromUrl}>
                            Download Document
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => viewDocumentLogs(item.document_id)}>
                            Review Logs
                        </button>
                    </div>
                </div>
            )}

            <DocumentReviewLogs show={isReviewDialogOpen} onClose={() => setReviewDialogOpen(false)} id={id} />
        </div>
    )
}

export default Actions