import React from 'react'
import ContentCard from '../Partials/ContentCard';
import { CiSearch } from "react-icons/ci";
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import SelectSearch from '@/Components/Forms/SelectSearch';
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { FaDownload } from "react-icons/fa";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

function IsoDocuments() {
    const user = usePage().props.auth.user;
    const [data, setData] = useState([]);
    const [currentData, setCurrentData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [divisionSearch, setDivisionSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const division = [
        { name: "FAD", value: 1 },
        { name: "IRAD", value: 2 },
        { name: "CRPD", value: 3 },
        { name: "OD-MISPS", value: 4 },
    ];

    useEffect(() => {
        if (user.qms_role === 'Process Owner') {
            getDocuments('/process/load-approved-documents')
        }
        else if (user.qms_role === 'Document Custodian') {
            getDocuments('/dc/load-approved-documents')
        }
        else {
            getDocuments('/qmr/load-approved-documents')
        }
    }, []);

    const getDocuments = (url) => {
        axios.get(url).then(
            res => {
                setData(res.data);
                setCurrentData(res.data)
            }
        )
    }

    const convertDate = (date) => {
        if (!date) return "";
        const parsedDate = new Date(date);
        return parsedDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const downloadReports = () => {
        axios.get('/load-documents-report').then(
            res => {
                const data = res.data;
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Reports');

                worksheet.columns = [
                    { header: 'TYPE OF DOCUMENT', key: 'document_type', width: 25 },
                    { header: 'DOCUMENT CODE', key: 'code', width: 25 },
                    { header: 'DOCUMENT TITLE', key: 'title', width: 40 },
                    { header: 'RESPONSIBLE PERSON', key: 'process_owner', width: 20 },
                    { header: 'REVISION No.', key: 'version_no', width: 20 },
                    { header: 'EFFECTIVITY DATE.', key: 'effectivity_date', width: 20 }
                ];
                data.forEach(item => {
                    worksheet.addRow({
                        document_type: item.document_type,
                        code: item.code,
                        title: item.title,
                        process_owner: item.process_owner,
                        version_no: item.version_no,
                        effectivity_date: convertDate(item.effectivity_date),
                    });
                });

                workbook.xlsx.writeBuffer().then(buffer => {
                    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    saveAs(blob, 'document-reports.xlsx');
                });
            }
        )
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };
    const filteredData = () => {
        let dataFiltered = data.filter((data) =>
            data.title.toLowerCase().includes(searchTerm.toLowerCase()))

        setCurrentData(dataFiltered.slice(indexOfFirst, indexOfLast));
    }

    const handleDivisionSearch = (e) => {
        setDivisionSearch(e.target.value)
        setCurrentPage(1)
    }

    const filteredDataByDivision = () => {
        if (division === 'Division') {
            PaginateData()
        }
        else {
            let dataFiltered = data.filter((data) =>
                data.division.includes(divisionSearch.toLowerCase()))
            setCurrentData(dataFiltered.slice(indexOfFirst, indexOfLast));
        }
    }

    const PaginateData = () => {
        setCurrentData(data.slice(indexOfFirst, indexOfLast));
    }

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const count = {
        from: data.length === 0 ? 0 : indexOfFirst + 1,
        to: Math.min(indexOfLast, data.length),
        total: data.length,
    };
    const isPrevDisabled = currentPage === 1;
    const isNextDisabled = indexOfLast >= data.length;
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

    useEffect(() => {
        PaginateData()
    }, [currentPage]);

    useEffect(() => {
        filteredData()
    }, [searchTerm])

    useEffect(() => {
        PaginateData()
    }, [data])

    useEffect(() => {
        filteredDataByDivision()
    }, [divisionSearch])

    return (
        <div className="w-full bg-gray-100 dark:bg-gray-900 flex justify-center md:py-2 md:px-10 px-2">
            <div className='w-full max-w-[100vw] md:max-w-[70vw] lg:max-w-[80vw] md:px-10 p-2'>
                <div className="mb-5">
                    <div className="py-5 pt-10 px-4 mx-auto  text-center relative w-full">
                        <h1 className="mb-4 text-xl font-bold tracking-tight leading-none text-gray-800 md:text-3xl dark:text-white ">
                            ISO Related Documents
                        </h1>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-full max-w-[100%] md:max-w-[80%] mx-auto py-4">
                            {/* SelectSearch component */}
                            {user.qms_role !== 'Process Owner' &&
                                <div className="w-full md:w-1/6">
                                    <SelectSearch
                                        id="division"
                                        items={division}
                                        itemValue="value"
                                        itemName="name"
                                        name="division"
                                        defaultValue="Division"
                                        onChange={handleDivisionSearch}
                                    />
                                </div>
                            }


                            {/* Search input */}
                            <div className="relative w-full md:w-2/5">
                                <div className="absolute inset-y-0 left-0 flex items-center ps-3.5 pointer-events-none">
                                    <CiSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="default-search"
                                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Enter keywords here..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                            {user.qms_role !== 'Process Owner' &&
                                <button className='relative p-4 ps-10 rounded-lg border bg-blue-500 text-gray-50 roboto-bold text-sm' onClick={downloadReports}>
                                    <div className="absolute inset-y-0 left-0 flex items-center ps-3.5 pointer-events-none">
                                        <FaDownload className="w-4 h-4 text-gray-50 dark:text-gray-400" />
                                    </div>
                                    Download Report
                                </button>
                            }
                        </div>

                    </div>
                </div>
                <div className='grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 lg:gap-4 gap-2 pb-8 mt-2'>
                    {currentData.map((item, index) => (
                        <div className='w-full duration-300 hover:scale-105 ' key={index}>
                            <ContentCard data={item} />
                        </div>
                    ))}
                </div>
                <div className='w-full flex justify-between py-5'>
                    <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Showing <span className="font-semibold text-gray-800 dark:text-white">{count.from}</span> to <span className="font-semibold text-gray-600 dark:text-white">{count.to}</span> of <span className="font-semibold text-gray-600 dark:text-white">{count.total}</span> Entries
                        </span>
                    </div>
                    <div className='flex'>
                        <button
                            onClick={prevPage}
                            disabled={isPrevDisabled}
                            className={`flex items-center justify-center px-3 h-8 me-3 text-sm font-medium border rounded-lg ${isPrevDisabled
                                ? "text-gray-50 bg-gray-400 cursor-not-allowed dark:border border-gray-50 dark:bg-transparent"
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
                                ? "text-gray-50 bg-gray-400 cursor-not-allowed dark:border border-gray-50 dark:bg-transparent"
                                : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:border border-gray-50 dark:bg-transparent"
                                }`}
                        >
                            Next
                            <GrLinkNext size={15} className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default IsoDocuments