import React from 'react';
import { HiOutlineDocumentMagnifyingGlass } from "react-icons/hi2";

function EmptyDocuments() {
    return (
        <div className='border border-gray-600 rounded-lg h-64 w-full text-center flex flex-col items-center justify-center text-gray-700 dark:text-gray-50'>
            <HiOutlineDocumentMagnifyingGlass size={90} className='text-gray-600 dark:text-gray-50' />
            <h1 className="nunito-base text-xl">No Preview Available</h1>
            <span>You can edit your document here after it has been uploaded.</span>
        </div>
    )
}

export default EmptyDocuments