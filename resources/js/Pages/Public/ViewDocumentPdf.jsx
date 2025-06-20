import React from 'react'
import { useEffect, useState } from 'react'
import BreadCrumbs from '@/Components/displays/BreadCrumbs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';


function ViewDocumentVersions() {
    const [url, setUrl] = useState('')

    useEffect(() => {
        const urlParts = window.location.href.split("/");
        const id = urlParts[urlParts.length - 1];
        setUrl(id)
    }, []);

    const tabs = [
        { name: url, url: "" },
    ];




    return (
        <AuthenticatedLayout>
            <div className='w-full p-4'>
                <BreadCrumbs tab={tabs} className="mb-2" />
                <div className="w-full">
                    <div className="overflow-hidden sm:rounded-lg lg:col-span-3 md:col-span-2 border shadow-md border-gray-400 h-fit relative">
                        {url !== '' &&
                            <iframe
                                src={`/pdfviewer/web/viewer.html?file=/storage/iso_documents/${url}`}
                                width="100%"
                                height="900px"
                            />}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

export default ViewDocumentVersions