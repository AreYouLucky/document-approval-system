import { useState } from "react";

export default function SearchBar({className = ""}) {
    const [searchTerm, setSearchTerm] = useState("");
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
        <div className={`relative w-full ` + className}>
            <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
                Search
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                    </svg>
                </div>
                <input
                    type="search"
                    id="default-search"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search any keyword"
                    required
                />
            </div>
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
