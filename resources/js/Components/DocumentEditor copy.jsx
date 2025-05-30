import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { DocumentEditorContainerComponent, Toolbar, Inject, Print } from '@syncfusion/ej2-react-documenteditor';
import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

const DocumentEditor = forwardRef(({ userName, beforeAcceptRejectChanges }, ref) => {
    let editorObj = null;
    const editorRef = useRef(null);
    useImperativeHandle(ref, () => ({
        getEditor: () => editorRef.current?.documentEditor
    }));

    const user = usePage().props.auth.user;
    let items = [
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
        "RestrictEditing",
    ];
    useEffect(() => {
        protection()
        setUserName(user.full_name)
    }, [])

    const insertImageWithWrap = () => {
        if (editorObj) {
            const imageUrl = '/storage/images/logo.png'; // Replace with your image URL

            // Insert image at cursor position
            editorObj.documentEditor.editor.insertImage(imageUrl, 150, 150);

            // Apply text wrapping after a short delay to ensure the image is inserted
            setTimeout(() => {
                const selection = editorObj.documentEditor.selection;
                if (selection) {
                    selection.characterFormat.textWrappingStyle = 'InFrontOfText'; // Correct way to apply text wrap
                }
            }, 100);
        }
    };



    const onSave = async () => {
        if (editorObj) {
            editorObj.documentEditor.saveAsBlob('Docx').then(async (blob) => {
                const formData = new FormData();
                formData.append('file', blob, 'document.docx');
                axios.post('/upload-document', formData).then(
                    res => {
                        console.log(res);
                    }
                )
            });
        }
    };

    const addComment = async () => {
        editorObj.documentEditor.editor.insertComment('Comment', commentProperties);
    }
    const viewComment = async () => {
        editorObj.documentEditor.editor.viewComment();
    }

    const nextComment = async () => {
        editorObj.documentEditor.selection.navigateNextComment();
    }

    const prevComment = async () => {
        editorObj.documentEditor.selection.navigatePreviousComment();
    }

    const protection = async () => {
        editorObj.documentEditor.editor.enforceProtection('123', "CommentsOnly");
    }


    // const revisionOnly = async () => {
    //     editorObj.documentEditor.editor.enforceProtection('123', "CommentsOnly", "RevisionsOnly");
    // }


    const stopProtection = async () => {
        editorObj.documentEditor.editor.stopProtection('123');
    }

    const onImport = async (event) => {
        const file = event.target.files[0];
        if (file && editorObj) {
            editorObj.documentEditor.open(file);
        }
    };

    const consoleComments = () => {
        let data = editorObj.documentEditor.getComments();
        console.log(data);
    };

    const beforeAcceptRejectChanges = (args) => {
        // Check the author of the revision
        if (args.author !== 'Hary') {
            // Cancel the accept/reject action
            args.cancel = true;
        }
    };

    let specificDate = new Date();

    // Define the properties of the comment including author, date, and resolution status.
    let commentProperties = {
        author: 'Nancy Davolio',          // The author of the comment.
        dateTime: specificDate,           // The date and time when the comment is created.
        isResolved: false                 // The status of the comment; false indicates it is unresolved.
    };
    const [userName, setUserName] = useState("John Doe");

    const onPrint = () => {
        editorObj.documentEditor.print();
      }



    return (
        <div className='max-w-full mx-auto'>
            {/* <button onClick={onSave} className='px-4 bg-blue-600 text-gray-50'> Save</button>
            <button onClick={addComment} className='px-4 bg-blue-600 text-gray-50'> View Comments</button>
            <button onClick={addComment} className='px-4 bg-blue-600 text-gray-50'> Add Comment</button>
            <button onClick={prevComment} className='px-4 bg-blue-600 text-gray-50'> prev</button>
            <button onClick={nextComment} className='px-4 bg-blue-600 text-gray-50'> next</button>
            <button onClick={protection} className='px-4 bg-blue-600 text-gray-50'> protect</button>
            <button onClick={stopProtection} className='px-4 bg-blue-600 text-gray-50'> stop protect</button>
            <button onClick={consoleComments} className='px-4 bg-blue-600 text-gray-50'> save Comments</button>
            <button onClick={revisionOnly} className='px-4 bg-blue-600 text-gray-50'> Revision Only</button>
            <button onClick={onPrint}>Print</button>

            <label className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer">
                Import
                <input type="file" accept=".docx,.rtf,.txt" onChange={onImport} className="hidden" />
            </label>

            <button onClick={insertImageWithWrap} className='px-4 py-2 bg-purple-600 text-white rounded'>
                Insert Image (In Front of Text)
            </button> */}



            <DocumentEditorContainerComponent height={'90vh'}  serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
                ref={(ins => editorObj = ins)}
                toolbarItems={items}
                enableToolbar={false}
                showPropertiesPane={false}
                enableTrackChanges={false}
                enableComment={true}
                currentUser={userName}
                beforeAcceptRejectChanges={beforeAcceptRejectChanges}>
                <Inject services={[Toolbar]}></Inject>
            </DocumentEditorContainerComponent>
        </div>
    );
})
export default DocumentEditor;
