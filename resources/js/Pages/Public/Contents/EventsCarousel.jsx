import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import {Pagination, Autoplay } from 'swiper/modules';
import EventCard from '../Partials/EventCard';



function EventsCarousel() {
    const [slidesPerView, setSlidesPerView] = useState(getSlidesPerView());

    function getSlidesPerView() {
        const width = window.innerWidth;
        if (width < 1020) return 1;
        return 3;
    }

    useEffect(() => {
        const handleResize = () => {
            setSlidesPerView(getSlidesPerView());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const posts = [
        {
            title: "External audit for ISO Recertification",
            desc: "An external audit for ISO recertification of DOST-STII was conducted on November 15, 2024. The audit assessed the institute's compliance with ISO standards, and DOST-STII successfully passed, reaffirming its commitment to quality and continuous improvement.",
            img: "i.jpg",
            date: "Nov 15, 2024",
            id: "javascript:void(0)"
        },
        {
            title: "ISO 90012015 Awareness Seminar",
            desc: "On October 17, 2024, DOST-STII held an ISO 9001:2015 Awareness Seminar to strengthen staff understanding of quality management principles. The session supported the institute’s commitment to continuous improvement and readiness for recertification.",
            img: "c.jpg",
            date: "Oct 17, 2024",
            id: "javascript:void(0)"
        },
        {
            title: "QMS Day",
            desc: "DOST-STII celebrated QMS Day on September 26, 2024, highlighting its commitment to quality and continuous improvement. The event featured activities that promoted awareness and engagement in the institute’s Quality Management System.",
            img: "g.jpg",
            date: " Sept 26, 2024",
            id: "javascript:void(0)"
        },
        {
            title: "Training on ISO 190112018",
            desc: "DOST-STII conducted a training on ISO 19011:2018 Guidelines for Auditing Management Systems from June 24 to 27, 2024. The training aimed to enhance the auditing skills of personnel and ensure effective implementation and evaluation of the institute’s Quality Management System.",
            img: "b.jpg",
            date: "June 24-27, 2024",
            id: "javascript:void(0)"
        },
        
    ]

    return (
        <>
            <Swiper
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={slidesPerView}
                spaceBetween={30}
                loop={true}
                autoplay={{
                    delay: 6000,
                    disableOnInteraction: false,
                }}
                pagination={false}
                modules={[Pagination, Autoplay]}
                className=""
            >
                {posts.map((post, key) => (
                    <SwiperSlide key={key} className='py-4'>
                        <EventCard data={post}/>
                    </SwiperSlide>))}
            </Swiper>
        </>
    )
}

export default EventsCarousel