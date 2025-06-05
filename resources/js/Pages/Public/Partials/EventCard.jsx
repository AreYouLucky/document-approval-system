import React from 'react'
import { useState } from 'react'
import EventModal from '../Contents/EventModal';

function EventCard({ data }) {
    const [showEventModal,setShowEventModal] = useState(false)
    const convertDate = (date) => {
        if (!date) return "";
        const parsedDate = new Date(date);
        return parsedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };
    return (
        <>
            <article className="hover:scale-105 duration-500 relative lg:pt-[160px] md:pt-[260px] pt-[130px]  shadow-xl rounded-lg mx-auto h-[450px] border overflow-hidden bg-white dark:bg-transparent w-full">
                <button className='w-full' onClick={()=>setShowEventModal(true)}>
                    <div className="w-full rounded-lg">
                        <div className="absolute top-0 left-0 w-full h-100 rounded-t-lg  z-0 ">
                            <img src={`/storage/images/events/${data.title}/${data.img}`} alt="" className="w-full h-[50%] object-cover" />
                        </div>
                        <div className="w-full px-4 pb-4 mt-2 pt-2 bg-white dark:bg-gray-800 rounded-b-lg relative z-10 min-h-[300px]">
                            <div className=" ml-4 mr-2 mb-3 p-3">
                                <h3 className="text-xl text-gray-700 dark:text-gray-50 text-start nunito-bold mb-2">
                                    {data.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-100 text-sm mt-1 text-justify roboto-thin">{data.desc.length > 200 ? `${data.desc.substring(0, 280)}...` : data.desc}</p>
                                <p className='text-gray-400 text-start mt-2'>{data.date}</p>
                            </div>
                        </div>
                    </div>
                </button>
            </article>
            <EventModal show={showEventModal} onClose={() => setShowEventModal(false)} data={data} />
        </>
    )
}

export default EventCard