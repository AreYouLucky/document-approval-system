
import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import Jombotron from './Jombotron';
import IsoDocuments from '../Contents/IsoDocuments';
import QualityPolicy from '../Contents/QualityPolicy';
import Announcements from '../Contents/Announcements';
import Footer from '../Contents/Footer';
import EventsCarousel from '../Contents/EventsCarousel';
import FancyButton from '@/Components/Forms/FancyButton';
import OrganizationalChart from '../Contents/OrganizationalChart';
import Mandates from '../Contents/Mandates';
import MissionVision from '../Contents/MissionVision';
import IQATeam from '../Contents/IQATeam';
import RMCTeam from '../Contents/RMCTeam';
import ViewMore from '@/Components/Clickables/ViewMore';
import LazySection from '@/Components/Framers';
function DashboardContent() {
    const user = usePage().props.auth.user;
    const [isViewMore, setIsViewMore] = useState(true)
    return (
        <div className="w-full">
            <div className='w-full '>
                <Jombotron id="About" />
                <LazySection animation="fade-right">
                    <div className='w-full bg-white dark:bg-gray-800 md:py-10 py-2 bg-opacity-70 ' >
                        <div className='grid lg:grid-cols-3  grid-cols-1 max-w-[100vw] md:max-w-[70vw] lg:max-w-[80vw] mx-auto gap-2 md:px-3'>
                            <div className='col-span-1 lg:col-span-2 md:py-5 my-auto md:pr-7'>
                                <QualityPolicy />
                            </div>
                            <LazySection animation="fade-up">
                                <div className='hover:scale-105 duration-500 md:px-1 px-3'>
                                    <Announcements />
                                </div>
                            </LazySection>
                        </div>
                    </div>
                </LazySection>
                <LazySection animation="fade-left">
                    <IsoDocuments />
                </LazySection>
                <div className='w-full bg-gray-50 dark:bg-gray-800 md:py-12 py-2 bg-opacity-70'>
                    <LazySection animation="fade-up">
                        <div className='grid lg:grid-cols-2  grid-cols-1 max-w-[100vw] md:max-w-[70vw] lg:max-w-[80vw] mx-auto gap-10 px-4 '>
                            <MissionVision />
                            <Mandates />
                        </div>
                    </LazySection>
                </div>
                <div className='w-full bg-gray-100 dark:bg-gray-700 py-10' id="Team">
                    <LazySection animation="zoom-in">
                        <OrganizationalChart />
                    </LazySection>
                    <LazySection animation="fade-up">
                        <div
                            className={`w-full transition-all duration-500 ease-in-out transform 
                                        ${isViewMore ? 'opacity-0 scale-95 h-0 overflow-hidden' : 'opacity-100 scale-100'}`}>
                            <RMCTeam />
                            <IQATeam />
                        </div>

                        <div className='w-full mt-5 justify-center flex items-center'>
                            <ViewMore checked={isViewMore} onChange={() => setIsViewMore(!isViewMore)} />
                        </div>
                    </LazySection>

                </div>
                <LazySection animation="fade-right">
                    <div className='w-full bg-white dark:bg-slate-800 py-2 md:py-10' id="Events">
                        <div className='w-full max-w-[100vw] md:max-w-[70vw] lg:max-w-[80vw] py-2 items-center px-10 md:px-10 mx-auto'>
                            <div className='py-8'>
                                <div className='w-full pb-2'>
                                    <h2 className='text-center text-2xl roboto-bold'>Recent Events</h2>
                                </div>
                                <EventsCarousel />
                            </div>
                        </div>

                    </div>
                </LazySection>
                <LazySection animation="fade-left">
                    <div className='bg-gray-100 dark:bg-gray-700 md:px-12 py-10' id="Calendar">
                        <div className='max-w-[100vw] md:max-w-[70vw] lg:max-w-[80vw] mx-auto px-4 md:px-6 flex items-center flex-col'>
                            <div className='w-full pb-5'>
                                <h2 className='text-center text-2xl roboto-bold'>Events Calendar</h2>
                            </div>
                            <iframe
                                src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FManila&showPrint=0&src=cW1zLnN0aWlAZ21haWwuY29t&src=ZW4ucGhpbGlwcGluZXMjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23039BE5&color=%230B8043"
                                style={{ borderRadius: '10px', border: '2px solid rgb(255,255,255)' }}
                                width="98%"
                                className='h-[300px] md:h-[500px] lg:h-[700px]'
                                title="Google Calendar"
                            ></iframe>
                        </div>
                    </div>
                    <Footer />
                </LazySection>
            </div>
        </div>
    )
}

export default DashboardContent