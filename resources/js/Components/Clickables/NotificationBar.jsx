import { useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { Badge } from "flowbite-react";
import { HiClock } from "react-icons/hi";

export default function NotificationBar({ className = "" }) {
    const [filteredResults, setFilteredResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const searchData = [
        "Articles",
        "News",
        "Memos",
        "Upcoming Events",
        "Trainings and Seminars",
        "Organizational Structure",
    ];

    // Handle Search Input
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchTerm(query);

        if (query.length > 0) {
            const filtered = searchData.filter((item) =>
                item.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredResults(filtered);
            setIsDropdownOpen(true);
        } else {
            setIsDropdownOpen(false);
        }
    };
    const handleSelectResult = (result) => {
        setSearchTerm(result);
        setIsDropdownOpen(false);
    };

    return (
        <div className={`relative w-full mx-auto ` + className}>

            <button
                className="p-2 dark:bg-gray-700 rounded-lg text-gray-300"
            >
                <Badge
                    className="absolute -top-2 -right-2 bg-red-600 rounded-xl text-white"
                >
                    2
                </Badge>
                <IoIosNotifications size={25}/>
            </button>
            {isDropdownOpen && (
                <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-md dark:bg-gray-700 dark:border-gray-600">
                    {filteredResults.length > 0 ? (
                        filteredResults.map((result, index) => (
                            <li
                                key={index}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                onClick={() => handleSelectResult(result)}
                            >
                                {result}
                            </li>
                        ))
                    ) : (
                        <li className="p-2 text-gray-500 dark:text-gray-400">
                            No results found
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}
