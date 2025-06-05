import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import BreadCrumbs from '@/Components/displays/BreadCrumbs';
import TextInput from '@/Components/Forms/TextInput';
import { useState, useEffect, useRef } from 'react';
import InputLabel from '@/Components/Forms/InputLabel';
import InputError from '@/Components/Forms/InputError';
import SelectInput from '@/Components/Forms/SelectInput';
import TextArea from '@/Components/Forms/TextArea';
import FileUpload from '@/Components/Forms/FileUpload';
import DocumentUploadAlert from './DocumentUploadAlert';
import PrimaryButton from '@/Components/Forms/PrimaryButton';
import { MdDataSaverOn } from "react-icons/md";
import SuccessDialogs from '@/Components/Toasts/SuccessDialogs';
import EmptyDocuments from './EmptyDocuments';
import { DocumentEditorContainerComponent, Toolbar, Inject } from '@syncfusion/ej2-react-documenteditor';
import { SpreadsheetComponent } from '@syncfusion/ej2-react-spreadsheet';
import axios from 'axios';
import ConfirmationDialog from "@/Components/Toasts/ConfirmationDialog";
import { saveAs } from "file-saver";

export default function Dashboard() {
    let editorObj = null;
    const spreadsheetRef = useRef(null);
    const user = usePage().props.auth.user;
    let items = ["Comments", "Undo", "Redo", "Separator", "Image", "Table", "Header", "Footer", "Separator", "PageSetup", "PageNumber", "Break", "Separator"];
    const [data, setData] = useState({ process_type: '', code: "", title: "", version: '', reasons: "", file: null, fileType: '', supporting_documents: '', document_type: '', filename: '' });
    const [errors, setErrors] = useState({});
    const [fileName, setFileName] = useState('');
    const [message, setMessage] = useState('');
    const [successDialog, setSuccessDialog] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isDownload, setIsDownload] = useState(0);
    const lastQueried = useRef("");
    const timer = useRef(null);
    const controller = useRef(null);
    const [processing, setProcessing] = useState(false);
    const tabs = [
        { name: "ISO Document", url: "/process/view-documents" },
        { name: "Submit Request", url: "" },
    ];
    const process_type = [
        { name: "NEW  (Add document to manual)", value: 1 },
        { name: "REVISION (Remove old document/ insert new document)", value: 2 },
        { name: "DELETE (Delete document from manual)", value: 3 },
    ];
    const document_type = [
        { name: "Quality Manual" },
        { name: "Procedures Manual" },
        { name: "Plans" },
        { name: "Forms" },
        { name: "Masterlist" },
    ]

    const openDialog = (e) => {
        e.preventDefault();
        setDialogOpen(true)
    }
    const closeSuccessDialog = () => {
        setSuccessDialog(false);
        if (user.qms_role === 'Process Owner') {
            router.visit('/process/pending-list')
        } else if (user.qms_role === 'Document Custodian') {
            router.visit('/dc/view-documents')
        }
    };
    const showSuccessDialog = () => {
        setSuccessDialog(true);
    };
    //Handle form changes
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
        if (e.target.name === "code") {
            setInputValue(e.target.value);
        }
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileName(file?.name || "");

        if (!file) {
            setErrors({ ...errors, [e.target.name]: "Please select a file." });
            return;
        }
        const fileTypeMap = {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel",
            "application/msword": "Word",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word"
        };
        if (!fileTypeMap[file.type]) {
            setErrors({ ...errors, [e.target.name]: "Invalid file type. Allowed: Excel, Word." });
            setData({ ...data, file: null, fileType: null });
        } else {
            setErrors({ ...errors, [e.target.name]: "" });
            setData({ ...data, file, fileType: fileTypeMap[file.type] });
        }
    };

    useEffect(() => {
        openDocument();
    }, [data.file])
    

    //DEBOUNCE api CALL
    useEffect(() => {
        if (inputValue === lastQueried.current && inputValue !== '') return;
        if (String(data.process_type) === '1' || data.process_type === '') return;
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            if (inputValue !== lastQueried.current) {
                controller.current?.abort();
                controller.current = new AbortController();
                lastQueried.current = inputValue;
                axios.get(`/get-document-by-code/` + inputValue, {
                    signal: controller.current.signal,
                }).then(res => {
                    if (res.data !== '') {
                        setData({
                            ...data,
                            title: res.data.title,
                            version: res.data.version_no,
                            reasons: res.data.reasons,
                            supporting_documents: res.data.supporting_documents,
                            document_type: res.data.document_type,
                            fileType: res.data.fileType,
                            filename: res.data.document_dir,
                        });
                        getFile(res.data.document_dir);
                        setFileName(res.data.title);
                        setIsDownload(1)
                    }
                })
            }
        }, 2000);
        return () => clearTimeout(timer.current);
    }, [inputValue]);

    const getFile = async (filename) => {
        if (filename === '' && !filename) return
        try {
            const fileUrl = `/storage/iso_documents/${filename}`;
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error("File not found");
            const blob = await response.blob();
            const file = new File([blob], filename, { type: blob.type });

            const fileTypeMap = {
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel",
                "application/msword": "Word",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word"
            };
            const fileType = fileTypeMap[file.type] || "Unknown";
            setData(prevData => ({
                ...prevData,
                file,
                fileType
            }));
        } catch (error) {
            console.error("Error fetching file:", error);
        }
    };
    const openDocument = () => {
        if (data.fileType === "Word") {
            editorObj.documentEditor.open(data.file);
            editorObj.documentEditor.editor.deleteAllComments();
        }
        else if (data.fileType === "Excel") {
            if (spreadsheetRef) {
                spreadsheetRef.current.open({ file: data.file });
            }
        }
    }
    const beforeSave = (args) => {
        args.needBlobData = true;
        args.isFullPost = false;
    }
    const saveComplete = (args) => {
        setProcessing(true);
        const formData = new FormData();
        formData.append("process_type", data.process_type);
        formData.append("code", data.code);
        formData.append("title", data.title);
        formData.append("version", data.version);
        formData.append("reasons", data.reasons);
        formData.append("supporting_documents", data.supporting_documents ?? " ");
        formData.append("document_type", data.document_type ?? " ");

        formData.append('file', args.blobData, 'document.xlsx');
        sendFormData(formData);
    }
    const handleSubmit = () => {
        if (data.fileType === "Word") {
            SendToDocxServer()
        }
        else if (data.fileType === "Excel") {
            spreadsheetRef.current.save({ fileFormat: 'Xlsx' });
        }
    }
    const SendToDocxServer = async (e) => {
        setProcessing(true);
        const formData = new FormData();
        formData.append("process_type", data.process_type);
        formData.append("code", data.code);
        formData.append("title", data.title);
        formData.append("version", data.version);
        formData.append("reasons", data.reasons);
        formData.append("supporting_documents", data.supporting_documents ?? " ");
        formData.append("document_type", data.document_type ?? " ");

        try {
            if (data.fileType === "Word" && editorObj?.documentEditor) {
                const blob = await editorObj.documentEditor.saveAsBlob('Docx');
                formData.append('file', blob, 'document.docx');
            }
            sendFormData(formData);

        } catch (error) {
            console.error("Error processing files:", error);
            setProcessing(false);
        }
    };
    const sendFormData = (formData) => {
        setDialogOpen(false)
        axios.post('/document-change', formData)
            .then(res => {
                setMessage(res.data.message);
                setProcessing(false);
                showSuccessDialog();
            })
            .catch(err => {
                setProcessing(false);
                setErrors(err.response?.data?.errors || {});
            });
    };
    const downloadFileFromUrl = async (event) => {
        event.preventDefault();
        if (data.filename === '') return
        try {
            const response = await fetch('/storage/iso_documents/' + data.filename);
            const blob = await response.blob();
            saveAs(blob, data.filename);
            setIsDownload(0);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Add Document Change Request
                </h2>
            }
        >
            <Head title="Submit Document Change Request" />
            <div className="w-full px-4 py-4 ">
                <BreadCrumbs tab={tabs} className="mb-2" />
                <form onSubmit={handleSubmit}>
                    <div className="w-full  grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`mb-4 text-gray-900 w-full  dark:text-gray-50 bg-white dark:bg-gray-800  p-8 col-span-2 rounded-lg shadow-sm border`}>
                            <h2 className={`  font-bold mb-4 text-xl`}>
                                Document Change Request
                            </h2>
                            {/* Form */}
                            <DocumentUploadAlert />
                            <div className={` grid grid-cols-1 gap-3 md:grid-cols-3`}>

                                {/* Process Type */}
                                <div>
                                    <InputLabel htmlFor="process_type" value="Document Request Type" />
                                    <SelectInput
                                        id="process_type"
                                        items={process_type}
                                        itemValue="value"
                                        itemName="name"
                                        name="process_type"
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.process_type} className="mt-2" />
                                </div>

                                {/* Document Code */}
                                <div>
                                    <InputLabel htmlFor="code" value="Document Code" />
                                    <TextInput
                                        id="code"
                                        type="text"
                                        name="code"
                                        value={data.code}
                                        className="mt-1 w-full"
                                        autoComplete="code"
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.code} className="mt-2" />
                                </div>

                                {/* Document Title */}
                                <div className='col-span-1'>
                                    <InputLabel htmlFor="title" value="Document Title" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 w-full"
                                        autoComplete="title"
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                {/* Document Type */}
                                <div className='col-span-1'>
                                    <InputLabel htmlFor="title" value="Document Type" />
                                    <SelectInput
                                        id="document_type"
                                        items={document_type}
                                        itemValue="name"
                                        itemName="name"
                                        name="document_type"
                                        defaultValue={data.document_type}
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.document_type} className="mt-2" />
                                </div>

                                {/* Document Version */}
                                <div>
                                    <InputLabel htmlFor="version" value="Document version" />
                                    <TextInput
                                        id="version"
                                        type="number"
                                        name="version"
                                        value={data.version}
                                        className="mt-1 w-full"
                                        autoComplete="version"
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.version} className="mt-2" />
                                </div>

                                {/* Supporting Document */}
                                <div>
                                    <InputLabel htmlFor="supporting_documents" value="Supporting Document (optional)" />
                                    <TextInput
                                        id="supporting_documents"
                                        type="text"
                                        name="supporting_documents"
                                        value={data.supporting_documents}
                                        className="mt-1 w-full"
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.supporting_documents} className="mt-2" />
                                </div>
                            </div>
                        </div>
                        <div className={`mb-4 text-gray-900 w-full  dark:text-gray-50 bg-white dark:bg-gray-800  p-8 rounded-lg shadow-sm border grid grid-cols-1 md:grid-cols-2`}>

                            {/* Reason of Conception/Revision */}
                            <div className={`col-span-2`}>
                                <InputLabel htmlFor="reasons" value="Reasons/Details of Request" />
                                <TextArea
                                    id="reasons"
                                    name="reasons"
                                    onChange={handleChange}
                                    rows="5"
                                ></TextArea>
                                <InputError message={errors.reasons} className="mt-2" />
                            </div>
                            {/* File Upload */}
                            <div className={`col-span-2 mt-2`}>
                                <InputLabel htmlFor="details" value="File" />
                                <FileUpload
                                    title="Upload Document Here"
                                    subtitle="File type must be pdf, excel, or word"
                                    name="document"
                                    fileName={fileName}
                                    onChange={handleFileChange}
                                    accept=".doc,.docx,.xls,.xlsx"
                                />
                                <InputError message={errors.file} className="mt-2" />
                            </div>
                            {
                                isDownload === 1 &&
                                <div className='mt-5 flex justify-start'>
                                    <PrimaryButton className=" bg-blue-600" disabled={processing} onClick={downloadFileFromUrl}>
                                        <span className=' text-white nunito-bold mx-2'>Download File</span>
                                    </PrimaryButton>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='mb-4 text-gray-900 w-full  dark:text-gray-50 bg-white dark:bg-gray-800  py-8 px-8 rounded-lg shadow-lg border overflow-hidden '>
                        {
                            data.file ?
                                (
                                    <div style={{ maxWidth: '100%', overflowX: 'hidden' }} className='rounded-lg border'>
                                        {data.fileType === 'Word' ? (
                                            <DocumentEditorContainerComponent
                                                height="90vh"
                                                style={{ width: '100%', overflow: 'hidden' }}
                                                serviceUrl="https://localhost:7087/api/documenteditor/"
                                                ref={(ins) => (editorObj = ins)}
                                                toolbarItems={items}
                                                enableToolbar={true}
                                                showPropertiesPane={true}
                                            >
                                                <Inject services={[Toolbar]} />
                                            </DocumentEditorContainerComponent>
                                        ) : (
                                            <SpreadsheetComponent
                                                ref={spreadsheetRef}
                                                openUrl="https://localhost:7086/api/Spreadsheet/Open"
                                                saveUrl="https://localhost:7086/api/Spreadsheet/Save"
                                                allowOpen={true}
                                                allowSave={true}
                                                beforeSave={beforeSave}
                                                saveComplete={saveComplete}
                                                height="90vh"
                                                style={{ width: '100%', overflow: 'hidden' }}
                                            />
                                        )}
                                    </div>


                                ) :
                                (
                                    <EmptyDocuments />
                                )
                        }
                        <div className='mt-5 flex justify-start'>
                            <PrimaryButton className=" bg-blue-600" disabled={processing} onClick={openDialog}>
                                {processing ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> :
                                    <div>
                                        <MdDataSaverOn
                                            size={20}
                                            className="mr-2"
                                            color="white"
                                        />

                                    </div>}
                                <span className=' text-white nunito-bold mx-2'>Submit</span>
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
                <SuccessDialogs show={successDialog} onClose={closeSuccessDialog} message={message} />
                <ConfirmationDialog
                    show={isDialogOpen}
                    onClose={() => setDialogOpen(false)}
                    onConfirm={handleSubmit}
                    processing={processing}
                    message="Are you sure you want to submit this document change request?"
                    subtitle="Please review and fix any layout errors before submitting. Ensure the uploaded document has been reviewed and approved by the respective division chief. This action is irreversible." />
            </div>
        </AuthenticatedLayout>

    );
}
