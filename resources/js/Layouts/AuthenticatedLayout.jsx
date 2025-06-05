
import SideNav from '@/Components/displays/SideNav';
import ApplicationLogoDashboard from '@/Components/displays/ApplicationLogoDashboard';
import ApplicationLogoSecondary from '@/Components/displays/ApplicationLogoSecondary';
import { useState, useEffect } from 'react';
import ToggleTheme from '@/Components/displays/ToggleTheme';
import { usePage } from '@inertiajs/react';
export default function AuthenticatedLayout({ header, children }) {
    const [isOpen, setIsOpen] = useState(true);
    const { auth } = usePage().props;
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
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
        <div className='min-h-screen roboto-thin text-sm bg-blue-50 dark:bg-gray-900 dark:text-white w-full max-w-full overflow-x-hidden '>
            <SideNav isOpen={isOpen} setIsOpen={setIsOpen} user={auth.user} />
            <div className={`transition-all duration-300 ${isOpen ? "md:ml-64" : "ml-0"}`}>
                <div className="w-full flex justify-between items-center py-3 dark:bg-gray-950 bg-white shadow-md border-b animate-slideInUp">
                    <div className="flex">
                        <div className='flex items-center'>

                            <button
                                type="button"
                                onClick={() => setIsOpen(!isOpen)}
                                className="hover:scale-110 duration-200 items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 hidden md:block"
                            >
                                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>
                            {darkMode ? (
                                <ApplicationLogoDashboard className="mx-2 mr-10 md:w-52 w-32" />
                            ) : (
                                <ApplicationLogoSecondary className="mx-2 mr-10 md:w-52 w-32" />
                            )}
                        </div>
                    </div>
                    <div className="flex items-center ">
                        <ToggleTheme darkMode={darkMode} setDarkMode={setDarkMode} className="mr-8" />
                        <button onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center py-2 pr-6  text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden">
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className={` overflow-x-hidden w-full md:max-w-[100vw] max-w-[100vh] mx-auto animate-slideInRight  `}>
                    {children}
                </div>
            </div>
        </div>
    );
}
