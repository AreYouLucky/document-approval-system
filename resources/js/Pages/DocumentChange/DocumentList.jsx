import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import BreadCrumbs from '@/Components/displays/BreadCrumbs';

export default function Dashboard() {
    const tabs = [
        { name: "ISO Documents", url: "" },
    ];
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Users
                </h2>
            }
        >
            <Head title="Dashboard" />
            <BreadCrumbs tab={tabs} className="mb-2" />
            <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg py-5 px-10 shadow-xl  dark:border-gray-950">
                <Tabs aria-label="Tabs with underline" variant="underline" className=''>
                    <Tabs.Item active title="Pendings" icon={HiUserCircle}>

                    </Tabs.Item>
                    <Tabs.Item title="Approved" icon={MdDashboard}>
                        Approved
                    </Tabs.Item>
                    <Tabs.Item title="For Revisions" icon={MdDashboard}>
                        For Revisions
                    </Tabs.Item>
                    <Tabs.Item title="Rejected" icon={MdDashboard}>
                        Rejected
                    </Tabs.Item>
                </Tabs>

            </div>
        </AuthenticatedLayout>
    );
}
