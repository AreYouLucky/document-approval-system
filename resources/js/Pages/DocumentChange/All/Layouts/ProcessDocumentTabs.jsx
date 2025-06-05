import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import BreadCrumbs from '@/Components/displays/BreadCrumbs';
import { GrDocumentTime, GrDocumentConfig } from "react-icons/gr";
import { HiOutlineDocumentSearch } from "react-icons/hi";
import { useEffect, useState } from 'react';
import { Badge } from 'flowbite-react';

export default function ProcessDocumentTabs({ children }) {
    const tabs = [
        { name: "ISO Documents", url: "" },
    ];

    const [data, setData] = useState({});

    useEffect(() => {
        getProcessesCount();
    }, []);

    const getProcessesCount = () => {
        axios.get('/process/get-processes-count').then((res) => {
            setData(res.data);
        })
    };

    const { url } = usePage();

    const base = "flex items-center justify-center rounded-t-lg px-4 py-3 text-sm font-medium  focus:outline-none disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500"
    const on = " rounded-t-lg border-b-2 border-blue-400 text-blue-600 dark:border-blue-500 dark:text-blue-500 font-bolder ";
    const off = " border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 "
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Document List
                </h2>
            }
        >
            <Head title="Document List" />
            <div className='w-full px-4 py-4 '>
                <BreadCrumbs tab={tabs} className="mb-2" />


                <div className="w-full bg-white dark:bg-gray-800 rounded-lg py-5 px-10 shadow-lg  dark:border-gray-950 ">
                    <div className="w-full flex flex-row border-b">
                        <Link className={` ${base} ${url === "/process/pending-list" ? on : off} `} href='/process/pending-list'>
                            <div className="relative flex items-center gap-2">
                                <GrDocumentTime />
                                <span className='nunito-regular'>Pendings</span>
                                {Number(data.pending) > 0 && <Badge className="bg-blue-200 rounded-xl text-slate-800 text-xs">{data.pending}</Badge>}
                            </div>
                        </Link>
                        <Link className={` ${base} ${url === "/process/revision-list" ? on : off} `} href='/process/revision-list'>
                            <div className="relative flex items-center gap-2">
                                <GrDocumentConfig />
                                <span className='nunito-regular'>For Revisions</span>
                                {Number(data.forrevision) > 0 && <Badge color="red" className="bg-blue-200 rounded-xl text-slate-800 text-xs">{data.forrevision}</Badge>}
                            </div>
                        </Link>
                        <Link className={` ${base} ${url === "/process/rejected-list" ? on : off} `} href='/process/rejected-list'>
                            <div className="flex items-center gap-2">
                                <HiOutlineDocumentSearch />
                                <span className='nunito-regular'>Rejected</span>
                                {Number(data.rejected) > 0 && <Badge color="red" className="bg-blue-200 rounded-xl text-slate-800 text-xs">{data.rejected}</Badge>}

                            </div>
                        </Link>
                    </div>
                    <div className='w-full pt-4 px-2'>
                        {children}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
