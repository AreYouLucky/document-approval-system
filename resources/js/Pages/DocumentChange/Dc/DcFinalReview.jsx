import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useRef, useState, useEffect } from 'react';
import BreadCrumbs from '@/Components/displays/BreadCrumbs';
import DoneReview from '@/Components/AddOnsCard/DoneReview';
import { FaBuildingUser } from "react-icons/fa6";
import { BiSolidInfoSquare } from "react-icons/bi";
import { PiEmpty } from "react-icons/pi";
import { HiCursorClick } from "react-icons/hi";
import { SpreadsheetComponent } from '@syncfusion/ej2-react-spreadsheet';
import { DocumentEditorContainerComponent, Toolbar, Inject, Print } from '@syncfusion/ej2-react-documenteditor';
import PrimaryButton from '@/Components/Forms/PrimaryButton';
import AffixSignatureNote from './Partial/AffixSignatureNote';
import RemoveSignatureNote from './Partial/RemoveSignatureNote';
import InputError from '@/Components/Forms/InputError';
import SavePdfNote from './Partial/SavePdfNote';
import { saveAs } from "file-saver";
import SuccessDialogs from '@/Components/Toasts/SuccessDialogs';
import Checkbox from '@/Components/Forms/Checkbox';
import FileUpload from '@/Components/Forms/FileUpload';


