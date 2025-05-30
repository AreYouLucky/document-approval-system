import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { Link } from "@inertiajs/react";
import { MdNavigateNext } from "react-icons/md";
import { FaHome } from "react-icons/fa";

export default function BreadCrumbs({ className = "", tab = [] }) {

    return (
        <div className={`flex flex-row items-center text-sm p-6 w-full rounded-lg mb-3 bg-white dark:bg-gray-800 shadow-md ` + className}>
            <nav className="flex justify-end" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse text-slate-800 dark:text-gray-50">
                    <li className="inline-flex items-center">
                        <Link href="/dashboard" className="flex items-center  roboto-bold  hover:scale-105 duration-300">
                            <FaHome className="mr-2" size="20" />
                            Dashboard
                        </Link>
                    </li>
                    {tab.map((item, index) => (
                        <li key={index} className="inline-flex items-center ">
                            <MdNavigateNext />
                            {index === tab.length - 1 ? (
                                <span className=" ms-2 roboto-bold  text-gray-400">
                                    {item.name}
                                </span>) : (<Link href={item.url} className=" ms-2 roboto-bold hover:scale-105 duration-300 ">
                                    {item.name}
                                </Link>)}

                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    );
}
