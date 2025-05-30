import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import BreadCrumbs from '@/Components/displays/BreadCrumbs';
import { GrDocumentTime, GrDocumentVerified } from "react-icons/gr";
import { HiOutlineDocumentSearch } from "react-icons/hi";
import { Badge } from 'flowbite-react';
import { useEffect, useState } from 'react';

export default function QMRDocumentTabs({ children }) {
    const tabs = [
        { name: "ISO Documents", url: "" },
    ];
    const { url } = usePage();

    const [data, setData] = useState({});

    useEffect(() => {
        getProcessesCount();
    }, []);

    const getProcessesCount = () => {
        axios.get('/qmr/get-processes-count').then((res) => {
            setData(res.data);
        })
    };

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
            <div className='w-full px-4 py-4'>
                <BreadCrumbs tab={tabs} className="mb-2" />
                <div className="w-full bg-white dark:bg-gray-800 rounded-lg py-5 px-10 shadow-lg  dark:border-gray-950 ">
                    <div className="w-full flex flex-row border-b">
                        <Link className={` ${base} ${url === "/qmr/document-list" ? on : off} `} href='/qmr/document-list'>
                            <div className="relative flex items-center gap-2">
                                <GrDocumentTime />
                                <span className='nunito-regular'>For Review</span>
                                {Number(data.for_review) > 0 && <Badge className="bg-blue-200 text-slate-800 rounded-xl text-xs">{data.for_review}</Badge>}
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
