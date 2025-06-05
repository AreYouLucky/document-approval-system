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
        <footer className="text-gray-500 bg-gray-50 dark:text-gray-200 dark:bg-gray-900 px-4 py-5 w-full mx-auto md:px-8">
            <div className="mt-2 items-center md:justify-between justify-center flex-col md:flex-row flex">
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
            </div>
        </footer>
    )
}

export default Footer