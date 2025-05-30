import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import SearchInput from '@/Components/Forms/SearchInput';
import SelectFields from '@/Components/Forms/SelectInput'
import BreadCrumbs from '@/Components/displays/BreadCrumbs';
import DataTable from '@/Components/displays/DataTable';
import PrimaryButton from '@/Components/Forms/PrimaryButton';
import { useState, useEffect } from 'react';
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import RoleForm from './RoleForm';

export default function Dashboard() {
    const tabs = [
        { name: "Users", url: "" },
    ];
    const [data, setData] = useState(
        {
            id: '',
            full_name: '',
            role: '',
            image_path: ''
        })
    const [users, setUsers] = useState([]);
    const [currentUsers, setCurrentUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleSearch, setRoleSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showRoleForm, setShowRoleForm] = useState(false);
    const itemsPerPage = 10;

    const [loading, setLoading] = useState(false);
    const headers = [{
        name: "Name",
        position: 'start'
    },
    {
        name: "Employee ID",
        position: 'start'
    },
    {
        name: "Email",
        position: 'start'
    },
    {
        name: "Role",
        position: 'center'
    },
    {
        name: "Actions",
        position: 'center'
    }];
    const user_type = [
        { name: "Process Owner", value: 2 },
        { name: "Document Custodian", value: 3 },
        { name: "Division Chief", value: 4 },
        { name: "QMR", value: 5 },
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        PaginateUsers()
    }, [currentPage]);

    useEffect(() => {
        filteredUsers()
    }, [searchTerm])

    useEffect(() => {
        PaginateUsers()
    }, [users])

    useEffect(() => {
        filteredUsersByRole()
    }, [roleSearch])

    const fetchUsers = () => {
        setLoading(true)
        axios.get('/load-users').then(
            res => {
                setUsers(res.data);
                setCurrentUsers(res.data)
                setLoading(false)
            }
        )
    };

    const closeRoleForm = () => {
        fetchUsers()
        setShowRoleForm(false);
    };
    const openRoleForm = () => {
        setShowRoleForm(true);
    };
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };
    const filteredUsers = () => {
        let userFiltered = users.filter((user) =>
            user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))

        setCurrentUsers(userFiltered.slice(indexOfFirst, indexOfLast));
    }

    const handleRoleSearch = (e) => {
        setRoleSearch(e.target.value)
        setCurrentPage(1)
    }

    const filteredUsersByRole = () => {
        if (roleSearch === 'Role') {
            PaginateUsers()
        }
        else {
            let userFiltered = users.filter((user) =>
                user.qms_role.toLowerCase().includes(roleSearch.toLowerCase()))
            setCurrentUsers(userFiltered.slice(indexOfFirst, indexOfLast));
        }
    }

    const PaginateUsers = () => {
        setCurrentUsers(users.slice(indexOfFirst, indexOfLast));
    }

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const count = {
        from: users.length === 0 ? 0 : indexOfFirst + 1,
        to: Math.min(indexOfLast, users.length),
        total: users.length,
    };
    const isPrevDisabled = currentPage === 1;
    const isNextDisabled = indexOfLast >= users.length;
    const nextPage = () => {
        if (!isNextDisabled) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const prevPage = () => {
        if (!isPrevDisabled) {
            setCurrentPage((prev) => prev - 1);
        }
    };
    const popEditRole = (id,full_name, role, image_path) => {
        setData(prevData => ({
            ...prevData,
            id,
            full_name,
            role,
            image_path
        }));
        openRoleForm()
    };




    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Users
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="w-full">
                <BreadCrumbs tab={tabs} className="mb-2" />
                <div className='bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-50 w-full rounded-lg pt-10 mb-5 px-10 shadow-xl border border-blue-200 dark:border-gray-950'>
                    <div className='w-full flex justify-between align-middle mb-4'>
                        <div>
                            <SearchInput
                                placeholder="Search Name"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className=''>
                            <SelectFields
                                id="process_type"
                                items={user_type}
                                itemValue="name"
                                itemName="name"
                                name="process_type"
                                defaultValue='Role'
                                onChange={handleRoleSearch}
                            />
                        </div>

                    </div>
                    <DataTable headers={headers}>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={headers.length}
                                    className="text-center py-4"
                                >
                                    <div className="flex justify-center items-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                        <span className="ml-3 text-gray-500">
                                            Loading...
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ) : currentUsers.length > 0 ? (
                            currentUsers.map((item, index) => (
                                <tr key={index} className="bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700  hover:bg-gray-200 dark:hover:bg-gray-600" >
                                    <th scope="row" className="flex items-center px-6 py-3 text-gray-900 whitespace-nowrap dark:text-white">
                                        <img className="w-10 h-10 rounded-full" src="/storage/images/user.png" />
                                        <div className="ps-3">
                                            <div className="text-sm font-semibold">{item.full_name}</div>
                                            <div className=" text-sm text-gray-500">{item.position}</div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-1">
                                        {item.username}
                                    </td>
                                    <td className="px-6 py-1">
                                        {item.email}
                                    </td>
                                    <td className="px-6 py-1">
                                        {item.qms_role}
                                    </td>
                                    <td className="px-6 py-1">
                                        <PrimaryButton className="px-2 py-1 text-xs bg-blue-500 text-white" onClick={() => popEditRole(item.id,item.full_name, item.qms_role, item.image_path)}>Edit Role</PrimaryButton>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr >
                            <td
                                colSpan={headers.length}
                                className="text-center px-6 py-4  text-gray-800 dark:text-gray-50"
                            >
                                No Available Data
                            </td>
                        </tr>
                        )}


                    </DataTable>
                    <div className='w-full flex justify-between py-5'>
                        <div>
                            <span className="text-sm text-gray-700 dark:text-gray-400">
                                Showing <span className="font-semibold text-gray-900 dark:text-white">{count.from}</span> to <span className="font-semibold text-gray-900 dark:text-white">{count.to}</span> of <span className="font-semibold text-gray-900 dark:text-white">{count.total}</span> Entries
                            </span>
                        </div>
                        <div className='flex'>
                            <button
                                onClick={prevPage}
                                disabled={isPrevDisabled}
                                className={`flex items-center justify-center px-3 h-8 me-3 text-sm font-medium border rounded-lg ${isPrevDisabled
                                    ? "text-gray-400 bg-gray-200 cursor-not-allowed dark:border border-gray-50 dark:bg-transparent"
                                    : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:border border-gray-50 dark:bg-transparent"
                                    }`}
                            >
                                <GrLinkPrevious size={15} className="mr-2" />
                                Prev
                            </button>
                            <button
                                onClick={nextPage}
                                disabled={isNextDisabled}
                                className={`flex items-center justify-center px-3 h-8 text-sm font-medium border rounded-lg ${isNextDisabled
                                    ? "text-gray-400 bg-gray-200 cursor-not-allowed dark:border border-gray-50 dark:bg-transparent"
                                    : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:border border-gray-50 dark:bg-transparent"
                                    }`}

                            >
                                Next
                                <GrLinkNext size={15} className="ml-2" />
                            </button>
                        </div>
                    </div>
                    <RoleForm show={showRoleForm} onClose={closeRoleForm} data={data}/>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
