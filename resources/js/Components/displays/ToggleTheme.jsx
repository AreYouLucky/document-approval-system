import { HiSun, HiMoon } from "react-icons/hi";

export default function ToggleTheme({ darkMode, setDarkMode, className = "" }) {
    const toggleTheme = () => setDarkMode(!darkMode);

    return (
        <div className={` relative w-full  ` + className}>
            <button
                onClick={toggleTheme}
                className="p-2 rounded-lg dark:text-gray-300 text-yellow-300"
            >
                {darkMode ? <HiMoon className="w-6 h-6" />  : <HiSun className="w-6 h-6 " />}
            </button>
        </div>
    );
}
