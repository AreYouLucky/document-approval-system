import SearchInput from '@/Components/Forms/SearchInput';
import DataTable from '@/Components/displays/DataTable';
import PrimaryButton from '@/Components/Forms/PrimaryButton';
import { useState, useEffect } from 'react';
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import {Head} from '@inertiajs/react';
import { router } from "@inertiajs/react";
import DcDocumentTabs from '../Layouts/DcDocumentTabs';
import MoreActions from '../../All/Partials/MoreActions';

export default function DcFinalReviewList() {
    const process_type = [
        { name: "NEW", value: 1 },
        { name: "REVISION", value: 2 },
        { name: "DELETE", value: 3 },
    ];

    const [documents, setDocuments] = useState([]);
    const [currentDocuments, setCurrentDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
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
        name: "Document Type",
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

    const fetchDocuments = () => {
        setLoading(true)
        axios.get('/dc/load-final-review-documents').then(
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



    return (
        <DcDocumentTabs>
            <Head title="Final Review List" />

            <div className='text-gray-900 dark:text-gray-50 w-full rounded-lg'>
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
                            <tr key={index} className=" border-b dark:border-gray-700  hover:bg-gray-200 dark:hover:bg-gray-600" >
                                <th scope="row" className="px-6 py-4 font-medium">
                                    {item.code}
                                </th>
                                <td className="px-6 py-4">
                                    {item.title}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {process_type.find(pt => Number(pt.value) === Number(item.process_type))?.name || "Unknown Process"}
                                </td>
                                <td className="text-center">
                                    {item.document_type}
                                </td>
                                <td className=" flex justify-center items-center py-1">
                                    <PrimaryButton className="px-2 py-1 text-xs bg-blue-500 text-white" onClick={() => { router.visit('/dc/final-review-document-auth/' + item.document_id) }}>Review</PrimaryButton>
                                    <MoreActions item={item} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr >
                            <td
                                colSpan={headers.length}
                                className="text-center px-6 py-4  text-gray-800 dark:text-gray-50"
                            >
                                No Available Data
                            </td>
                        </tr>
                    )}


                </DataTable>
                <div className='w-full flex justify-between py-5'>
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
        </DcDocumentTabs>
    );
}
