import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import BreadCrumbs from '@/Components/displays/BreadCrumbs';
import TextInput from '@/Components/Forms/TextInput';
import { useState, useEffect, useRef } from 'react';
import InputLabel from '@/Components/Forms/InputLabel';
import InputError from '@/Components/Forms/InputError';
import SelectInput from '@/Components/Forms/SelectInput';
import TextArea from '@/Components/Forms/TextArea';
import DocumentUploadAlert from './DocumentUploadAlert';
import PrimaryButton from '@/Components/Forms/PrimaryButton';
import { MdDataSaverOn } from "react-icons/md";
import SuccessDialogs from '@/Components/Toasts/SuccessDialogs';
import EmptyDocuments from './EmptyDocuments';
import LoginButton from '@/Components/GoogleAuth/LoginBtn';
import FileUpload from '@/Components/Forms/FileUpload';
import Viewer from '@/Components/displays/Viewer';
import LoadingPage from '@/Components/displays/LoadingPage';
import axios from 'axios';
import ConfirmationDialog from "@/Components/Toasts/ConfirmationDialog";
import { saveAs } from "file-saver";

export default function Dashboard() {
    const user = usePage().props.auth.user;
    const [accessToken, setAccessToken] = useState(null);
    const [fileId, setFileId] = useState(null);
    const [file, setFile] = useState(null);
    const [folderId, setFolderID] = useState('1tKRYzcYjKpO17b5pWHymZKPgtCF9sQxU');
    const [data, setData] = useState({ process_type: '', code: "", title: "", version: '', reasons: "", file: null, fileType: '', supporting_documents: '', document_type: '', filename: '' });
    const [errors, setErrors] = useState({});
    const [fileName, setFileName] = useState('');
    const [message, setMessage] = useState('');
    const [successDialog, setSuccessDialog] = useState(false);
    const [loading, setloading] = useState(false);
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
        { name: "Functional Objectives" },
        { name: "Corporate Objectives" },
    ]

    useEffect(() => {
        handleUpload()
    }, [file]);

    const openDialog = (e) => {
        e.preventDefault();
        setDialogOpen(true)
    }
    const closeSuccessDialog = () => {
        setSuccessDialog(false);
        router.visit('/process/pending-list')

    };
    const showSuccessDialog = () => {
        setSuccessDialog(true);
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
        if (e.target.name === "code") {
            setInputValue(e.target.value);
        }
    };

    const handleUpload = () => {
        if (!file || !accessToken) return;
        setloading(true)
        axios.get(
            'https://www.googleapis.com/drive/v3/files',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    q: `name='${file.name}' and '${folderId}' in parents and trashed=false`,
                    fields: 'files(id, name)',
                },
            }
        ).then(
            res => {
                filterFiles(res.data.files[0], file)
            }
        );
    }

    const filterFiles = (result, file) => {
        const existingFile = result;
        if (existingFile) {
            axios.delete(
                `https://www.googleapis.com/drive/v3/files/${existingFile.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            ).then(
                uploadFileToDrive(file)
            );
        }
        else {
            uploadFileToDrive(file)
        }
    }

    const uploadFileToDrive = (file) => {
        const metadata = {
            name: file.name,
            parents: [folderId],
        };
        setFileName(file.name)

        const fileTypeMap = {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel",
            "application/vnd.ms-excel": "Excel",
            "application/msword": "Word",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word"
        };
        const fileType = fileTypeMap[file.type] || "Unknown";
        setData({ ...data, fileType: fileType });

        const form = new FormData();
        form.append(
            'metadata',
            new Blob([JSON.stringify(metadata)], { type: 'application/json' })
        );
        form.append('file', file);
        axios.post(
            'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
            form, { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'multipart/related', }, }
        ).then(
            res => {
                setFileId(res.data.id);
                setloading(false)
                axios.post(
                    `https://www.googleapis.com/drive/v3/files/${res.data.id}/permissions`, { role: 'reader', type: 'anyone' }, {
                    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
                }
                );
            }
        );
    }

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
                        setFileId(res.data.document_dir)
                        setData({
                            ...data,
                            title: res.data.title,
                            version: res.data.version_no,
                            reasons: res.data.reasons,
                            supporting_documents: res.data.supporting_documents,
                            document_type: res.data.document_type,
                            fileType: (res.data.file_type == 1 ? 'Word' : 'Excel'),
                            file_type: res.data.file_type,
                            document_dir: res.data.document_dir,
                            filename: res.data.document_dir
                        });
                        setFileName(res.data.title);
                        setIsDownload(1)
                    }
                })
            }
        }, 2000);
        return () => clearTimeout(timer.current);
    }, [inputValue]);

    const handleSubmit = async (e) => {
        setProcessing(true);
        const formData = new FormData();
        formData.append("process_type", data.process_type);
        formData.append("code", data.code);
        formData.append("title", data.title);
        formData.append("version", data.version);
        formData.append("reasons", data.reasons);
        formData.append("supporting_documents", data.supporting_documents ?? " ");
        formData.append("document_type", data.document_type ?? " ");
        formData.append("type", data.fileType ?? " ");
        formData.append('file', fileId);

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
        window.open('/download-file/' + data.document_dir + '/' + data.title + '/' + (data.fileType == 'Word' ? 1 : 2));
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
                <div className="w-full  grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`mb-4 text-gray-900 w-full  dark:text-gray-50 bg-white dark:bg-gray-800  p-8 col-span-2 rounded-lg shadow-lg border`}>
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
                    <div className={`mb-4 text-gray-900 w-full  dark:text-gray-50 bg-white dark:bg-gray-800  p-8 rounded-lg shadow-lg border grid grid-cols-1 md:grid-cols-2`}>

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
                            {!accessToken && <LoginButton setAccessToken={setAccessToken} />}
                            {accessToken && (<FileUpload
                                title="Upload Document Here"
                                name="document"
                                fileName={fileName}
                                subtitle={fileId ? ('ID: ' + fileId) : ("File type must be pdf, excel, or word")}
                                onChange={(e) => setFile(e.target.files[0])}
                                accept=".docx,.xlsx"
                            />)}
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
                        fileId ?
                            (
                                <div style={{ maxWidth: '100%', overflowX: 'hidden' }} className='rounded-lg border'>
                                    <Viewer fileId={fileId} fileType={data.fileType} accessToken={accessToken} />
                                </div>
                            ) :
                            (
                                loading ? <LoadingPage /> : <EmptyDocuments />
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
