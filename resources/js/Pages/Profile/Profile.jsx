import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import BreadCrumbs from '@/Components/displays/BreadCrumbs';


export default function Dashboard() {
    const user = usePage().props.auth.user;
    const avatarSrc = user.image_path
        ? `http://hris.stii.local/frontend/hris/images/user_image/${user.image.path}`
        : "/storage/images/user.png";
    const tabs = [
        { name: "Profile", url: "/users" },
    ];
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="px-10 py-5">
                <BreadCrumbs tab={tabs} className="mb-2" />
                <section className="relative pt-52 shadow-md">
                    <div className='w-full rounded-lg'>
                        <img src="/storage/images/banner.png" alt="cover-image" className="w-full absolute top-0 left-0 z-0 h-72 object-cover rounded-t-lg"/>
                        <div className="w-full  mx-auto px-6 md:px-12 bg-gray-100 dark:bg-gray-800 pb-10 rounded-b-lg">
                            <div className="flex items-center justify-center sm:justify-start relative z-10 mb-2">
                                <img src={avatarSrc} alt="user-avatar-image" className="border-4 border-solid border-white rounded-full object-contain w-40 bg-white" />
                            </div>
                            <div className="flex flex-col sm:flex-row max-sm:gap-5 items-center justify-between mb-5">
                                <div className="block">
                                    <h3 className="font-manrope font-bold text-4xl text-gray-900 dark:text-white mb-1">{user.full_name}</h3>
                                    <p className="text-2xl leading-7 text-gray-500">{user.qms_role}</p>
                                </div>
                                <button
                                    className="rounded-full py-3.5 px-5 dark:bg-gray-200 bg-blue-600  flex items-center group transition-all duration-500 hover:bg-indigo-100 ">
                                    <span
                                        className="px-2 font-medium text-base leading-7 dark:text-gray-800 text-white transition-all duration-500 group-hover:text-indigo-600">{user.position}</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </section>

            </div>
        </AuthenticatedLayout>
    );
}
