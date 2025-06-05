import React from 'react'
import { useEffect, useState } from 'react'
import { router, usePage } from '@inertiajs/react';
import ApplicationLogoDashboard from '@/Components/displays/ApplicationLogoDashboard';
import ApplicationLogoSecondary from '@/Components/displays/ApplicationLogoSecondary';
import ToggleTheme from '@/Components/displays/ToggleTheme';
import PrimaryButton from '@/Components/Forms/PrimaryButton';
import {
    LogIn
} from "lucide-react";
import { GrDashboard } from 'react-icons/gr';


function GuestDashboardLayout({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const { url } = usePage();
    const [darkMode, setDarkMode] = useState(() => {
        const storedTheme = localStorage.getItem("theme");
        return storedTheme ? storedTheme === "dark" : true;
    });



    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    useEffect(() => {
        const handleResize = () => setIsOpen(window.innerWidth >= 768);
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (
        <div className="min-h-screen roboto-thin text-sm bg-blue-50 dark:bg-gray-900 dark:text-white w-full max-w-full">
            <div className="w-full py-4 dark:bg-gray-950 bg-white shadow-md border-b sticky top-0 z-50">
                <div className='w-full flex justify-between items-center'>
                    <div className="flex">
                        <div className='flex items-center md:ml-5'>
                            {darkMode ? (
                                <ApplicationLogoDashboard className="mx-2 mr-10 md:w-40 w-24" />
                            ) : (
                                <ApplicationLogoSecondary className="mx-2 mr-10 md:w-40 w-24" />
                            )}
                        </div>
                    </div>
                    {window.location.pathname === '/' &&
                        <div className='animate-slideInUp hidden md:block' >
                            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ">
                                <li>
                                    <a href="#About" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:text-white md:dark:hover:bg-transparent">About</a>
                                </li>
                                <li>
                                    <a href="#Team" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:text-white md:dark:hover:bg-transparent">QMS Team</a>
                                </li>
                                <li>
                                    <a href="#Events" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:text-white md:dark:hover:bg-transparent">Events</a>
                                </li>
                                <li>
                                    <a href="#Calendar" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:text-white md:dark:hover:bg-transparent">Calendar</a>
                                </li>
                            </ul>
                        </div>
                    }
                    <div className="flex items-center ">
                        <ToggleTheme darkMode={darkMode} setDarkMode={setDarkMode} className="mr-2" />
                        {window.location.pathname === '/' ? (
                            <PrimaryButton onClick={() => { router.visit('/guest-login') }} className="mr-2 md:mr-8 bg-blue-500" >
                                <div>
                                    <LogIn
                                        size={10}
                                        strokeWidth={2}
                                        className="mr-2"
                                        color="#c7c7c7"
                                    />

                                </div>
                                <span className=' text-white nunito-bold mx-1'>Login</span></PrimaryButton>
                        ) :
                            (
                                <PrimaryButton onClick={() => { router.visit('/') }} className="mr-2 md:mr-8 bg-blue-500">
                                    <div>
                                        <GrDashboard
                                            size={10}
                                            strokeWidth={2}
                                            className="mr-2"
                                            color="#c7c7c7"
                                        />

                                    </div>
                                    <span className=' text-white nunito-bold mx-1'>Dashboard</span></PrimaryButton>
                            )}
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="hover:scale-110 duration-200 items-center p-2 text-sm text-gray-500 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 block lg:hidden"
                        >
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {
                    isOpen &&
                    <div className=' md:hidden min-w-screen'>
                        <ul className="font-medium  p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0  ">
                            <li>
                                <a href="#About" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">About</a>
                            </li>
                            <li>
                                <a href="#Team" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">QMS Team</a>
                            </li>
                            <li>
                                <a href="#Events" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Events</a>
                            </li>
                            <li>
                                <a href="#Calendar" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Calendar</a>
                            </li>
                        </ul>
                    </div>
                }
            </div>
            <div className={` overflow-x-hidden w-full md:max-w-[100vw] max-w-[100vh] mx-auto `}>
                {children}
            </div>
        </div>
    )
}

export default GuestDashboardLayout