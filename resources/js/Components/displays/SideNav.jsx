import { useState } from "react";
import { HiChartPie, HiMiniClipboardDocumentList } from "react-icons/hi2";
import { FaUsers, FaClipboardCheck } from "react-icons/fa";
import { RiMailSendFill } from "react-icons/ri";
import { LuMessageCircle } from "react-icons/lu";
import { MdArrowDropDown } from "react-icons/md";
import { useEffect } from "react";
import { MdPageview } from "react-icons/md";
import { Link, usePage, router } from '@inertiajs/react';
import { CiLogout } from "react-icons/ci";
import SearchBar from "../Clickables/SearchBar";
export default function SideNav({ isOpen, setIsOpen }) {
    const { url } = usePage();
    const user = usePage().props.auth.user;
    const avatarSrc = user.image_path
        ? `http://hris.stii.local/frontend/hris/images/user_image/${user.image.path}`
        : "/storage/images/unknown-user.png";
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    useEffect(() => {
        const sidebar = document.getElementById("logo-sidebar");
        if (sidebar) {
            new Drawer(sidebar, {
                placement: "left",
                backdrop: false,
            });
        }
    }, []);

    return (
        <>
            <aside
                className={`fixed shadow-md border py-10 px-2 top-0 left-0 z-40 w-64 h-screen transition-transform bg-white dark:bg-slate-900 text-slate-900 dark:text-white 
            ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
                id="logo-sidebar">
                <div className="h-full overflow-y-auto roboto-sm">
                    <div className="my-4 px-5">
                        <div className="relative mx-auto w-24 h-24 overflow-hidden bg-gray-100 rounded-full border-2 border-gray-100">
                            <img src={avatarSrc} className="w-full" />
                        </div>
                        <div className="text-center mt-2">
                            <span className="nunito-bold text-base underline underline-offset-1">{user.full_name}</span> <br />
                            <span className="nunito-thin text-sm mt-[-10px]">{user.qms_role}</span>
                        </div>
                        <div className=" border-b py-5 flex justify-center">
                            <div>
                                <button type="button" onClick={() => { router.visit('/profile') }} className="text-slate-900 shadow-sm border dark:text-gray-50 0  font-medium rounded-lg text-sm p-2 text-center inline-flex items-center me-2 hover:scale-105 duration-300">
                                    <MdPageview size={25} className="mr-2" />
                                    Profile
                                </button>
                            </div>
                            <div>
                                <button type="button" onClick={() => { router.visit('/logout') }} className="text-slate-900 border shadow-sm     dark:text-gray-50 0  font-medium rounded-lg text-sm p-2 text-center inline-flex items-center me-2 hover:scale-105 duration-300 ">
                                    Logout
                                    <CiLogout size={25} className="ml-2" />
                                </button>
                            </div>
                        </div>
                        <SearchBar className='min-w-[200px] block md:hidden' />

                    </div>
                    <ul className="space-y-2 text-sm mt-5 px-3">
                        <li>
                            <Link href="/dashboard" className={`hover:scale-105 duration-300 flex items-center p-2 rounded-lg group  ${url === "/dashboard" ? "bg-blue-600 text-gray-50" : "text-slate-900 dark:text-white"}`}>
                                <HiChartPie className="w-5 h-5" />
                                <span className="ms-3">Dashboard</span>
                            </Link>
                        </li>

                        {/* ISO Document Dropdown */}
                        <li>
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center w-full p-2 rounded-lg group ">
                                <HiMiniClipboardDocumentList className="w-5 h-5 text-slate-900 dark:text-gray-50 group-hover:text-gray-900 dark:group-" />
                                <span className="flex-1 ms-3 text-left whitespace-nowrap text-slate-900 dark:text-gray-50">ISO Documents</span>
                                <MdArrowDropDown className={`transition-transform  ${isDropdownOpen ? "rotate-180" : ""}`} size={20} />
                            </button>
                            {isDropdownOpen && (
                                <ul className="py-2 space-y-2">
                                    {user.qms_role === 'Process Owner' ? (<>
                                        <li>
                                            <Link href="/document-change" className={` hover:scale-105 duration-300 flex items-center w-full p-2 rounded-lg pl-11 group  dark:hover:bg-gray-700 ${url === "/document-change" ? "bg-blue-600 text-gray-50" : "text-slate-900 dark:text-white"}`}>
                                                <RiMailSendFill className="w-4 h-4" />
                                                <span className="ms-2">Submit Request</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/process/pending-list" className={` hover:scale-105 duration-300 flex items-center w-full p-2 rounded-lg pl-11 group  ${url === "/process/pending-list" ? "bg-blue-600 text-gray-50" : "text-slate-900 dark:text-white"}`}>
                                                <FaClipboardCheck className="w-4 h-4 " />
                                                <span className="ms-2">Submitted Requests</span>
                                            </Link>
                                        </li>
                                    </>) : user.qms_role === 'Document Custodian' ? (<>
                                        <li>
                                            <Link href="/dc/initial-review-list" className={` hover:scale-105 duration-300 flex items-center w-full p-2 rounded-lg pl-11 group  ${url === "/dc/initial-review-list" ? "bg-blue-600 text-gray-50 " : "text-slate-900 dark:text-white"}`}>
                                                <FaClipboardCheck className="w-4 h-4 " />
                                                <span className="ms-2">Requests List</span>
                                            </Link>
                                        </li>
                                    </>) : user.qms_role === 'QMR' ? (<>
                                        <li>
                                            <Link href="/qmr/document-list" className={` hover:scale-105 duration-300 flex items-center w-full p-2 rounded-lg pl-11 group  ${url === "/qmr/document-list" ? "bg-blue-600 text-gray-50 " : "text-slate-900 dark:text-white"}`}>
                                                <FaClipboardCheck className="w-4 h-4 " />
                                                <span className="ms-2">Requests List</span>
                                            </Link>
                                        </li>
                                    </>) : null}
                                </ul>
                            )}
                        </li>

                        {/* Users */}
                        {user.qms_role === 'Super Admin' && (<>
                            <li>
                                <Link href="/users" className={`hover:scale-105 duration-300 flex items-center p-2 rounded-lg group  ${url === "/users" ? "bg-blue-400 text-gray-50" : "text-gray-100 dark:text-white"}`}>
                                    <FaUsers className="w-5 h-5 text-gray-100 dark:text-gray-400 group-hover:text-gray-900 dark:group-" />
                                    <span className="ms-3">Users</span>
                                </Link>
                            </li>
                        </>)}

                    </ul>
                    <div className="w-full px-4">
                        <div id="dropdown-cta" className="p-4 mt-6 rounded-lg bg-blue-50 shadow-md border" role="alert">
                            <div className="flex items-center mb-3">
                                <span className="bg-blue-500 text-gray-50 text-sm font-semibold me-2 px-2.5 py-0.5 rounded-sm ">Beta</span>
                            </div>
                            <p className="mb-3 text-sm text-gray-700 ">
                                <b>QMS portal</b> is still under development more features will be added soon!
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