export default function DcFinalReview() {
    const tabs = [
        { name: "ISO Documents", url: "/dc/view-documents" },
        { name: "Document Custodian Final Review", url: "" },
    ];
    const [ip, setIp] = useState('');
    const [document, setDocument] = useState({});
    const [file, setFile] = useState({});
    const [link, setLink] = useState('');
    const [pdf, setPdf] = useState('');
    const [fileName, setFileName] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [showUploadFields, setShowUploadFields] = useState(false);
    const [errors, setErrors] = useState({});
    const [isDownload, setIsDownload] = useState(false);
    const [successDialog, setSuccessDialog] = useState(false)
    const [message, setMessage] = useState('')
    const [isFinal, setIsFinal] = useState(true)
    const division = [
        { name: "FAD", value: 1 },
        { name: "IRAD", value: 2 },
        { name: "CRPD", value: 3 },
        { name: "OD-MISPS", value: 4 },
    ];

    const spreadsheetRef = useRef(null);
    let editorObj = null;
    const process_type = [
        { name: "NEW", value: 1 },
        { name: "REVISION", value: 2 },
        { name: "DELETE", value: 3 },
    ];

    useEffect(() => {
        axios.get('/api-ip').then(
            res => {
                setIp(res.data)
                getDocument();
            }
        )
    }, [])


    useEffect(() => {
        openDocument();
    }, [file])

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

    const convertDateSignature = (date) => {
        if (!date) return "";
        const parsedDate = new Date(date);
        const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        };
        const humanReadableDate = parsedDate.toLocaleString("en-US", options);
        return humanReadableDate;
    };

    const getDocument = () => {
        const urlParts = window.location.href.split("/");
        const id = urlParts[urlParts.length - 1];
        axios.get(`/dc/get-final-review-document-details/${id}`).then(res => {
            setDocument(res.data.document);
            getFile(res.data.document.latest_revision.document_dir)
        }).catch(error => {
            console.error("Error fetching document:", error);
        });
    }
    const openDocument = () => {
        if (document.latest_revision?.file_type === 1) {
            if (editorObj && editorObj.documentEditor) {
                editorObj.documentEditor.open(file);
            }
        } else {
            if (spreadsheetRef?.current) {
                spreadsheetRef.current.open({ file: file });
            }
        }
    };

    const getFile = async (filename) => {
        try {
            const fileUrl = `/storage/iso_documents/${filename}`;
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error("File not found")
            const blob = await response.blob();
            const file = new File([blob], filename, { type: blob.type });
            setFile(file)
        } catch (error) {
            console.error("Error fetching file:", error);
        }
    };

    const parseCell = (cell) => {
        const match = cell.match(/([A-Z]+)(\d+)/);
        if (match) {
            return [match[1], parseInt(match[2])];
        }
        return ["A", 1];
    };

    const toBase64 = (url) => {
        return new Promise((resolve, reject) => {
            const img = new window.Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function () {
                const canvas = window.document.createElement('canvas');
                canvas.width = this.naturalWidth;
                canvas.height = this.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(this, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            };
            img.onerror = reject;
            img.src = url;
        });
    };

    const insertSignature = async (number) => {

        let dateProcessed = convertDateSignature(document.latest_revision?.effectivity_date);
        let imageUrl = '/storage/signatures/qmr.png';

        if (Number(number) === 1) {
            imageUrl = '/storage/signatures/fad_chief.png';
        } else if (Number(number) === 2) {
            imageUrl = '/storage/signatures/irad_chief.png';
        } else if (Number(number) === 3) {
            imageUrl = '/storage/signatures/crpd_chief.png';
        } else if (Number(number) === 4) {
            imageUrl = '/storage/signatures/misps_chief.png';
        } else {
            dateProcessed = convertDateSignature(document.latest_revision?.effectivity_date);
        }

        if (document.latest_revision?.file_type === 1) {
            const base64Image = await toBase64(imageUrl);
            editorObj.documentEditor.editor.insertImage(base64Image, 150, 80);
            editorObj.documentEditor.editor.insertText('\n');
            editorObj.documentEditor.editor.insertText(dateProcessed);
        }
        if (spreadsheetRef.current && Number(document.latest_revision?.file_type) === 2) {
            console.log('I am here')
            const spreadsheet = spreadsheetRef.current;
            const activeSheet = spreadsheet.getActiveSheet();
            const selectedRange = activeSheet.selectedRange;

            const [col, row] = parseCell(selectedRange);
            const nextRow = row + 1;
            try {
                const file = await getsignature(imageUrl);
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        spreadsheet.insertImage([
                            { src: reader.result, width: 100, height: 50, range: selectedRange }
                        ]);
                    };
                    reader.readAsDataURL(file);
                }
                let cell = spreadsheet.getCell(nextRow - 1, col.charCodeAt(0) - 65);
                let existingValue = cell ? cell.innerText.trim() : '';
                spreadsheet.updateCell({ value: existingValue ? dateProcessed + '\n' + existingValue : dateProcessed }, `${col}${nextRow}`);


            } catch (error) {
                console.error("Error inserting image:", error);
            }
        }
    };

    const getsignature = async (fileUrl) => {
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error("File not found");
            const blob = await response.blob();
            return new File([blob], 'signature', { type: blob.type });
        } catch (error) {
            console.error("Error fetching file:", error);
            return null;
        }
    };

    const beforeSave = (args) => {
        args.needBlobData = true;
        args.isFullPost = false;
    }

    const saveComplete = (args) => {
        if (isDownload === true) {
            saveAs(args.blobData, "document.xlsx");
            setIsDownload(false);
            return;
        }
        const formData = new FormData();
        formData.append('file', args.blobData, 'document.xlsx');
        formData.append('filename', document.latest_revision?.document_dir);
        formData.append('file_type', document.latest_revision?.file_type);
        formData.append('version', document.latest_revision?.version_no);
        formData.append('pdf_name', getOriginalName(document.latest_revision?.document_dir) + '_' + document.latest_revision?.version_no + '.pdf');
        formData.append('revision_id', document.latest_revision?.revision_id);
        formData.append('document_name', document.latest_revision?.title);
        formData.append('email', document.latest_revision?.email);
        formData.append('last_revision_no', document.latest_revision?.version_no);
        if (isFinal == true) {
            sendFormData(formData);
        }
        else {
            submitFinalReview(formData)
        }
    };
    const savetoPDF = async () => {
        setProcessing(true)
        try {
            let formData = new FormData();
            if (document.latest_revision?.file_type === 1) {
                const blob = await editorObj.documentEditor.saveAsBlob('Docx');
                formData.append('file', blob, 'document2.docx');
                formData.append('filename', document.latest_revision?.document_dir);
                formData.append('file_type', document.latest_revision?.file_type);
                formData.append('version', document.latest_revision?.version_no);
                formData.append('document_id', document.document_id);
                formData.append('pdf_name', getOriginalName(document.latest_revision?.document_dir) + '_' + document.latest_revision?.version_no + '.pdf');
                formData.append('revision_id', document.latest_revision?.revision_id);
                formData.append('document_name', document.latest_revision?.title);
                formData.append('email', document.latest_revision?.email);
                formData.append('last_revision_no', document.latest_revision?.version_no);
                if (isFinal == true) {
                    sendFormData(formData);
                }
                else {
                    submitFinalReview(formData)
                }
            }
            else {
                spreadsheetRef.current.refresh();
                spreadsheetRef.current.save({ fileFormat: 'Xlsx' });
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    const sendFormData = (formData) => {
        axios.post('/dc/save-as-pdf', formData)
            .then(res => {
                setSuccessDialog(true)
                setMessage('Document Successfully Converted!')
                setPdf(res.data.pdf_file)
            })
            .catch(err => {
                setErrors(err.response?.data?.errors || {});
                setProcessing(false)
            });
    };

    const downloadDocument = async () => {
        if (document.latest_revision?.file_type === 1) {
            const blob = await editorObj.documentEditor.saveAsBlob('Docx');
            saveAs(blob, document.latest_revision?.document_dir);
        }
        else {
            setIsDownload(true)
            spreadsheetRef.current.save({ fileFormat: 'Xlsx' });
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileName(file?.name || "");
        if (!file) {
            setErrors({ ...errors, file: "Please select a file." });
            return;
        }
        const allowedFileType = "application/pdf";
        if (file.type !== allowedFileType) {
            setErrors({ ...errors, file: "Invalid file type. Allowed: PDF" });
        } else {
            setErrors({ ...errors, [e.target.name]: "" });
            setPdfFile(file);
        }
    };

    const downloadFileFromUrl = async () => {
        let filename = getOriginalName(document.latest_revision?.document_dir)
        try {
            const response = await fetch('/storage/iso_documents/' + filename + '_' + document.latest_revision?.version_no + '.pdf');
            const blob = await response.blob();
            saveAs(blob, filename + '_' + document.latest_revision?.version_no + '.pdf');
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    function getOriginalName(filename) {
        let nameParts = filename.split('.');
        nameParts.pop();
        return nameParts.join('.');
    }

    const saveReUploadPdf = () => {
        setProcessing(true)
        let formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('file_name', getOriginalName(document.latest_revision?.document_dir) + '_' + document.latest_revision?.version_no + '.pdf');
        axios.post('/dc/reupload-pdf', formData).then(
            res => {
                setMessage('Pdf successfully uploaded!')
                setSuccessDialog(true)
                setPdfFile(null)
            }
        ).catch(
            err => {
                setProcessing(false)
                setErrors(err.data.errors)
            }
        )
    }

    const submitFinalReview = (formData) => {
        setIsFinal(true)
        axios.post('/dc/submit-final-review', formData).then(
            res => {
                setSuccessDialog(true)
                setLink('/dc/initial-review-list')
                setMessage('Final Review Successfully Submitted!')
            }
        )
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Final Review
                </h2>
            }
        >
            <div className='w-full px-4 py-4'>
                <BreadCrumbs tab={tabs} className="mb-2" />
                <Head title="Dashboard" />
                {document && Number(document.latest_revision?.progress_status) === 5 ?
                    <>
                        <div className='my-3 bg-white dark:bg-gray-800 rounded-md shadow-md p-6 text-gray-800 roboto-thin h-fit w-full flex flex-row justify-between'>
                            <div>
                                <h2 className="text-base font-semibold text-gray-900 dark:text-white"> Document Title: {' '} {document.latest_revision?.title}</h2>
                                <div className="p-2 rounded-lg w-full ">
                                    <ul className="space-y-1 text-gray-800 dark:text-gray-400 text-sm roboto-sm ml-2 list-disc list-inside">
                                        <li>
                                            <b className="mr-2 font-semibold">Process: </b>
                                            <span >
                                                {process_type.find(pt => pt.value === Number(document.latest_revision?.process_type))?.name || "Unknown Process"}
                                            </span>
                                        </li>
                                        <li>
                                            <b className="mr-2 font-semibold">Document Type: </b> {document.latest_revision?.document_type || "N/A"}
                                        </li>
                                        <li>
                                            <b className="mr-2 font-semibold">Version No: </b> {document.latest_revision?.version_no || "N/A"}
                                        </li>
                                        <li>
                                            <b className="mr-2 font-semibold">Code: </b> {document.code || "N/A"}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
                                    <FaBuildingUser size={20} className='text-gray-500 mr-2 font-semibold' />
                                    Division: {' '}
                                    {division.find(dv => Number(dv.value) === Number(document.division))?.name || "Unknown Division"}
                                </h2>
                                <div className="w-full  p-3 rounded-lg">
                                    <ul className="space-y-1 text-gray-800 dark:text-gray-400 text-sm  w-full list-disc list-inside">
                                        <li>
                                            <b className='mr-2 font-semibold'>Date Prepared: </b> {' '}{convertDate(document.latest_revision?.date_prepared || 'NA')}
                                        </li>
                                        <li>
                                            <b className='mr-2 font-semibold'>Effectivity Date: </b> {' '}{convertDate(document.latest_revision?.effectivity_date || 'NA')}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-50 flex items-center">
                                    <BiSolidInfoSquare size={20} className='text-gray-500 mr-2' />
                                    Reasons/Details of Request: {' '}
                                </h3>
                                <p className='text-base  mb-2 text-gray-900 dark:text-gray-50'>
                                    {document.latest_revision?.reasons || 'NA'}
                                </p>
                                <div className="flex items-center mb-2">
                                    {document.latest_revision?.latest_revision?.supporting_documents === '' ? (<span className="px-3 py-1 text-xs font-medium text-center inline-flex items-center text-white bg-gray-400 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        <PiEmpty size={20} className='text-gray-50 mr-2' />
                                        Not available
                                    </span>) : (<a href={document.latest_revision?.supporting_documents} target='_blank' className="px-3 py-1 text-xs font-medium text-center inline-flex items-center text-white bg-gray-600 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        <HiCursorClick size={15} className='text-gray-50 mr-2' />
                                        Supporting Documents
                                    </a>)}
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:grid md:grid-cols-4 gap-2 flex flex-col-reverse">
                            <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg md:col-span-3  h-fit">
                                {document.latest_revision?.file_type === 1 ? (
                                    <div className='w-full'>
                                        <DocumentEditorContainerComponent height={'97vh'}
                                            serviceUrl={`https://${ip}:7087/api/documenteditor/`}
                                            ref={(ins => editorObj = ins)}
                                            enableToolbar={true}
                                            showPropertiesPane={false}>
                                            <Inject services={[Toolbar]}></Inject>
                                        </DocumentEditorContainerComponent>
                                    </div>
                                ) : (
                                    <div className='w-full'>
                                        <SpreadsheetComponent
                                            ref={spreadsheetRef} height={'97vh'}
                                            openUrl={`https://${ip}:7086/api/Spreadsheet/Open`}
                                            saveUrl={`https://${ip}:7086/api/Spreadsheet/Save`}
                                            allowOpen={true}
                                            allowSave={true}
                                            beforeSave={beforeSave}
                                            saveComplete={saveComplete}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className='w-full'>
                                <div className='w-full p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-lg'>
                                    <h5 className='roboto-bold text-center pb-2'>
                                        Affix Signature Panel
                                    </h5>
                                    <AffixSignatureNote></AffixSignatureNote>
                                    <div className='flex flex-row gap-1 mt-2'>
                                        <PrimaryButton className='bg-blue-500 w-full text-gray-50 flex justify-center' onClick={() => insertSignature(document.division)} >
                                            <span className='p-1 '>
                                                Chief Signature
                                            </span>
                                        </PrimaryButton>
                                        <PrimaryButton className='bg-blue-500 w-full text-gray-50 flex justify-center' onClick={() => insertSignature(5)}>
                                            <span className='p-1'>
                                                Affix QMR Signature
                                            </span>
                                        </PrimaryButton>
                                    </div>
                                </div>

                                <div className='w-full mt-2 p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-lg'>
                                    <h5 className='roboto-bold text-center pb-2'>
                                        PDF Conversion Panel
                                    </h5>
                                    <SavePdfNote></SavePdfNote>
                                    <PrimaryButton
                                        className='text-md bg-blue-600 w-full mt-2 text-gray-50 flex justify-center'
                                        onClick={savetoPDF} disabled={processing}
                                    >
                                        {processing === false || pdf !== '' ? <> </> :
                                            <div className="animate-spin rounded-full h-3 w-4 border-t-2 border-b-2 border-white"></div>
                                        }
                                        <span className='p-2'>
                                            Convert to PDF
                                        </span>
                                    </PrimaryButton>
                                    <div className='w-full flex flex-row gap-1 mt-2'>
                                        <PrimaryButton
                                            className='text-md bg-blue-500 w-full text-gray-50 flex justify-center'
                                            onClick={downloadDocument}>
                                            <span className='p-1'>
                                                Download Document
                                            </span>
                                        </PrimaryButton>
                                        <PrimaryButton
                                            className='text-md bg-blue-500 w-full text-gray-50 flex justify-center'
                                            onClick={() => downloadFileFromUrl(pdf)} disabled={pdf === '' ? true : false}>
                                            <span className='p-1'>
                                                Download PDF
                                            </span>
                                        </PrimaryButton>
                                    </div>
                                    <div className="mt-4 block">
                                        <label className="flex items-center">
                                            <Checkbox
                                                checked={showUploadFields}
                                                onChange={() => setShowUploadFields(!showUploadFields)}
                                            />
                                            <span className="ms-2 text-xs  text-black dark:text-white ">
                                                Re-upload pdf
                                            </span>
                                        </label>
                                    </div>
                                    {showUploadFields &&
                                        <div className='w-full mt-4'>
                                            <FileUpload
                                                title="Upload PDF Here"
                                                subtitle="File type must be pdf"
                                                name="document"
                                                fileName={fileName}
                                                onChange={handleFileChange}
                                                accept=".pdf"
                                            />
                                            <InputError message={errors.file} className="mt-2" />

                                            <PrimaryButton
                                                className='text-md bg-blue-500 w-full text-gray-50 flex justify-center mt-3'
                                                onClick={saveReUploadPdf} disabled={pdfFile === null ? true : false}>
                                                <span className='p-1'>
                                                    Upload PDF
                                                </span>
                                            </PrimaryButton>
                                        </div>}

                                </div>

                                <div className='w-full p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-lg'>
                                    <h5 className='roboto-bold text-center pb-2'>
                                        Finalize Document Panel
                                    </h5>
                                    <RemoveSignatureNote></RemoveSignatureNote>
                                    <div className='flex flex-row gap-1 mt-2'>
                                        <PrimaryButton className='bg-blue-500 w-full text-gray-50 flex justify-center' onClick={() => (setIsFinal(false))} disabled={pdf === '' ? true : false}>
                                            <span className='p-1'>
                                                Done
                                            </span>
                                        </PrimaryButton>
                                    </div>
                                </div>

                                <div className='w-full mt-2 p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-lg'>
                                    <h5 className='roboto-bold text-center pb-2'>
                                        Submit Final Review
                                    </h5>
                                    <PrimaryButton
                                        className='text-md bg-blue-500 w-full text-gray-50 flex justify-center mt-1'
                                        onClick={savetoPDF} disabled={isFinal} >
                                        <span className='p-1'>
                                            Close Request
                                        </span>
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>

                    </>
                    :
                    <>
                        <DoneReview></DoneReview>
                    </>
                }
                <SuccessDialogs show={successDialog} onClose={() => setSuccessDialog(false)} message={message} link={link} />
            </div>

        </AuthenticatedLayout>
    );
}
