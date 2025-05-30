import React from 'react'
import { useEffect, useState } from 'react';
import ApplicationLogo from '@/Components/displays/ApplicationLogo';
import ApplicationLogoDashboard from '@/Components/displays/ApplicationLogoDashboard';
import ApplicationLogoSecondary from '@/Components/displays/ApplicationLogoSecondary';

function Footer() {
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

    return (
        <footer className="text-gray-500 bg-gray-50 dark:text-gray-200 dark:bg-gray-700 px-4 py-5 w-full mx-auto md:px-8">
            {/* <div className="max-w-lg sm:mx-auto sm:text-center">

                {darkMode ? (
                    <ApplicationLogoDashboard width={'200px'} className="sm:mx-auto" />
                ) : (
                    <ApplicationLogoSecondary width={'200px'} className="sm:mx-auto" />
                )}
            </div> */}
            <div className="mt-2 items-center justify-between sm:flex">
                <div>
                    {darkMode ? (
                        <ApplicationLogoDashboard width={'200px'} className="sm:mx-auto" />
                    ) : (
                        <ApplicationLogoSecondary width={'200px'} className="sm:mx-auto" />
                    )}
                </div>
                <div className="mt-4 sm:mt-0">
                    &copy; 2025 QMS Portal All rights reserved.
                </div>
                {/* <div className="mt-6 sm:mt-0">
                    <ul className="flex items-center space-x-4">
                        <li className="w-10 h-10 border rounded-full flex items-center justify-center">
                           
                        </li>

                        <li className="w-10 h-10 border rounded-full flex items-center justify-center">
                            
                        </li>
                    </ul>
                </div> */}
            </div>
        </footer>
    )
}

export default Footer