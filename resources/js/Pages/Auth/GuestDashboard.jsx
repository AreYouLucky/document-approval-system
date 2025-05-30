import React from 'react'
import GuestLayout from '@/Layouts/GuestLayout'
import Jombotron from '../Public/Partials/Jombotron';
import QualityPolicy from '../Public/Contents/QualityPolicy';
import Announcements from '../Public/Contents/Announcements';
import Footer from '../Public/Contents/Footer';
import EventsCarousel from '../Public/Contents/EventsCarousel';
import FancyButton from '@/Components/Forms/FancyButton';
import OrganizationalChart from '../Public/Contents/OrganizationalChart';

function GuestDashboard() {
  return (
    <GuestLayout>
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
                    <div className='w-full bg-white dark:bg-gray-700 py-8'>
                        <OrganizationalChart />
                    </div>
                    <div className='w-full bg-gray-100 dark:bg-slate-800 md:py-8 py-2'>
                        <div className='grid lg:grid-cols-4 grid-cols-1 max-w-[100vw] md:max-w-[70vw] lg:max-w-[80vw] mx-auto py-2 items-center px-2 md:px-10 gap-4 '>
                            <div className="w-full h-fit rounded-lg  text-gray-50  p-2">
                                <div className=''>
                                    <iframe
                                        src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FManila&showPrint=0&src=cW1zLnN0aWlAZ21haWwuY29t&src=ZW4ucGhpbGlwcGluZXMjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23039BE5&color=%230B8043"
                                        style={{ borderRadius: '10px', border: '10px solid rgb(255,255,255)' }}
                                        width="98%"
                                        height="280"
                                        frameBorder="0"
                                        scrolling="no"
                                        title="Google Calendar"
                                    ></iframe>
                                </div>
                            </div>
                            <div className=' col-span-3 px-5 py-8 bg-white dark:bg-gray-900 rounded-lg shadow-md'>
                                <div className='w-full'>
                                    <h2 className='text-center text-2xl roboto-bold'>Recent Events</h2>
                                </div>
                                <EventsCarousel />
                                <div className='w-full pt-3 flex justify-center'>
                                    <FancyButton className='border-2 rounded-lg'>Discover More</FancyButton>
                                </div>
                            </div>
                        </div>

                    </div>
                    <Footer />
                </div>
            </div>
    </GuestLayout>
  )
}

export default GuestDashboard