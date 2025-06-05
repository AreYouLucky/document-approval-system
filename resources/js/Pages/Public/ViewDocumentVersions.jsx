import React from 'react'
import { useEffect, useState } from 'react'
import BreadCrumbs from '@/Components/displays/BreadCrumbs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import axios from 'axios';
import VersionLogs from './Partials/VersionLogs';
import { Head } from '@inertiajs/react';

function ViewDocumentVersions() {
    const [data, setData] = useState([]);
    const [currentData, setCurrentData] = useState({
        pdf_dir: ''
    });
    const [documentId, setDocumentId] = useState(0);
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        const urlParts = window.location.href.split("/");
        const id = urlParts[urlParts.length - 1];
        setDocumentId(id);
        getDocumentVersions(id);
    }, []);

    const tabs = [
        { name: title, url: "" },
    ];

    const getDocumentVersions = (id) => {
        try {

            axios.get('/get-document-versions/' + id).then(
                res => {
                    setData(res.data.versions);
                    setTitle(res.data.code);
                    setCurrentData(res.data.versions[0]);
                    getVersionLogs(id, res.data.versions[0].revision_id);
                }
            )
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching document versions:", error);
        }
    }


    const getVersionLogs = (document_id, revision_id) => {
        axios.get('/get-document-version-history/' + document_id + '/' + revision_id).then(
            res => {
                setLogs(res.data.revisions);
            }
        )
    }

    const handleVersionChange = (e) => {
        const selectedVersion = e.target.value;
        const selected = data.find(d => d.version_no == selectedVersion);
        setCurrentData(selected);
        getVersionLogs(documentId, selected.revision_id)
    };

    const handleDownloadWithStamp = async () => {
        const url = `/storage/iso_documents/${currentData.pdf_dir}`;
        const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

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
        link.download = currentData.pdf_dir;
        link.click();
    };



    return (
        <AuthenticatedLayout>
            <Head title={currentData.title} />
            <div className='w-full p-4'>
                <BreadCrumbs tab={tabs} className="mb-2" />
                <div className="w-full md:grid lg:grid-cols-4 md:grid-cols-3 gap-4 flex flex-col-reverse">
                    <div className="overflow-hidden sm:rounded-lg lg:col-span-3 md:col-span-2 border shadow-md border-gray-400 h-fit">
                        {currentData.pdf_dir !== '' &&
                            <iframe
                                src={`/pdfviewer/web/viewer.html?file=/storage/iso_documents/${currentData.pdf_dir}`}
                                width="100%"
                                height="900px"
                            />}

                    </div>

                    <div className=''>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg border p-6 text-gray-800 dark:text-gray-50 roboto-thin h-fit w-full">
                            <h2 className="text-xl font-bold mb-2">{currentData.title}</h2>
                            <div className="my-2">
                                <InputLabel htmlFor="version" value="Select Version" />
                                <SelectInput
                                    id="version"
                                    items={data}
                                    itemValue="version_no"
                                    itemName="version_no"
                                    name="version"
                                    defaultValue={currentData.version_no}
                                    onChange={handleVersionChange}
                                />
                            </div>
                            {currentData && (
                                <div className="p-4 rounded-lg border border-gray-400 text-sm roboto-thin spacing-y-4 ">
                                    <p><strong> Type:</strong> {currentData.document_type}</p>
                                    <p><strong> Code:</strong> {title}</p>
                                    <p><strong>Initiator:</strong> {currentData.process_owner}</p>
                                    <p><strong>Effectivity Date:</strong> {currentData.effectivity_date}</p>
                                    <p><strong>Reasons:</strong> {currentData.reasons}</p>
                                </div>
                            )}
                            <button onClick={handleDownloadWithStamp} className='bg-blue-500 text-white p-2 rounded-lg mt-3 border'>Download a Copy</button>

                        </div>
                        <div className='py-2 w-full mt-1 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg border text-gray-800 dark:text-gray-50 roboto-thin'>
                            <div className='w-full pt-4'>
                                <h2 className="text-xl font-bold text-center">Version Logs</h2>
                            </div>
                            <VersionLogs logs={logs} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

export default ViewDocumentVersions