import { useState, useEffect, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import BreadCrumbs from '@/Components/displays/BreadCrumbs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DocumentEditorContainerComponent, Toolbar, Inject, Print } from '@syncfusion/ej2-react-documenteditor';
import TextArea from '@/Components/Forms/TextArea';
import { IoTrashOutline } from "react-icons/io5";
import InputError from '@/Components/Forms/InputError';
import TextInput from '@/Components/Forms/TextInput';
import AuditDocumentInfo from '@/Components/AddOnsCard/AuditDocumentInfo';
import { CiCircleCheck } from "react-icons/ci";
import { CgSearchLoading } from "react-icons/cg";
import { SpreadsheetComponent } from '@syncfusion/ej2-react-spreadsheet';
import DoneReview from '@/Components/AddOnsCard/DoneReview';
import ConfirmationDialog from "@/Components/Toasts/ConfirmationDialog";
import { IoSendSharp } from "react-icons/io5";
import { AiTwotoneDelete } from "react-icons/ai";

function DcInitialReview() {
    //Initialization 
    const spreadsheetRef = useRef(null);
    let editorObj = null;
    const [remarks, setRemarks] = useState('');
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [status, setStatus] = useState(1);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [ip, setIp] = useState('');
    const user = usePage().props.auth.user;
    const avatarSrc = user.image_path
        ? `/storage/user_image/${user.image_path}`
        : "/storage/images/unknown-user.png";
    let items = [
        "Comments", "Undo", "Redo", "Separator", "Image", "Table", "Header", "Footer", "Separator", "PageSetup", "PageNumber", "Break", "Separator", "Find"
    ];
    const tabs = [
        { name: "ISO Documents", url: "/dc/initial-review-list" },
        { name: "Document Custodian Review", url: "" },
    ];
    const [document, setDocument] = useState({});
    const [data, setData] = useState([]);
    const [errors, setErrors] = useState({});

    const openDialog = (status) => {
        setStatus(status);
        setDialogOpen(true)
    }
    //Fetch Data From Server
    const getDocumentInformation = () => {
        const urlParts = window.location.href.split("/");
        const id = urlParts[urlParts.length - 1];
        axios.get('/dc/get-document-details/' + id).then(
            res => {
                setDocument(res.data.document);
                setComments(res.data.comments)
                setRemarks(res.data.remarks.remarks ?? '')
            }
        )
    };

    useEffect(() => {
        axios.get('/api-ip').then(
            res => {
                setIp(res.data)
                getDocumentInformation();
            }
        )
    }, [])
    //Event Handler
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleComment = (e) => {
        setComment(e.target.value);
    };


    useEffect(() => {
        if (document?.latest_revision) {
            if (Number(document.latest_revision.file_type) === 1) {
                importDocument();
                setTimeout(() => {
                }, 100);
            } else {
                importExcel();
            }
        }
    }, [document]);

    const sendFormData = (formData) => {
        axios.post('/dc/post-initial-review-documents', formData)
            .then(res => {
                getDocumentInformation();
                setDialogOpen(false)
                setProcessing(false)
            })
            .catch(err => {
                setErrors(err.response?.data?.errors || {});
                setProcessing(false)
            });
    };

    //Handle Document Event
    const importDocument = async () => {
        if (document.latest_revision) {
            const fileUrl = '/storage/iso_documents/' + document.latest_revision.document_dir;
            try {
                const response = await fetch(fileUrl);
                const blob = await response.blob();

                const reader = new FileReader();
                reader.onload = (e) => {
                    editorObj?.documentEditor.open(e.target.result);
                };
                reader.readAsDataURL(blob);
            } catch (error) {
                console.error('Error loading document:', error);
            }
        }
    };
    //Handle Excel Event
    const importExcel = async () => {
        const fileUrl = `/storage/iso_documents/${document.latest_revision?.document_dir}`;
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

    const beforeSave = (args) => {
        args.needBlobData = true;
        args.isFullPost = false;
    }
    const saveComplete = (args) => {
        const formData = new FormData();
        formData.append('comments', JSON.stringify(comments));
        formData.append('file', args.blobData, 'document.xlsx');
        formData.append('document_dir', document.latest_revision.document_dir);
        formData.append('title', document.latest_revision.title);
        formData.append('remarks', data.remarks ?? '');
        formData.append('status', status);
        formData.append('file_type', document.latest_revision.file_type);
        formData.append('revision_id', document.latest_revision.revision_id);
        formData.append('last_revision_no', document.latest_revision.version_no);
        formData.append('document_id', document.document_id);
        formData.append('email', document.latest_revision.email);
        formData.append('is_qmr', document.latest_revision.is_qmr);

        sendFormData(formData);
    }

    const handleButtonClick = () => {
        if (spreadsheetRef.current) {
            const spreadsheet = spreadsheetRef.current;
            const activeSheet = spreadsheet.getActiveSheet();
            const selectedRange = activeSheet.selectedRange;
            const now = new Date();
            const formattedDateTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

            if (spreadsheetRef.current) {
                const spreadsheet = spreadsheetRef.current;
                comments.map((c) => (
                    spreadsheet.cellFormat({ backgroundColor: "white", color: 'black' }, c.location)
                ));
            }
            setComments(prevComments => [
                ...prevComments,
                {
                    comments: comment,
                    location: selectedRange,
                    date: formattedDateTime,
                    reviewer: user.full_name,
                    is_resolved: false,
                }
            ]);
            setComment('');
        }
    };
    const handleCommentClick = (location) => {
        if (spreadsheetRef.current) {
            const spreadsheet = spreadsheetRef.current;
            comments.forEach((c) => {
                spreadsheet.cellFormat({ backgroundColor: "white", color: 'black' }, c.location);
            });
            spreadsheet.cellFormat({ backgroundColor: "red", color: 'white' }, location);
        }
    };
    const removeHighlight = () => {
        if (spreadsheetRef.current) {
            const spreadsheet = spreadsheetRef.current;
            comments.forEach((c) => {
                spreadsheet.cellFormat({ backgroundColor: "white", color: 'black' }, c.location);
            });
        }
    };
    const deleteComent = (comment, loc) => {

        if (spreadsheetRef.current) {
            const spreadsheet = spreadsheetRef.current;
            setComments(comments.filter(c => c.comments !== comment));
        }
    }
    const submitDocumentAudit = async () => {
        let formData = new FormData();
        setProcessing(true);
        if (Number(document.latest_revision?.file_type) === 1) {
            const comments_documents = editorObj.documentEditor.getComments() ?? [];
            const extractedComments = comments_documents.map(comment => ({
                comments: comment.text,
                is_resolved: comment.commentProperties.isResolved,
                comment_date: comment.commentProperties.dateTime,
                author: user.full_name
            }));
            formData.append('comments', JSON.stringify(extractedComments));
            formData.append('remarks', data.remarks ?? '');
            formData.append('status', status);
            formData.append('revision_id', document.latest_revision.revision_id);
            formData.append('file_type', document.latest_revision.file_type);
            formData.append('title', document.latest_revision.title);
            formData.append('last_revision_no', document.latest_revision.version_no);
            formData.append('document_id', document.document_id);
            formData.append('document_dir', document.latest_revision.document_dir);
            formData.append('email', document.latest_revision.email);
            formData.append('is_qmr', document.latest_revision.is_qmr);
            const blob = await editorObj.documentEditor.saveAsBlob('Docx');
            formData.append('file', blob, 'document.docx');
            sendFormData(formData);

        } else {
            spreadsheetRef.current.save({ fileFormat: 'Xlsx' });
        }
    };


    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="w-full p-4">
                <BreadCrumbs tab={tabs} className="mb-2" />
                {document?.latest_revision?.progress_status === 0 ? (<>
                    {document && <AuditDocumentInfo document={document} >
                        <div className='w-full rounded-lg flex flex-col items-center p-4 text-gray-900 dark:text-gray-50'>
                            <div className='text-center nunito-bold text-lg mb-2'>
                                <span > Document Custodian Approval Form</span>
                            </div>
                            <div className='roboto-regular grid grid-cols-1 gap-1  h-fit text-sm w-full'>
                                {/* <DocumentAuditAlert /> */}
                                <div>
                                    <TextArea
                                        id="remarks"
                                        name="remarks"
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Insert remarks here"
                                    ></TextArea>
                                    <InputError message={errors.remarks} className="mt-2" />
                                </div>
                                <div className='flex mt-3 gap-2 flex-wrap justify-center'>
                                    <button className='bg-blue-500 text-gray-50 rounded-lg px-4 py-3' onClick={() => openDialog(1)} disabled={processing}>
                                        <span className='text-sm flex items-center justify-center font-mono'> Forward to QMR
                                            {processing ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> :
                                                <div>
                                                    <CiCircleCheck size={20} className='ml-2' />
                                                </div>}
                                        </span>
                                    </button>
                                    <button className='bg-blue-500 text-gray-50 rounded-lg px-4' onClick={() => openDialog(2)} disabled={processing}>
                                        <span className='text-sm flex items-center justify-center'>For Revision
                                            {processing ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> :
                                                <div>
                                                    <CgSearchLoading size={20} className='ml-2' />
                                                </div>}
                                        </span>
                                    </button>
                                    <button className='bg-blue-500 text-gray-50 rounded-lg px-4' onClick={() => openDialog(3)} disabled={processing}>
                                        <span className='text-sm flex items-center justify-center'>Reject
                                            {processing ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> :
                                                <div>
                                                    <AiTwotoneDelete size={20} className='ml-2' />
                                                </div>}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </AuditDocumentInfo>}
                    <section className="relative w-full  text-gray-800 dark:text-gray-50 rounded-lg">
                        {document.latest_revision?.file_type === 1 ? (
                            <div className='w-full rounded-lg overflow-hidden shadow-xl bg-gray-50 dark:bg-gray-800'>
                                <DocumentEditorContainerComponent height={'90vh'}
                                    serviceUrl={`http://${ip}:7087/api/documenteditor/`}
                                    ref={(ins => editorObj = ins)}
                                    toolbarItems={items}
                                    enableToolbar={true}
                                    showPropertiesPane={true}
                                    enableTrackChanges={false}
                                    enableComment={true}
                                    currentUser={user.full_name}>
                                    <Inject services={[Toolbar]}></Inject>
                                </DocumentEditorContainerComponent>
                            </div>) :
                            (<div className='w-full rounded-lg overflow-hidden shadow-xl bg-gray-50 dark:bg-gray-800 grid grid-cols-4'>
                                <div className='col-span-3'>
                                    <SpreadsheetComponent
                                        ref={spreadsheetRef} height={'90vh'}
                                        openUrl={`http://${ip}:7086/api/Spreadsheet/Open`}
                                        saveUrl={`http://${ip}:7086/api/Spreadsheet/Save`}
                                        allowOpen={true}
                                        allowSave={true}
                                        beforeSave={beforeSave}
                                        saveComplete={saveComplete}
                                    />
                                </div>
                                <div className='bg-gray-200 p-2 dark:bg-gray-950'>
                                    <div className='w-full py-3 px-5 bg-gray-50 mb-1 dark:bg-gray-800'>
                                        <span className='border-b-2 border-indigo-400 nunito-bold font-extrabold'>Comments</span>
                                    </div>
                                    <div className='w-full  p-5 bg-gray-50 dark:bg-gray-800'>
                                        <div className='w-full flex items-center gap-3'>
                                            <img src={avatarSrc} alt="" className='w-8' />
                                            <span className='nunito-bold'>
                                                {user.full_name}
                                            </span>
                                        </div>
                                        <div className='w-full mt-3 flex'>
                                            <TextInput
                                                id="message"
                                                type="text"
                                                name="message"
                                                value={comment}
                                                className="mt-1 w-full"
                                                autoComplete="initiator"
                                                onChange={handleComment}
                                                placeholder="Insert Comment here"
                                            />
                                            <button onClick={handleButtonClick} > <IoSendSharp size={35} className=' text-gray-500 dark:text-gray-50 ml-2' /></button>
                                        </div>

                                        {comments && comments?.length > 0 &&
                                            <div className='w-full py-3 border-t border-gray-200 mt-3 text-gray-800 dark:text-gray-50'>
                                                {remarks !== '' && <>
                                                    <div>
                                                        <div className='w-full py-3 bg-gray-200 px-2 mb-2 rounded-lg dark:bg-gray-800'>
                                                            <span className=' nunito-bold font-extrabold'>Latest Remarks: </span>{remarks}<br />
                                                        </div>
                                                    </div>
                                                </>}
                                                {comments.map((c, index) => (
                                                    <div key={index} className="relative rounded-lg border border-gray-400 p-3 pb-6 mb-3 shadow-sm w-full block">
                                                        <IoTrashOutline size={15} className='text-red-400 absolute right-3 top-3 z-50' onClick={() => deleteComent(c.comments, c.location)} />
                                                        <h3 className="font-bold">{c.reviewer}</h3>
                                                        <p className='px-2 pb-3  cursor-pointer' onClick={(() => handleCommentClick(c.location))}>
                                                            {c.comments}
                                                        </p>
                                                        <span className="absolute right-3 bottom-3  text-gray-600 text-xs">
                                                            {c.comment_date}
                                                        </span>
                                                        <span className="absolute left-3 bottom-3 text-gray-600 text-xs">
                                                            {Number(c.is_resolved) === 1 ? (
                                                                <span className='text-green-700 font-bold'>Status: Resolved</span>
                                                            ) : (
                                                                <span className='text-slate-800 font-bold'>Status: Unresolved</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                                <button onClick={removeHighlight} className='p-2 bg-blue-500 text-gray-50 text-xs rounded-lg'>Remove Highlight</button>
                                            </div>
                                        }

                                    </div>
                                </div>
                            </div>)
                        }
                    </section>
                </>) : (
                    <>
                        {document?.latest_revision?.progress_status !== 0 && <DoneReview></DoneReview>}
                    </>)}

                <ConfirmationDialog
                    show={isDialogOpen}
                    onClose={() => setDialogOpen(false)}
                    onConfirm={submitDocumentAudit}
                    message="Submit Review?"
                    processing={processing}
                />
            </div>
        </AuthenticatedLayout>
    )
}

export default DcInitialReview;
