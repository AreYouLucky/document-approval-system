import React from 'react'
import { useEffect, useState } from 'react'
import BreadCrumbs from '@/Components/displays/BreadCrumbs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PDFDocument, rgb } from 'pdf-lib';

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

    const handleDownloadWithStamp = async () => {

        const pdf = `/storage/iso_documents/${url}`;
        const existingPdfBytes = await fetch(pdf).then((res) => res.arrayBuffer());

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();

        pages.forEach((page) => {
            page.drawText('CONTROLLED COPY', {
                x: 50,
                y: 50,
                size: 24,
                color: rgb(1, 0, 0),
                opacity: 0.5,
            });
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = url;
        link.click();
    };




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
                        <button onClick={handleDownloadWithStamp} className='bg-blue-500 text-white p-2 rounded-lg mt-3 border absolute top-8 md:right-8 right-2'>Download a Copy</button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

export default ViewDocumentVersions