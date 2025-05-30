import React from 'react'

export default function DocumentAuditAlert() {
    return (
        <div id="alert-additional-content-1" className="p-4 mb-4 text-blue-800 border border-blue-400 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800" role="alert">
            <div className="flex items-center">
                <svg className="shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <h3 className="text-lg nunito-bold font-extrabold">Important Reminders</h3>
            </div>
            <div className="mt-2 mb-2 text-xs text-justify">
                <span className="font-medium">You can use the fields below to write comments or highlight any text on the word file and right click and add comment.</span>
            </div>
        </div>
    )
}
