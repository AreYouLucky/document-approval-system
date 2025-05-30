import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useRef } from 'react';
import Jombotron from './Partials/Jombotron';
import IsoDocuments from './Contents/IsoDocuments';
import QualityPolicy from './Contents/QualityPolicy';
import Announcements from './Contents/Announcements';
import Footer from './Contents/Footer';
import EventsCarousel from './Contents/EventsCarousel';
import FancyButton from '@/Components/Forms/FancyButton';
import OrganizationalChart from './Contents/OrganizationalChart';
import Mandates from './Contents/Mandates';
import MissionVision from './Contents/MissionVision';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="w-full">
                <div className='w-full '>
                    <Jombotron />
                    <div className='w-full bg-white dark:bg-gray-800 md:py-8 py-2 bg-opacity-70'>
                        <div className='grid lg:grid-cols-3  grid-cols-1 max-w-[100vw] md:max-w-[70vw] lg:max-w-[80vw] mx-auto gap-2 md:px-10'>
                            <div className='col-span-1 lg:col-span-2 md:py-5'>
                                <QualityPolicy />
                            </div>
                            <div className='hover:scale-105 duration-500'>
                                <Announcements />
                            </div>
                        </div>
                    </div>
                    <IsoDocuments />
                    <div className='w-full bg-white dark:bg-gray-800 md:py-8 py-2 bg-opacity-70'>
                        <div className='grid lg:grid-cols-2  grid-cols-1 max-w-[100vw] md:max-w-[70vw] lg:max-w-[80vw] mx-auto gap-4 md:px-10'>
                            <div className=' p-10 rounded-lg'>
                                <MissionVision />
                            </div>
                            <div className=' p-10 rounded-lg'>
                                <Mandates />
                            </div>
                        </div>
                    </div>
                    <div className='w-full bg-gray-100 dark:bg-gray-700 pt-8 pb-4'>
                        <OrganizationalChart />
                    </div>
                    <div className='w-full bg-white dark:bg-slate-800 py-2'>
                        <div className='w-full max-w-[100vw] md:max-w-[70vw] lg:max-w-[80vw] py-2 items-center px-10 md:px-10 mx-auto'>
                            <div className='py-8'>
                                <div className='w-full pb-2'>
                                    <h2 className='text-center text-2xl roboto-bold'>Recent Events</h2>
                                </div>
                                <EventsCarousel />
                                <div className='w-full pt-3 flex justify-center'>
                                    <FancyButton className='border-2 rounded-lg'>Discover More</FancyButton>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='bg-gray-100 dark:bg-gray-700 md:px-12 px-5 py-8'>
                        <div className='max-w-[100vw] md:max-w-[70vw] lg:max-w-[80vw] mx-auto px-4'>
                            <div className='w-full pb-5'>
                                <h2 className='text-center text-2xl roboto-bold'>Events Calendar</h2>
                            </div>
                            <iframe
                                src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FManila&showPrint=0&src=cW1zLnN0aWlAZ21haWwuY29t&src=ZW4ucGhpbGlwcGluZXMjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23039BE5&color=%230B8043"
                                style={{ borderRadius: '20px', border: '10px solid rgb(255,255,255)' }}
                                width="98%"
                                className='h-[300px] md:h-[500px] lg:h-[700px]'
                                title="Google Calendar"
                            ></iframe>
                        </div>
                    </div>
                    {/* <Footer /> */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
