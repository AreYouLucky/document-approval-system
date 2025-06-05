import React from 'react'
import { useState, useRef, useEffect } from 'react';
import DocumentReviewLogs from '@/Pages/Public/DocumentReviewLogs';
import { router } from '@inertiajs/react';
import { CiSquareMore } from "react-icons/ci";


function MoreActions({ item }) {
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
    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={() => setOpen(!open)}
                className=" px-4 py-2 text-sm"
            >
                <CiSquareMore className="w-7 h-7 text-gray-500 dark:text-white" />
            </button>

            {open && (
                <div className="absolute right-0 w-44 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-opacity-5 z-50 col-span-4 animate-slideInRight">
                    <div className="py-1 text-sm text-gray-700 dark:text-gray-100">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => router.visit('/view-document/' + item.revision_id)}>View Document
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

export default MoreActions