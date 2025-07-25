import SearchInput from '@/Components/Forms/SearchInput';
import DataTable from '@/Components/displays/DataTable';
import PrimaryButton from '@/Components/Forms/PrimaryButton';
import { useState, useEffect } from 'react';
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { HiClock } from "react-icons/hi";
import { Badge } from "flowbite-react";
import { router } from "@inertiajs/react"
import DocumentReviewLogs from '@/Pages/Public/DocumentReviewLogs';
import ProcessDocumentTabs from '../Layouts/ProcessDocumentTabs';

export default function ProcessRevisionList() {
    const [data, setData] = useState(
        {
            id: '',
            full_name: '',
            role: '',
            image_path: ''
        })

    const process_type = [
        { name: "NEW", value: 1 },
        { name: "REVISION", value: 2 },
        { name: "DELETE", value: 3 },
    ];
    const [isReviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [currentDocuments, setCurrentDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [id, setId] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [loading, setLoading] = useState(false);
    const headers = [{
        name: "Document Code",
        position: 'start'
    },
    {
        name: "Title",
        position: 'start'
    },
    {
        name: "Process Type",
        position: 'center'
    },
    {
        name: "Progress",
        position: 'center'
    },
    {
        name: "Actions",
        position: 'center'
    }];

    useEffect(() => {
        fetchDocuments();
    }, []);

    useEffect(() => {
        PaginateDocuments()
    }, [currentPage]);

    useEffect(() => {
        filteredDocuments()
    }, [searchTerm])

    useEffect(() => {
        PaginateDocuments()
    }, [documents])
    const openReviewDialog = (id) => {
        setId(id);
        setReviewDialogOpen(true)
    }

    const fetchDocuments = () => {
        setLoading(true)
        axios.get('/process/load-revision-documents').then(
            res => {
                setDocuments(res.data);
                setCurrentDocuments(res.data)
                setLoading(false)
            }
        )
    };
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };
    const filteredDocuments = () => {
        let documentsFiltered = documents.filter((documents) =>
            documents.title.toLowerCase().includes(searchTerm.toLowerCase()))

        setCurrentDocuments(documentsFiltered.slice(indexOfFirst, indexOfLast));
    }


    const PaginateDocuments = () => {
        setCurrentDocuments(documents.slice(indexOfFirst, indexOfLast));
    }

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const count = {
        from: documents.length === 0 ? 0 : indexOfFirst + 1,
        to: Math.min(indexOfLast, documents.length),
        total: documents.length,
    };
    const isPrevDisabled = currentPage === 1;
    const isNextDisabled = indexOfLast >= documents.length;
    const nextPage = () => {
        if (!isNextDisabled) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const prevPage = () => {
        if (!isPrevDisabled) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const viewDocument = (id) => {
        router.visit('/view-document/' + id)
    }



    return (
        <ProcessDocumentTabs>
            <div className=' text-gray-900 dark:text-gray-50 w-full rounded-lg'>
                <div className='w-full flex  flex-wrap justify-between align-middle mb-4'>
                    <div>
                        <SearchInput
                            placeholder="Search Document Name"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
                <DataTable headers={headers}>
                    {loading ? (
                        <tr>
                            <td
                                colSpan={headers.length}
                                className="text-center py-4"
                            >
                                <div className="flex justify-center items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                    <span className="ml-3 text-gray-500">
                                        Loading...
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ) : currentDocuments.length > 0 ? (
                        currentDocuments.map((item, index) => (
                            <tr key={index} className=" border-b dark:bg-gray-800 dark:border-gray-700  hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-50" >
                                <th scope="row" className="px-6 py-4 font-medium">
                                    {item.code}
                                </th>
                                <td className="px-6 py-4">
                                    {item.title}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {process_type.find(pt => Number(pt.value) === Number(item.process_type))?.name || "Unknown Process"}
                                </td>
                                <td className="px-6 py-4 flex justify-center align-middle">
                                    {Number(item.is_final) === 0 && Number(item.progress_status) === 1 ? (
                                        <> <Badge color="blue" icon={HiClock} className='text-center' >
                                            For Revision (DC)
                                        </Badge></>
                                    ) : Number(item.is_final) === 0 && Number(item.progress_status) === 4 ? (
                                        <>  <Badge color="blue" icon={HiClock} className='w-fit text-center'>
                                            For Revision (QMR)
                                        </Badge></>) : null}
                                </td>
                                <td className="px-6 py-4 text-center ">
                                    <PrimaryButton className="m-1 px-2 py-1 text-xs bg-yellow-500 text-white " onClick={() => { router.visit('/process/view-revise-documents/'+item.revision_id) }}>Revise</PrimaryButton>
                                    <PrimaryButton className="m-1 px-2 py-1 text-xs bg-cyan-800 text-white " onClick={() => viewDocument(item.revision_id)}>View</PrimaryButton>
                                    <PrimaryButton className="m-1 px-2 py-1 text-xs bg-blue-700 text-white" onClick={() => openReviewDialog(item.document_id)}>Logs</PrimaryButton>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr >
                            <td
                                colSpan={headers.length}
                                className="text-center px-6 py-4  text-gray-800 dark:text-gray-50 "
                            >
                                No Available Data
                            </td>
                        </tr>
                    )}


                </DataTable>
                <div className='w-full flex justify-between pt-5'>
                    <div>
                        <span className="text-sm text-gray-700 dark:text-gray-400">
                            Showing <span className="font-semibold text-gray-900 dark:text-white">{count.from}</span> to <span className="font-semibold text-gray-900 dark:text-white">{count.to}</span> of <span className="font-semibold text-gray-900 dark:text-white">{count.total}</span> Entries
                        </span>
                    </div>
                    <div className='flex'>
                        <button
                            onClick={prevPage}
                            disabled={isPrevDisabled}
                            className={`flex items-center justify-center px-3 h-8 me-3 text-sm font-medium border rounded-lg ${isPrevDisabled
                                ? "text-gray-400 bg-gray-200 cursor-not-allowed dark:border border-gray-50 dark:bg-transparent"
                                : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:border border-gray-50 dark:bg-transparent"
                                }`}
                        >
                            <GrLinkPrevious size={15} className="mr-2" />
                            Prev
                        </button>
                        <button
                            onClick={nextPage}
                            disabled={isNextDisabled}
                            className={`flex items-center justify-center px-3 h-8 text-sm font-medium border rounded-lg ${isNextDisabled
                                ? "text-gray-400 bg-gray-200 cursor-not-allowed dark:border border-gray-50 dark:bg-transparent"
                                : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:border border-gray-50 dark:bg-transparent"
                                }`}

                        >
                            Next
                            <GrLinkNext size={15} className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
            <DocumentReviewLogs show={isReviewDialogOpen} onClose={() => setReviewDialogOpen(false)} id={id} />
        </ProcessDocumentTabs>
    );
}
