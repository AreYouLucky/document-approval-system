import React, { useEffect, useState } from 'react';
import { FaCircleCheck } from "react-icons/fa6";
import { Link, usePage } from '@inertiajs/react';

function DoneReview() {
    const { auth: { user } } = usePage().props;
    const [link, setLink] = useState('');

    useEffect(() => {
        if (user.qms_role === 'Document Custodian') {
            setLink('/dc/initial-review-list');
        } else {
            setLink('/qmr/document-list');
        }
    }, [user.qms_role]);

    return (
        <div className='w-full flex justify-center'>
            <div className='bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-50 w-3/4 shadow-md rounded-lg p-10 text-center'>
                <div className='w-full flex justify-center py-2'>
                    <FaCircleCheck size={80} className='text-green-400' />
                </div>

                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    You've already submitted a review for this document.
                </h5>
                <span className="text-base text-gray-500 dark:text-gray-400">Thank you!</span> <br />
                
                {/* Only render the link when it's ready */}
                {link && (
                    <Link 
                        href={link} 
                        className="mt-3 inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        View Document List
                    </Link>
                )}
            </div>
        </div>
    )
}

export default DoneReview;
