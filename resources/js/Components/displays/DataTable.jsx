const DataTable = ({
    headers, children
}) => {



    return (
        <div className="relative overflow-visible sm:rounded-md">

            <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 bg-white dark:bg-gray-900 ">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-md ">
                    <thead className="text-xs text-gray-50 uppercase bg-blue-500 dark:bg-gray-700 dark:text-gray-400 ">
                        <tr >
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="border-b roboto-regular text-sm"
                                >
                                    <span className={`flex items-center px-6 py-3 ${header.position === 'center' ? 'justify-center' : 'justify-start'}`}>
                                        {header.name}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {children}
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default DataTable;
