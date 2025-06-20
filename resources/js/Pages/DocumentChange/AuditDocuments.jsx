import { useState, useEffect, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import BreadCrumbs from '@/Components/displays/BreadCrumbs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DocumentEditorContainerComponent, Toolbar, Inject, Print } from '@syncfusion/ej2-react-documenteditor';
import TextArea from '@/Components/Forms/TextArea';
import InputLabel from '@/Components/Forms/InputLabel';
import InputError from '@/Components/Forms/InputError';
import TextInput from '@/Components/Forms/TextInput';
import PrimaryButton from '@/Components/Forms/PrimaryButton';
import DocumentAuditAlert from './DocumentAuditAlert';
import { CiCircleCheck } from "react-icons/ci";
import { CgSearchLoading } from "react-icons/cg";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { SpreadsheetComponent } from '@syncfusion/ej2-react-spreadsheet';

function AuditDocuments() {

    //Initialization 
    const spreadsheetRef = useRef(null);
    let editorObj = null;
    const { url } = usePage();
    const [comment, setComment] = useState([]);
    const user = usePage().props.auth.user; 
    const avatarSrc = user.image_path
        ? `/storage/user_image/${user.image_path}`
        : "/storage/images/unknown-user.png";
    let items = [
        "Comments",
    ];
    const tabs = [
        { name: "ISO Documents", url: "/document-list" },
        { name: "Audit Documents", url: "" },
    ];
    const [document, setDocument] = useState({});
    const [data, setData] = useState([]);
    const [errors, setErrors] = useState({});


    //Fetch Data From Server
    const getDocumentInformation = () => {
        const urlParts = window.location.href.split("/");
        const id = urlParts[urlParts.length - 1];
        axios.get('/audit-document/' + id + '/edit').then(
            res => {
                setDocument(res.data);
            }
        )
    };

    useEffect(() => {
        getDocumentInformation();
    }, [])


    //Event Handler
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleComment = (e) => {
        setComment({ ...data, [e.target.name]: e.target.value });
    };

    
    useEffect(() => {
        if (document.latest_revision) {
            if (Number(document.latest_revision.file_type) === 1) {
                importDocument();
                editorObj.documentEditor.documentChange = () => {
                    protection();
                };
            } else {
                importExcel();
                spreadsheetRef.current.setRangeReadOnly(true, 'A:A', 0)
            }
        }
    }, [document]);

    //Handle Document Event

    const importDocument = async () => {
        if (document.latest_revision) {
            const fileUrl = '/storage/uploads/documents/' + document.latest_revision.document_dir;
            try {
                const response = await fetch(fileUrl);
                const blob = await response.blob();

                const reader = new FileReader();
                reader.onload = (e) => {
                    editorObj.documentEditor.open(e.target.result);
                };
                reader.readAsDataURL(blob);
                protection();
            } catch (error) {
                console.error('Error loading document:', error);
            }
        }
    };
    const protection = () => {
        editorObj.documentEditor.editor.enforceProtection('123', "CommentsOnly");
    }

    //Handle Excel Event
    const importExcel = async () => {
        const fileUrl = `/storage/uploads/documents/${document.latest_revision?.document_dir}`;
        const response = await fetch(fileUrl, {
            method: 'GET',
            mode: 'cors', // Enables cross-origin requests
            headers: {
                'Access-Control-Allow-Origin': '*', // Allow all origins
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


    const submitDocumentAudit = (status) => {
        if (document.latest_revision?.file_type == 1) {
            const comments = editorObj.documentEditor.getComments();
            const texts = comments.map(comment => comment.text);
        }
        else {
            getAllNotes()
        }

        return ' '

        let formData = new FormData();
        formData.append('comments', texts);
        formData.append('remarks', data.remarks ?? '');
        formData.append('status', status);
        formData.append('document_id', document.document_id);
        axios.post('/audit-document', formData).then(
            res => {

            }
        )
    }


    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="">
                <BreadCrumbs tab={tabs} className="mb-2" />
                <section className="relative w-full  text-gray-800 dark:text-gray-50 rounded-lg">
                    {document.latest_revision?.file_type === 1 ? (
                        <div className='w-full rounded-lg overflow-hidden shadow-xl bg-gray-50 dark:bg-gray-800'>
                            <DocumentEditorContainerComponent height={'90vh'} serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
                                ref={(ins => editorObj = ins)}
                                toolbarItems={items}
                                enableToolbar={true}
                                showPropertiesPane={false}
                                enableTrackChanges={false}
                                enableComment={true}
                                currentUser={user.full_name}>
                                <Inject services={[Toolbar]}></Inject>
                            </DocumentEditorContainerComponent>
                        </div>) :
                        (<div className='w-full rounded-lg overflow-hidden shadow-xl bg-gray-50 dark:bg-gray-800 grid grid-cols-4'>
                            <div className='col-span-3'>
                                <SpreadsheetComponent
                                    ref={spreadsheetRef}
                                    allowOpen={true} openUrl="https://services.syncfusion.com/react/production/api/spreadsheet/open"
                                    height="90vh"
                                    allowEditing={true}
                                />
                            </div>
                            <div className='bg-gray-200 p-2'>
                                <div className='w-full py-3 px-5 bg-gray-50 mb-1'>
                                    <span className='border-b-2 border-indigo-400 nunito-bold font-extrabold'>Comments</span>
                                </div>
                                <div className='w-full  p-5 bg-gray-50'>
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
                                            value={comment.message}
                                            className="mt-1 w-full"
                                            autoComplete="initiator"
                                            onChange={handleComment}
                                            placeholder="Insert Comment here"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>)
                    }

                </section>

            </div>
        </AuthenticatedLayout>
    )
}

export default AuditDocuments
