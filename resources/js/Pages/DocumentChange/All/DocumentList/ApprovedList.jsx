import React from 'react'
import { CiSearch } from "react-icons/ci";
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import SelectSearch from '@/Components/Forms/SelectSearch';
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { FaDownload } from "react-icons/fa";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadCrumbs from '@/Components/displays/BreadCrumbs';
import DataTable from '@/Components/displays/DataTable';
import Actions from '../Partials/Actions';
import {Head} from '@inertiajs/react';

function IsoDocuments() {
    const user = usePage().props.auth.user;
    const [data, setData] = useState([]);
    const [currentData, setCurrentData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [divisionSearch, setDivisionSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const division = [
        { name: "FAD", value: 1 },
        { name: "IRAD", value: 2 },
        { name: "CRPD", value: 3 },
        { name: "OD-MISPS", value: 4 },
    ];

    const headers = [{
        name: "Document Code",
        position: 'start'
    },
    {
        name: "Title",
        position: 'start'
    },
    {
        name: "Document Type",
        position: 'start'
    },
    {
        name: "Version No",
        position: 'center'
    },
    {
        name: "Actions",
        position: 'center'
    }];


    const tabs = [
        { name: "Document Registry", url: "" },
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
        if (divisionSearch === '') {
            PaginateData()
        }
        else {
            let dataFiltered = data.filter((data) => data.division === divisionSearch);


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
        <AuthenticatedLayout>
            <Head title="Approved List" />
            <BreadCrumbs tab={tabs} className="m-2" />
            <div className="w-full flex justify-center px-2 pb-2 mb-10">
                <div className='w-full  md:px-10 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border'>
                    <div className="mb-2">
                        <div className=" mx-auto  text-center relative w-full">
                            <div className="flex flex-col md:flex-row items-center justify-start gap-2 w-full  py-2">
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
                                <div className="relative w-full md:w-1/5">
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

                    <DataTable headers={headers}>
                        {currentData.map((item, index) => (
                            <tr
                                key={index}
                                className="border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-50"
                            >
                                <th scope="row" className="px-6 py-4 font-medium">
                                    {item.code}
                                </th>
                                <td className="px-6 py-4">{item.title}</td>
                                <td className="px-6 py-4">{item.document_type}</td>
                                <td className="px-6 py-4 text-center">{item.version_no}</td>
                                <td className="text-center relative">
                                    <Actions item={item} />
                                </td>
                            </tr>
                        ))}
                    </DataTable>
                    <div className='w-full flex justify-between py-5'>
                        <div>
                            <span className="md:text-sm text-xs text-gray-600 dark:text-gray-400">
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
        </AuthenticatedLayout >

    )
}

export default IsoDocuments