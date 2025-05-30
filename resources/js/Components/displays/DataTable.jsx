const DataTable = ({
    headers, className, children
}) => {
    if (document.getElementById("pagination-table") && typeof simpleDatatables.DataTable !== 'undefined') {
        const dataTable = new simpleDatatables.DataTable("#pagination-table", {
            paging: true,
            perPage: 5,
            perPageSelect: [5, 10, 15, 20, 25],
            sortable: false
        });
    }


    return (
        <div className="relative overflow-x-auto sm:rounded-md ">
            <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 bg-white dark:bg-gray-900 ">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-slate-800 uppercase bg-blue-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
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
