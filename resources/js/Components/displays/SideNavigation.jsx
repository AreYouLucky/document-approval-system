
import { Sidebar, Badge, Avatar } from "flowbite-react";
import { HiChartPie } from "react-icons/hi";
import { Link, usePage, router } from '@inertiajs/react';
import SearchBar from '@/Components/Clickables/SearchBar';
import { LuMessageCircle } from "react-icons/lu";
import { ImProfile } from "react-icons/im";
import { RiLockPasswordLine, RiMailSendFill } from "react-icons/ri";
import { MdPendingActions } from "react-icons/md";
import { FaClipboardCheck } from "react-icons/fa";
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import { FaUsers } from "react-icons/fa";


export default function SideNavigation({ isOpen
}) {
    const user = usePage().props.auth.user;
    const { url } = usePage();
    const avatarSrc = user.image_path
        ? `http://hris.stii.local/frontend/hris/images/user_image/${user.image.path}`
        : "/storage/images/user.png";
    return (
        <Sidebar
            aria-label="Sidebar with multi-level dropdown example"
            className={`fixed rounded-tr-xl overflow-hidden h-full min-h-screen text-xs top-0 left-0 w-64 shadow-lg z-50 transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:block`}
        >
            <div className="my-4">
                <Avatar img={avatarSrc} rounded bordered size="lg" />
                <div className="text-center mt-2 border-b-2 pb-5">
                    <span className="nunito-bold text-sm underline underline-offset-1">{user.full_name}</span> <br />
                    <span className="nunito-thin text-xs">{user.qms_role}</span>
                </div>
            </div>
            <SearchBar className="md:hidden block mb-4" />
            <Sidebar.Items>
                <Sidebar.ItemGroup>

                    <Sidebar.Item onClick={() => { router.visit('/dashboard') }} icon={() => (
                        <HiChartPie
                            size="20"
                        />
                    )}
                        className={`text-xs hover:bg-blue-400 hover:text-white cursor-pointer + ${(url === '/dashboard'
                            ? "bg-blue-500 text-white"
                            : "text-black bg-transparent")}`} >
                        Dashboard
                    </Sidebar.Item>

                    <Sidebar.Item onClick={() => { router.visit('/users') }} icon={() => (
                        <FaUsers
                            size="20"
                        />
                    )}
                        className={`text-xs hover:bg-blue-400 hover:text-white cursor-pointer + ${(url === '/users'
                            ? "bg-blue-500 text-white"
                            : "text-black bg-transparent")}`} >
                        Users
                    </Sidebar.Item>

                    <Sidebar.Item
                        href="#"
                        icon={() => (
                            <LuMessageCircle size="20" />
                        )}
                        className={`text-xs cursor-pointer flex items-center justify-between hover:bg-blue-400 hover:text-white ${url === '/messages' ? "bg-blue-500 text-white" : "text-black bg-transparent"
                            }`}
                    >
                        <div className="flex items-center gap-2 w-full">
                            <span>Messages</span>
                            <Badge className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                                20
                            </Badge>
                        </div>
                    </Sidebar.Item>

                    <Sidebar.Collapse
                        icon={() => (
                            <HiMiniClipboardDocumentList size="20" />
                        )}
                        label="ISO Document Change"
                        className="text-xs hover:bg-blue-400 hover:text-white transition-all duration-400 ease-in-out"
                    >
                        <Sidebar.Item onClick={() => { router.visit('/document-change') }}
                            className={`cursor-pointer text-xs roboto-thin hover:bg-blue-400 hover:text-white transition-all duration-400 ease-in-out ${url === '/document-change' ? "bg-blue-500 text-white" : "text-black bg-transparent"
                                }`}
                        >
                            <div className="flex items-center gap-2 w-full">
                                <RiMailSendFill size="15" />
                                <span>Submit Request</span>
                            </div>
                        </Sidebar.Item>
                        <Sidebar.Item
                            onClick={() => { router.visit('/document-list') }}
                            className={` cursor-pointer text-xs roboto-thin hover:bg-blue-400 hover:text-white transition-all duration-400 ease-in-out ${url === '/document-list' ? "bg-blue-500 text-white" : "text-black bg-transparent"
                                }`}
                        >
                            <div className="flex items-center gap-2 w-full">
                                <FaClipboardCheck size="15" />
                                <span>Document Submitted</span>
                            </div>
                        </Sidebar.Item>
                    </Sidebar.Collapse>
                </Sidebar.ItemGroup>
            </Sidebar.Items>

            <Sidebar.CTA className="bg-blue-200">
                <div className="mb-3 flex items-center ">
                    <Badge color="warning">Beta Launch</Badge>

                </div>
                <div className="mb-3 text-sm text-cyan-900 dark:text-gray-400">
                    <b>QMS portal</b> is still under development more feature will be added soon!
                </div>
            </Sidebar.CTA>
            <div className="mt-8 block md:hidden border-t-2 py-2">
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        <Sidebar.Item href="#" icon={() => (
                            <ImProfile
                                size="20"
                            />
                        )}
                            className={`text-xs hover:bg-blue-400 hover:text-white + ${(url === '/profile'
                                ? "bg-blue-500 text-white"
                                : "text-black bg-transparent")}`} >
                            Profile
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={() => (
                            <RiLockPasswordLine
                                size="20"
                            />
                        )}
                            className={`text-xs hover:bg-blue-400 hover:text-white + ${(url === '/change_password'
                                ? "bg-blue-500 text-white"
                                : "text-black bg-transparent")}`} >
                            Change Password
                        </Sidebar.Item>
                        <Sidebar.Item href="#"
                            className={`text-xs hover:bg-blue-400 dark:bg-gray-100 dark:text-gray-700 text-center m-5 bg-blue-700 text-white`}>
                            <span className="dark:text-black text-center text-white">Logout</span>
                        </Sidebar.Item>
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </div>
        </Sidebar>
    );
}
