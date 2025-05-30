import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { FaBuildingUser } from "react-icons/fa6";
import { BiSolidInfoSquare } from "react-icons/bi";
import { PiEmpty } from "react-icons/pi";
import { HiCursorClick } from "react-icons/hi";

import React, { useEffect, useState, useRef } from 'react';
import BreadCrumbs from '@/Components/displays/BreadCrumbs';
import { SpreadsheetComponent } from '@syncfusion/ej2-react-spreadsheet';
import { DocumentEditorContainerComponent, Toolbar, Inject, Print } from '@syncfusion/ej2-react-documenteditor';

export default function ViewDocument() {
    const user = usePage().props.auth.user;

    let items = [
        "Find"
    ];

    const [document, setDocument] = useState({});
    const [url, setUrl] = useState('/document-list');
    const spreadsheetRef = useRef(null);
    const process_type = [
        { name: "NEW", value: 1 },
        { name: "REVISION", value: 2 },
        { name: "DELETE", value: 3 },
    ];

    const tabs = [
        { name: "Document List", url: url },
        { name: document?.title, url: "" },
    ];

    const division = [
        { name: "FAD", value: 1 },
        { name: "IRAD", value: 2 },
        { name: "CRPD", value: 3 },
        { name: "OD-MISPS", value: 4 },
    ];
    let editorObj = null;
    useEffect(() => {
        fetchDocument();

        if (user.qms_role === 'Process Owner') {
            setUrl('/process/pending-list')
        }
        else if (user.qms_role === 'QMR') {
            setUrl('/qmr/pending-list')
        }
        else {
            setUrl('/dc/initial-review-list')
        }

    }, []);

    useEffect(() => {
        if (Number(document.file_type) === 1) {
            importDocument();
        } else {
            importExcel();
        }
    }, [document]);

    const convertDate = (date) => {
        if (!date) return "";
        const parsedDate = new Date(date);
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
        };
        const humanReadableDate = parsedDate.toLocaleString("en-US", options);
        return humanReadableDate;
    };
    const enforceProtection = () => {
        editorObj?.documentEditor.editor.enforceProtection('123', 'ReadOnly');
    }

    //Handle Document Event
    const importDocument = async () => {
        if (document.document_dir) {
            const fileUrl = '/storage/iso_documents/' + document.document_dir;
            try {
                const response = await fetch(fileUrl);
                const blob = await response.blob();
                const reader = new FileReader();

                reader.onload = (e) => {
                    if (editorObj?.documentEditor) {
                        editorObj.documentEditor.open(e.target.result);

                        editorObj.documentEditor.documentChange = () => {
                            enforceProtection();
                            editorObj.documentEditor.documentChange = null;
                        };
                    }
                };

                reader.readAsDataURL(blob);
            } catch (error) {
                console.error('Error loading document:', error);
            }
        }
    };

    //Handle Excel Event
    const importExcel = async () => {
        if (document.document_dir) {
            const fileUrl = `/storage/iso_documents/${document.document_dir}`;
            const response = await fetch(fileUrl, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                },
            });
            const fileBlob = await response.blob();
            const file = new File([fileBlob], 'Sample.xlsx');
            let spreadsheet = spreadsheetRef.current;
            if (spreadsheet) {
                spreadsheet.open({ file });
            }
        }
    }

    const fetchDocument = () => {
        const urlParts = window.location.href.split("/");
        const id = urlParts[urlParts.length - 1];
        axios.get('/get-document/' + id).then(
            res => {
                setDocument(res.data);
            }
        )
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    View Document
                </h2>
            }
        >
            <Head title="View Document" />

            <div className="w-full px-5  py-4 ">
                <BreadCrumbs tab={tabs} className="mb-2" />
                {document &&
                    <div className="w-full md:grid md:grid-cols-4 gap-4 flex flex-col-reverse">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg md:col-span-3 ">
                            {document.file_type === 1 ? (
                                <div className='w-full'>
                                    <DocumentEditorContainerComponent height={'95vh'} 
                                        serviceUrl="https://localhost:7087/api/documenteditor/"
                                        ref={(ins => editorObj = ins)}
                                        enableToolbar={true}
                                        toolbarItems={items}
                                        showPropertiesPane={false}>
                                        <Inject services={[Toolbar]}></Inject>
                                    </DocumentEditorContainerComponent>
                                </div>
                            ) : (
                                <div className='w-full'>
                                    <SpreadsheetComponent
                                        ref={spreadsheetRef} height={'95vh'}
                                        allowEditing={false}
                                        openUrl="https://localhost:7086/api/Spreadsheet/Open"
                                        allowOpen={true}
                                    />
                                </div>
                            )}
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 rounded-lg shadow-xl p-6 text-gray-800 roboto-thin h-fit'>
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white"> Document Title: {' '} {document.title}</h2>
                            <div className="p-2 rounded-lg w-full ">
                                <ul className="space-y-1 text-gray-800 dark:text-gray-400 text-sm roboto-sm ml-2 list-disc list-inside">
                                    <li>
                                        <b className="mr-2 font-semibold">Process: </b>
                                        <span >
                                            {process_type.find(pt => pt.value === Number(document.process_type))?.name || "Unknown Process"}
                                        </span>
                                    </li>
                                    <li>
                                        <b className="mr-2 font-semibold">Version No: </b> {document.version_no || "N/A"}
                                    </li>
                                    <li>
                                        <b className="mr-2 font-semibold">Code: </b> {document.code || "N/A"}
                                    </li>
                                </ul>
                            </div>
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
                                <FaBuildingUser size={20} className='text-gray-500 mr-2 font-semibold' />
                                Division: {' '}
                                {division.find(dv => Number(dv.value) === Number(document.division))?.name || "Unknown Division"}
                            </h2>
                            <div className="w-full  p-3 rounded-lg">
                                <ul className="space-y-1 text-gray-800 dark:text-gray-400 text-sm  w-full list-disc list-inside">
                                    <li>
                                        <b className='mr-2 font-semibold'>Date Prepared: </b> {' '}{convertDate(document.date_prepared || 'NA')}
                                    </li>
                                </ul>
                            </div>
                            <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-50 flex items-center">
                                <BiSolidInfoSquare size={20} className='text-gray-500 mr-2' />
                                Reasons/Details of Request: {' '}
                            </h3>
                            <p className='text-base  mb-2 text-gray-900 dark:text-gray-50'>
                                {document.reasons || 'NA'}
                            </p>
                            <div className="flex items-center mb-2">
                                {document.latest_revision?.supporting_documents === '' ? (<span className="px-3 py-1 text-xs font-medium text-center inline-flex items-center text-white bg-gray-400 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <PiEmpty size={20} className='text-gray-50 mr-2' />
                                    Not available
                                </span>) : (<a href={document.supporting_documents} target='_blank' className="px-3 py-1 text-xs font-medium text-center inline-flex items-center text-white bg-gray-600 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <HiCursorClick size={15} className='text-gray-50 mr-2' />
                                    Supporting Documents
                                </a>)}
                            </div>
                        </div>
                    </div>
                }

            </div>
        </AuthenticatedLayout>
    );
}
