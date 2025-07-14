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

export default function ReviseDocument() {
  let editorObj = null;
  const spreadsheetRef = useRef(null);
  const [processing, setProcessing] = useState(false);
  const [comments, setComments] = useState([]);
  const [remarks, setRemarks] = useState([]);
  const [isDownload, setIsDownload] = useState(0);
  const [ip, setIp] = useState('');
  const user = usePage().props.auth.user;
  const avatarSrc = user.image_path
    ? `http://hris.stii.local/frontend/hris/images/user_image/${user.image_path}`
    : "/storage/images/user.png";
  let items = [
    "Comments",
    "Undo",
    "Redo",
    "Separator",
    "Image",
    "Table",
    "Header",
    "Footer",
    "Separator",
    "PageSetup",
    "PageNumber",
    "Break",
    "Separator",
  ];
  const [data, setData] = useState({
    process_type: '',
    code: "",
    title: "",
    version: '',
    reasons: "",
    file: null,
    fileType: '',
    supporting_documents: '',
    document_id: '',
    revision_id: '',
    document_dir: '',
    document_type: '',
  });
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');
  const [successDialog, setSuccessDialog] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
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
  useEffect(() => {
    axios.get('/api-ip').then(
      res => {
        setIp(res.data)
        getDocument();
      }
    )

  }, [])
  const getDocument = () => {
    const urlParts = window.location.href.split("/");
    const id = urlParts[urlParts.length - 1];
    axios.get(`/process/get-revise-documents/${id}`).then(res => {
      setData(prevData => ({
        ...prevData,
        ...res.data.document,
        version: res.data.document.version_no,
        fileType: res.data.document.file_type,
        document_id: res.data.document.document_id,
        revision_id: res.data.document.revision_id,
        document_type: res.data.document.document_type,
      }));
      setIsDownload(1);
      setFileName(res.data.document.title)
      setComments(res.data.comments)
      getFile(res.data.document.document_dir)
      setRemarks(res.data.remarks);
    }).catch(error => {
      console.error("Error fetching document:", error);
    });
  }
  const getFile = async (filename) => {
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
  const handleCommentClick = (location) => {
    if (spreadsheetRef.current) {
      const spreadsheet = spreadsheetRef.current;
      comments.map((c) => (
        spreadsheet.cellFormat({ backgroundColor: "white", color: 'black' }, c.location)
      ));
      spreadsheet.cellFormat({ backgroundColor: "#ffeb3b", color: 'red' }, location);
    }
  }
  const removeHighlight = () => {
    if (spreadsheetRef.current) {
      const spreadsheet = spreadsheetRef.current;
      comments.forEach((c) => {
        spreadsheet.cellFormat({ backgroundColor: "white", color: 'black' }, c.location);
      });
    }
  };
  const toggleResolved = (id) => {
    if (spreadsheetRef.current) {
      const spreadsheet = spreadsheetRef.current;
      comments.map((c) => (
        spreadsheet.cellFormat({ backgroundColor: "white", color: 'black' }, c.location)
      ));
    }
    setComments(comments.map(c =>
      c.id === id ? { ...c, is_resolved: c.is_resolved === 0 ? 1 : 0 } : c
    ));
  };
  const closeSuccessDialog = () => {
    setSuccessDialog(false);
    router.visit('/process/pending-list')
  };
  const showSuccessDialog = () => {
    setSuccessDialog(true);
  };
  const tabs = [
    { name: "ISO Document", url: "/process/view-documents" },
    { name: "Revise " + data.title, url: "" },
  ];
  const process_type = [
    { name: "NEW  (Add document to manual)", value: 1 },
    { name: "REVISION (Remove old document/ insert new document)", value: 2 },
    { name: "DELETE (Delete document from manual)", value: 3 },
  ];
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
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
    console.log(data.fileType);
  };
  useEffect(() => {
    openDocument();
  }, [data.file])

  const openDocument = () => {
    if (data.fileType === "Word") {
      if (editorObj && editorObj.documentEditor) {
        editorObj.documentEditor.open(data.file);
      }
    } else if (data.fileType === "Excel") {
      if (spreadsheetRef?.current) {
        spreadsheetRef.current.open({ file: data.file });
      }
    }
  };

  const beforeSave = (args) => {
    args.needBlobData = true;
    args.isFullPost = false;
  }
  const saveComplete = (args) => {
    setProcessing(true);
    const formData = new FormData();
    formData.append('comments', JSON.stringify(comments));
    formData.append("process_type", data.process_type);
    formData.append("document_dir", data.document_dir);
    formData.append("document_type", data.document_type);
    formData.append("code", data.code);
    formData.append("title", data.title);
    formData.append("revision_id", data.revision_id);
    formData.append("version", data.version);
    formData.append("reasons", data.reasons);
    formData.append("division_chief_id", data.division_chief_id);
    formData.append("qmr_id", data.qmr_id);
    formData.append("document_id", data.document_id);
    formData.append("supporting_documents", data.supporting_documents ?? " ");
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
    formData.append("audit_log", remarks.id);
    formData.append("code", data.code);
    formData.append("title", data.title);
    formData.append("revision_id", data.revision_id);
    formData.append("version", data.version);
    formData.append("reasons", data.reasons);
    formData.append("division_chief_id", data.division_chief_id);
    formData.append("qmr_id", data.qmr_id);
    formData.append("document_id", data.document_id);
    formData.append("document_dir", data.document_dir);
    formData.append("document_type", data.document_type);
    formData.append("supporting_documents", data.supporting_documents ?? " ");

    try {
      if (data.fileType === "Word" && editorObj?.documentEditor) {
        const comments_documents = editorObj.documentEditor.getComments() ?? [];
        const extractedComments = comments_documents.map(comment => ({
          comments: comment.text,
          is_resolved: comment.commentProperties.isResolved,
          comment_date: comment.commentProperties.dateTime,
          author: user.full_name
        }));
        formData.append('comments', JSON.stringify(extractedComments));
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
    axios.post('/process/submit-revise-documents', formData)
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
    if (data.document_dir === '') return
    try {
      const response = await fetch('/storage/iso_documents/' + data.document_dir);
      const blob = await response.blob();
      saveAs(blob, data.document_dir);
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
      <div className="w-full p-5">
        <BreadCrumbs tab={tabs} className="mb-2" />
        <div className="w-full  grid grid-cols-3 gap-4">
          <div className={`mb-4 text-gray-900 w-full  dark:text-gray-50 bg-gray-50 dark:bg-gray-800  p-8 col-span-2 rounded-lg shadow-md`}>
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
                  defaultValue={process_type.find(pt => Number(pt.value) === Number(data.process_type))?.name || "Unknown Process"}
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
                  disabled={true}
                />
                <InputError message={errors.code} className="mt-2" />
              </div>
              {/* Document Title */}
              <div className=''>
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

              {/* Document Code */}
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
          <div className={`mb-4 text-gray-900 w-full  dark:text-gray-50 bg-gray-50 dark:bg-gray-800  p-8 rounded-lg shadow-md grid grid-cols-2`}>

            {/* Reason of Conception/Revision */}
            <div className={`col-span-1 md:col-span-2`}>
              <InputLabel htmlFor="reasons" value="Reasons/Details of Request" />
              <TextArea
                id="reasons"
                name="reasons"
                value={data.reasons}
                onChange={handleChange}
                rows="4"
              ></TextArea>
              <InputError message={errors.reasons} className="mt-2" />
            </div>
            {/* File Upload */}
            <div className={`col-span-1 md:col-span-2 mt-2`}>
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

            <div className='mt-5 col-span-3 flex justify-start'>
              {
                isDownload === 1 &&
                <div className='mt-2 flex justify-start'>
                  <PrimaryButton className=" bg-blue-600" disabled={processing} onClick={downloadFileFromUrl}>
                    <span className=' text-white nunito-bold mx-2'>Download File</span>
                  </PrimaryButton>
                </div>
              }
            </div>
          </div>
        </div>
        <div className='mb-4 text-gray-900 w-full  dark:text-gray-50 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-4'>
          {
            data.file ?
              (
                <>
                  {data.fileType === 'Word' ?
                    (
                      <>
                        <div className='p-5'>
                          <b>Remarks:</b> <span>{remarks.remarks}</span>
                        </div>
                        <DocumentEditorContainerComponent height={'90vh'} 
                          serviceUrl={`${ip}:7087/api/documenteditor/`}
                          ref={(ins => editorObj = ins)}
                          toolbarItems={items}
                          enableToolbar={true}
                          showPropertiesPane={false}
                          currentUser={user.full_name}>
                          <Inject services={[Toolbar]}
                          ></Inject>
                        </DocumentEditorContainerComponent>
                      </>
                    ) :
                    (
                      <>
                        <div className='w-full rounded-lg overflow-hidden shadow-xl bg-gray-50 dark:bg-gray-800 grid grid-cols-4'>
                          <div className='col-span-3'>
                            <SpreadsheetComponent
                              ref={spreadsheetRef} height={'90vh'}
                              openUrl={`${ip}:7086/api/Spreadsheet/Open`}
                              saveUrl={`${ip}:7086/api/Spreadsheet/Save`}
                              allowOpen={true}
                              allowSave={true}
                              beforeSave={beforeSave}
                              saveComplete={saveComplete}
                            />
                          </div>
                          <div className='bg-gray-200 p-2 dark:bg-gray-950'>
                            <div className='w-full py-3 px-5 bg-gray-50 mb-1 dark:bg-gray-800'>
                              <span className=' nunito-bold font-extrabold'>Remarks: </span>{remarks.remarks}<br />
                            </div>
                            <div className='w-full  p-5 bg-gray-50 dark:bg-gray-800'>
                              <p className=' nunito-bold font-extrabold'>Comments:</p>
                              {comments.length > 0 ? (
                                <div className='w-full py-3 border-t border-gray-50 text-gray-800 dark:text-gray-50'>
                                  {comments.map((c, index) => (
                                    <div
                                      key={index}
                                      className="relative rounded-lg border border-gray-400  p-3 pb-4 mb-3 shadow-sm w-full block cursor-pointer"
                                      onClick={() => handleCommentClick(c.location)}
                                    >
                                      <h3 className="font-bold">{c.reviewer}</h3>
                                      <p className='px-2 mt-1 mb-5'>{c.comments}</p>

                                      <button
                                        className={`absolute right-3 top-3 z-50 text-gray-50 p-1 text-xs rounded-md ${Number(c.is_resolved) === 0 ? "bg-slate-700" : "bg-gray-500"
                                          }`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleResolved(c.id);
                                        }}
                                      >
                                        {Number(c.is_resolved) === 0 ? "✓ Mark as Resolved" : "Undo"}
                                      </button>

                                      <span className="absolute right-3 bottom-3 text-gray-600 text-xs">
                                        {c.comment_date}
                                      </span>
                                      <span className="absolute left-3 bottom-3 text-gray-600 text-xs">
                                        {Number(c.is_resolved) === 1 ? (
                                          <span className='text-gray-700 font-bold'>Status: Resolved</span>
                                        ) : (
                                          <span className='text-slate-800 font-bold'>Status: Unresolved</span>
                                        )}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-600 text-center dark:text-gray-50">
                                  No available comments
                                </span>
                              )}
                              <button onClick={removeHighlight} className='p-2 bg-blue-500 text-gray-50 text-xs rounded-lg'>Remove Highlight</button>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  }
                </>

              ) :
              (
                <EmptyDocuments />
              )
          }
          <div className='mt-5 col-span-3 flex justify-start'>
            <PrimaryButton className=" bg-blue-500" disabled={processing} onClick={openDialog}>
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
          message="Are you sure you want to submit this document change request?"
          subtitle="Please review and fix any layout errors before submitting. Ensure the uploaded document has been reviewed and approved by the respective division chief. This action is irreversible." />
      </div>
    </AuthenticatedLayout>

  );
}
