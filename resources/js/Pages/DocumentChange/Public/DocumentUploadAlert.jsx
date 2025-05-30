import React from 'react'

export default function DocumentUploadAlert() {
    return (
        <div id="alert-additional-content-1" className="p-4 mb-4 text-gray-800 border border-gray-600 rounded-lg  dark:text-gray-300 dark:border-gray-100" role="alert">
            <div className="flex items-center">
                <svg className="shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <h3 className="text-lg nunito-bold font-extrabold">Important Reminders</h3>
            </div>
            <div className="mt-2 mb-2 text-sm text-justify">
                <span className="font-medium">Before submission, please ensure that the uploaded document has been reviewed and approved by the respective Division Chief, and that the Division Chief’s signature is already affixed. Additionally, the file must not exceed 25MB in size, and only Microsoft Excel (.xlsx) or Microsoft Word (.doc/.docx) formats are accepted.</span>
            </div>
        </div>
    )
}
    